import { nextTick } from "./common";

interface ITask {

  "execOptions": any;

  "args": any[];

  "pluginName": [];
}

export class CommandQueue {

  private queue: ITask[];

}
