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
    if (isInitialized("plugin.firebase.database")) {
      const options: any = this.options;
      if (url) {
        options.databaseURL = url;
      }
      return (window as any).plugin.firebase.database(this, options);
    } else {
      throw new Error("cordova-firebase-databse plugin is required");
    }
  }

  public get options(): IAppInitializeOptions {
    return JSON.parse(JSON.stringify(this._options));
  }
}


class SecretAppManager {

  public get apps(): Array<App> {
    const keys: Array<string> = Object.keys(this._apps);
    const apps: Array<App> = [];
    keys.forEach((key: string) => {
      apps.push(this._apps[key]);
    });
    return apps;
  }

  public _apps: any = {};

  /**
   * @param initOptions - Application initialize options
   * @param [name] - Application name.
   * @returns Application instance
   */
  public initializeApp(initOptions: IAppInitializeOptions, name?: string): App {
    name = name || "[DEFAULT]";
    if (name in this._apps) {
      throw new Error("Name '" + name + "' application has been already existed.");
    }
    const app: App = new App(name, initOptions);
    this._apps[name] = app;
    return app;
  }
}
if ((cordova as any) && (cordova as any).version) {
  const manager: SecretAppManager = new SecretAppManager();

  const firebaseNS: any = {
    apps: manager.apps,

    ANDROID_SDK_VERSION: "5.5.0",

    database: undefined,

    initializeApp: manager.initializeApp,

    IOS_SDK_VERSION: "5.5.0",

    Promise: Promise.class,

    WEBJS_SDK_VERSION: "5.5.0",
  };

  (cordova as any).addConstructor(() => {
    (window as any).plugin = (window as any).plugin || {};
    // (window as any).plugin.firebase = (window as any).plugin.firebase || {};
    if (!(window as any).plugin.firebase) {
      Object.defineProperty((window as any).plugin, "firebase", {
        value: firebaseNS,
      });
      Object.defineProperty((window as any).plugin.firebase, "app", {
        value: (name?: string): App => {
          name = name || "[DEFAULT]";
          const app: App = manager._apps[name];
          if (app) {
            return app;
          } else {
            throw new Error("Default app has been not initialized.");
          }
        },
      });
    }
  });
}
