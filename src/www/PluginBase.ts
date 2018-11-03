import { BaseClass } from "./BaseClass";

/**
 * PluginBase class base class of this plugin.
 */
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

  public get id(): string {
    return this._id;
  }

  public get isReady(): boolean {
    return this._isReady;
  }

}
