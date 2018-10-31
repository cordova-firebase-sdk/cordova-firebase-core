"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cordova_1 = require("cordova");
var es6_promise_1 = require("es6-promise");
var common_1 = require("./common");
var commandQueue = [];
var isWaitMethod;
var isExecuting;
var executingCnt = 0;
var MAX_EXECUTE_CNT = 10;
var stopRequested = false;
window.addEventListener("unload", function () {
    stopRequested = true;
}, {
    once: true,
});
exports.execCmd = function (params) {
    params.execOptions = params.execOptions || {};
    params.args = params.args || [];
    // If the instance has been removed, do not execute any methods on it
    // except remove function itself.
    if (params.context.isRemoved && params.execOptions.remove) {
        console.error("[ignore]" + params.context.id + "." + params.methodName + ", because removed.");
        return es6_promise_1.Promise.resolve();
    }
    // If the overlay is not ready in native side,
    // do not execute any methods except remove on it.
    if (!params.context.isReady && !params.execOptions.remove) {
        console.error("[ignore]" + params.context.id + "." + params.methodName + ", because it's not ready.");
        return es6_promise_1.Promise.resolve();
    }
    return new es6_promise_1.Promise(function (resolve, reject) {
        commandQueue.push({
            execOptions: params,
            onSuccess: function () {
                // -------------------------------
                // success callback
                // -------------------------------
                var results = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    results[_i] = arguments[_i];
                }
                // Even if the method was successful,
                // but the _stopRequested flag is true,
                // do not execute further code.
                if (!stopRequested) {
                    resolve(results);
                }
                else {
                    // Page will be destroyed.
                    return;
                }
                if (params.methodName === "isWaitMethod") {
                    isWaitMethod = null;
                }
                executingCnt--;
                common_1.nextTick(privateExec);
            },
            onError: function () {
                var results = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    results[_i] = arguments[_i];
                }
                // -------------------------------
                // error callback
                // -------------------------------
                if (!stopRequested) {
                    reject(results);
                }
                else {
                    // Page will be destroyed.
                    return;
                }
                if (params.methodName === "isWaitMethod") {
                    isWaitMethod = null;
                }
                executingCnt--;
                common_1.nextTick(privateExec);
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
    common_1.nextTick(privateExec);
};
var privateExec = function () {
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
    var task;
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
            cordova_1.exec(task.onSuccess, task.onError, task.context.id, task.methodName, task.args);
            break;
        }
        cordova_1.exec(task.onSuccess, task.onError, task.pluginName || task.context.id, task.methodName, task.args);
    }
    isExecuting = false;
};
