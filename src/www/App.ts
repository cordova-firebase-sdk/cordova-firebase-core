import { exec } from "cordova";
import { isInitialized } from "./common";
import { IAppInitializeOptions } from "./IAppInitializeOptions";
import { PluginBase } from "./PluginBase";

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
      if (initOptions.databaseURL) {
        initOptions.databaseURL = initOptions.databaseURL.toLowerCase();
        initOptions.databaseURL = initOptions.databaseURL.replace(/\?.+$/, "");
        if (!/^https:\/\/.+?\.firebaseio.com/.test(initOptions.databaseURL)) {
          throw new Error("Cannot parse Firebase url. Please use https://<YOUR FIREBASE>.firebaseio.com");
        }
        if (/firebaseio.com\/.+$/.test(initOptions.databaseURL)) {
          throw new Error("Database URL must point to the root of a Firebase Database (not including a child path). ");
        }
      }
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
      typeof (window as any).plugin.firebase.database === "function") {
      database = (window as any).plugin.firebase.database(this, options);
    } else {
      const moduleName: string = "cordova-firebase-database";

      if (!(window as any).cordova.define.moduleMap[moduleName + ".Database"]) {
        // cordova-firebase-database is not installed.
        throw new Error(moduleName + " plugin is required");
      }
      cordova.require(moduleName + ".Database");
      database = (window as any).plugin.firebase.database(this, options);
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

  private _buffer: any;

  constructor() {
    this._buffer = {};
  }

  public get apps(): Array<App> {
    const keys: Array<string> = Object.keys(this._buffer);
    const results: Array<App> = [];
    keys.forEach((key: string) => {
      results.push(this._buffer[key]);
    });
    return results;
  }

  /**
   * @param initOptions - Application initialize options
   * @param [name] - Application name.
   * @returns Application instance
   */
  public initializeApp(initOptions: IAppInitializeOptions, name?: string): App {
    name = name || "[DEFAULT]";
    if (name in this._buffer) {
      throw new Error("Name '" + name + "' application has been already existed.");
    }
    if (typeof name !== "string") {
      throw new Error("Name must be string.");
    }
    const app: App = new App(name, initOptions);
    this._buffer[name] = app;
    return app;
  }
}
if ((window as any).cordova && (window as any).cordova.version) {
  const manager: SecretAppManager = new SecretAppManager();

  Object.defineProperty(manager, "Promise", {
    value: Promise,
  });
  Object.defineProperty(manager, "SDK_VERSION", {
    value: "5.5.0", // Web JS SDK Version
  });

  (window as any).plugin = (window as any).plugin || {};
  // (window as any).plugin.firebase = (window as any).plugin.firebase || {};
  if (!(window as any).plugin.firebase) {
    Object.defineProperty((window as any).plugin, "firebase", {
      value: manager,
    });
    Object.defineProperty((window as any).plugin.firebase, "app", {
      value: (name?: string): App => {
        name = name || "[DEFAULT]";
        const results: Array<App> = manager.apps.filter((app: App): boolean => {
          return app.name === name;
        });
        if (results.length === 1) {
          return results[0];
        } else if (name === "[DEFAULT]") {
          throw new Error("Default app has been not initialized.");
        } else {
          throw new Error("App '" + name + "' has been not initialized.");
        }
      },
    });
  }
}
