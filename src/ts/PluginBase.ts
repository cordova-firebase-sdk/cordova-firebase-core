import { BaseClass } from "./BaseClass";

export class PluginBase extends BaseClass {

  public isReady: boolean;

  public isRemoved: boolean;

  private _id: string;

  /**
   * @constructor
   * @param id - Plugin's ID
   */
  public constructor(id: string) {
    super();
    this._id = id;
  }

  get id(): string {
    return this._id;
  }
}
