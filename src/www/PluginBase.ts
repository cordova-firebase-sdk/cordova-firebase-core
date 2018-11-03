import { BaseClass } from "./BaseClass";

/**
 * PluginBase class base class of this plugin.
 */
export class PluginBase extends BaseClass {

  public isRemoved: boolean;

  protected _isReady: boolean;

  private _id: string;

  protected _queue: BaseArrayClass = new BaseArrayClass();

  /**
   * @constructor
   * @param idSuffix - Plugin's ID suffix
   */
  public constructor(idSuffix: string) {
    super();
    this._id = this.hashCode + "_" + idSuffix;

    this._queue._on("insert_at", (): void => {
      if (!this._isReady) {
        return;
      }
      if (this._queue._getLength() > 0) {
        const cmd: any = this._queue._removeAt(0, true);
        if (cmd && cmd.context && cmd.methodName) {
          execCmd(cmd).then(cmd.resolve).catch(cmd.reject);
        }
      }
      if (this._queue._getLength() > 0) {
        this._queue._trigger("insert_at");
      }
    });
  }

  public get id(): string {
    return this._id;
  }

  public get isReady(): boolean {
    return this._isReady;
  }

  private exec(params: IExecCmdParams): Promise<any> {
    return new Promise((resolve, reject) => {
      params.resolve = resolve;
      params.reject = reject;
      this._queue._push(params);
    });
  }

}
