import { BaseClass } from "../BaseClass";

export class Database extends BaseClass {
  public app: any;

  public _isReady: boolean;

  private _options: any;

  constructor(app: any, options?: any) {
    super();
    this.app = app;
    this._options = options;
    this._one("fireAppReady", () => {
      this._isReady = true;
    });
  }
}
