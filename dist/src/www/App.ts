// import { Promise } from "es6-promise";
import { exec } from "cordova";
import { isInitialized } from "./common";
import { IAppInitializeOptions } from "./IAppInitializeOptions";
import { PluginBase } from "./PluginBase";

declare let Promise: any;
declare let window: any;

export class App extends PluginBase {

  public name: string = "[DEFAULT]";

  private _options: IAppInitializeOptions = {
    apiKey: null,
    authDomain: null,
    databaseURL: null,
    messagingSenderId: null,
    storageBucket: null,
  };

  /**
   * @constructor
   * @param [name] - Application name. Default value is "[DEFAULT]"
   * @param [initOptions] - Application initialize option.
   *  This parameter is for {@link: plugin.firebase.initializeApp()} method.
   */
  constructor(name?: string, initOptions?: IAppInitializeOptions) {
    super("fireapp");

    if (typeof name === "string") {
      this.name = name;
    }

    if (initOptions) {
      this._options = {
        apiKey: initOptions.apiKey || null,
        authDomain: initOptions.authDomain || null,
        databaseURL: initOptions.databaseURL || null,
        messagingSenderId: initOptions.messagingSenderId || null,
        storageBucket: initOptions.storageBucket || null,
      };
    }

    // Create one new instance in native side.
    exec(() => {
      this._isReady = true;
      this._trigger("ready");
    },
    (error: any) => {
      throw new Error(error);
    },
    "CordovaFirebaseCore",
    "newInstance",
    [{
      id: this.id,
      name: this.name,
      options: this._options,
    }]);
  }

  /**
   * Generate FirebaseDatabse instance
   * @param [url] - Realtime database url
   * @returns database instance
   */
  public database(url?: string): any {
    const options: any = this.options;
    if (url) {
      options.databaseURL = url;
    }

    // Load `cordova-firebase-database.Database` module if not yet.
    let database: any;
    if (isInitialized("plugin.firebase.database") &&
      typeof window.plugin.firebase.database === "function") {
      database = window.plugin.firebase.database(this, options);
    } else {
      const moduleName: string = "cordova-firebase-database";

      if (!window.cordova.define.moduleMap[moduleName + ".Database"]) {
        // cordova-firebase-database is not installed.
        throw new Error(moduleName + " plugin is required");
      }
      cordova.require(moduleName + ".Database");
      database = window.plugin.firebase.database(this, options);
    }

    // Waits if native side of FirebaseAppPlugin is not ready yet.
    if (this._isReady) {
      database._trigger("fireAppReady");
    } else {
      this._one("ready", () => {
        database._trigger("fireAppReady");
      });
    }
    return database;
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
if (window.cordova && window.cordova.version) {
  const manager: SecretAppManager = new SecretAppManager();

  const firebaseNS: any = {
    apps: manager.apps,

    ANDROID_SDK_VERSION: "5.5.0",

    database: undefined,

    initializeApp: manager.initializeApp.bind(manager),

    IOS_SDK_VERSION: "5.5.0",

    Promise: Promise.class,

    WEBJS_SDK_VERSION: "5.5.0",
  };

  window.cordova.addConstructor(() => {
    window.plugin = window.plugin || {};
    // (window as any).plugin.firebase = (window as any).plugin.firebase || {};
    if (!window.plugin.firebase) {
      Object.defineProperty(window.plugin, "firebase", {
        value: firebaseNS,
      });
      Object.defineProperty(window.plugin.firebase, "app", {
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
