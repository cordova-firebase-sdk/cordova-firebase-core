import { PluginBase } from "../PluginBase";

export class Database extends PluginBase {
  public app: any;

  public _isReady: boolean;

  private _options: any;

  constructor(app: any, options?: any) {
    super("Database");
    this.app = app;
    this._options = options;
    this._one("fireAppReady", () => {
      this._isReady = true;
    });
  }
}
