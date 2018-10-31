import { BaseClass } from "./BaseClass";

export class PluginBase extends BaseClass {

  public isRemoved: boolean;

  protected _isReady: boolean;

  private _id: string;

  /**
   * @constructor
   * @param idSuffix - Plugin's ID suffix
   */
  public constructor(idSuffix: string) {
    super();
    this._id = this.hashCode + "_" + idSuffix;
  }

  get id(): string {
    return this._id;
  }

  get isReady(): boolean {
    return this._isReady;
  }
}
