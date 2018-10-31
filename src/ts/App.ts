import { Promise } from "es6-promise";
import { execCmd } from "./CommandQueue";
import { isInitialized } from "./common";
import { PluginBase } from "./PluginBase";

export interface IAppInitializeOptions {

  /**
   * Auth / General Use
   */
  apiKey?: string;

  /**
   * Auth with popup/redirect
   */
  authDomain?: string;

  /**
   * Realtime Database
   */
  databaseURL?: string;

  /**
   * Storage
   */
  storageBucket?: string;

  /**
   * Cloud Messaging
   */
  messagingSenderId?: string;
}

export class App extends PluginBase {

  public name: string = "[DEFAULT]";

  private _options: IAppInitializeOptions = {
    apiKey: null,
    authDomain: null,
    databaseURL: null,
    messagingSenderId: null,
    storageBucket: null,
  };

  private _isInitialized: boolean;

  /**
   * @constructor
   * @param [name] - Application name. Default value is "[DEFAULT]"
   * @param [initOptions] - Application initialize option.
   *  This parameter is for {@link: plugin.firebase.initializeApp()} method.
   */
  constructor(name?: string, initOptions?: IAppInitializeOptions) {
    super("fireapp");

    this._isReady = true;
    this._options = {
      apiKey: initOptions.apiKey || null,
      authDomain: initOptions.authDomain || null,
      databaseURL: initOptions.databaseURL || null,
      messagingSenderId: initOptions.messagingSenderId || null,
      storageBucket: initOptions.storageBucket || null,
    };

    execCmd({
      args: [{
        id: this.id,
        name: this.name,
        options: this._options,
      }],
      context: this,
      methodName: "newInstance",
      pluginName: "CordovaFirebaseCore",
    }).then(() => {
      this._isInitialized = true;
      this._trigger("ready");
    });
  }

  /**
   * Generate FirebaseDatabse instance
   * @param [url] - Realtime database url
   * @returns database instance
   */
  public database(url?: string): any {
    if (isInitialized("plugin.firebase.database._DBs")) {
      const CordovaFirebaseDatabase: any = require("cordvoa-firebase-datbase.cordova-firebase-database");
      const options: any = Object.create(this._options);
      if (url) {
        options.databaseURL = url;
      }
      const db = new CordovaFirebaseDatabase(this.id, options);
      if (this._isInitialized) {
        db._trigger("fireAppReady");
      } else {
        this._on("ready", () => {
          db._trigger("fireAppReady");
        });
      }
    } else {
      throw new Error("cordova-firebase-databse plugin is required");
    }
  }
}
