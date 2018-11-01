// import { Promise } from "es6-promise";
import { isInitialized } from "./common";
import { execCmd } from "./FirebaseCoreCommandQueue";
import { IAppInitializeOptions } from "./IAppInitializeOptions";
import { PluginBase } from "./PluginBase";

declare let Promise: any;

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

    // Create one new instance in native side.
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


class SecretClass {

  public readonly SDK_VERSION = "0.0.2";

  public readonly WEBJS_SDK_VERSION = "5.5.0";

  public readonly ANDROID_SDK_VERSION = "5.5.0";

  public readonly IOS_SDK_VERSION = "5.5.0";

  public get apps(): Array<App> {
    return this._apps;
  }

  private _apps: Array<App> = [];

  /**
   * @param initOptions - Application initialize options
   * @param [name] - Application name.
   * @returns Application instance
   */
  public initializeApp(initOptions: IAppInitializeOptions, name?: string): App {
    name = name || "[DEFAULT]";
    const app: App = new App(name, initOptions);
    this._apps.push(app);
    return app;
  }
}
if ((cordova as any) && (cordova as any).version) {
  (cordova as any).addConstructor(() => {
    (window as any).plugin = (window as any).plugin || {};
    // (window as any).plugin.firebase = (window as any).plugin.firebase || {};
    if (!(window as any).plugin.firebase) {
      Object.defineProperty((window as any).plugin, "firebase", {
        value: new SecretClass(),
      });
    }
  });
}
