import { exec } from "cordova";
import { Promise } from "es6-promise";
import { nextTick } from "./common";
import { PluginBase } from "./PluginBase";

/**
 * Parameters for execCmd function
 */
export interface IExecCmdParams {

  /**
   * Plugin's context
   */
  context: PluginBase;

  /**
   * Execute method name
   */
  methodName: string;

  /**
   * parameters for native side
   */
  options?: any[];

  /**
   * synchronize options
   */
  execOptions?: {
    sync?: boolean;
    remove?: boolean;
  };

}

const commandQueue: any[] = [];
let isWaitMethod: string;
let isExecuting: boolean;
let executingCnt: number = 0;
const MAX_EXECUTE_CNT: number = 10;

let stopRequested: boolean = false;
window.addEventListener("unload", () => {
  stopRequested = true;
}, {
  once: true,
});

export const execCmd = (params: IExecCmdParams): Promise<any> => {
  params.execOptions = params.execOptions || {};
  params.options = params.options || [];

  // If the instance has been removed, do not execute any methods on it
  // except remove function itself.
  if (params.context.isRemoved && params.execOptions.remove) {
    console.error("[ignore]" + params.context.id + "." + params.methodName + ", because removed.");
    return Promise.resolve();
  }

  // If the overlay is not ready in native side,
  // do not execute any methods except remove on it.
  if (!params.context.isReady && !params.execOptions.remove) {
    console.error("[ignore]" + params.context.id + "." + params.methodName + ", because it's not ready.");
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    commandQueue.push({
      execOptions: params,

      onSuccess: (...results: any[]) => {
        // -------------------------------
        // success callback
        // -------------------------------

        // Even if the method was successful,
        // but the _stopRequested flag is true,
        // do not execute further code.
        if (!stopRequested) {
          resolve(results);
        } else {
          // Page will be destroyed.
          return;
        }

        if (params.methodName === "isWaitMethod") {
          isWaitMethod = null;
        }

        executingCnt--;
        nextTick(privateExec);
      },

      onError: (...results: any[]) => {
        // -------------------------------
        // error callback
        // -------------------------------
        if (!stopRequested) {
          reject(results);
        } else {
          // Page will be destroyed.
          return;
        }

        if (params.methodName === "isWaitMethod") {
          isWaitMethod = null;
        }

        executingCnt--;
        nextTick(privateExec);
      },

    });
  });

  // In order to execute all methods in safe,
  // the maps plugin limits the number of execution in a moment to 10.
  //
  // Note that Cordova-Android drops has also another internal queue,
  // and the internal queue drops our statement if the app send too much.
  //
  // Also executing too much statements at the same time,
  // it would cause many errors in native side, such as out-of-memory.
  //
  // In order to prevent these troubles, the maps plugin limits the number of execution is 10.
  if (isExecuting || executingCnt >= MAX_EXECUTE_CNT || isWaitMethod || commandQueue.length === 0) {
    return;
  }

  nextTick(privateExec);
};


const privateExec = () => {

  // You probably wonder why there is this code because it's already simular code at the end of the execCmd function.
  //
  // Because the commandQueue might change after the last code of the execCmd.
  // (And yes, it was occurred.)
  // In order to block surely, block the execution again.
  if (isExecuting || executingCnt >= MAX_EXECUTE_CNT || isWaitMethod || commandQueue.length === 0) {
    return;
  }

  isExecuting = true;

  // Execute some execution requests (up to 10) from the commandQueue
  let task: any;
  while (commandQueue.length > 0 && executingCnt < MAX_EXECUTE_CNT) {
    if (!stopRequested) {
      executingCnt++;
    }

    // Pick up the head one.
    task = commandQueue.shift();

    // push out normal tasks if stopRequested becomes true
    if (stopRequested && !task.execOptions.remove) {
      executingCnt--;
      continue;
    }

    // Some methods have to block other execution requests.
    if (task.execOptions.sync) {
      isWaitMethod = task.methodName;
      // console.log(`[sync start] ${commandParams.args[2]}.${methodName}`);
      exec(task.onSuccess, task.onError, task.context.id, task.methodName, task.options);
      break;
    }

    exec(task.onSuccess, task.onError, task.context.id, task.methodName, task.options);
  }

  isExecuting = false;
};
