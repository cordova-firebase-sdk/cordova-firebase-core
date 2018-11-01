import { BaseClass } from "./BaseClass";
import { loadJsPromise } from "./common";
import { FirebaseAppPlugin } from "./FirebaseAppPlugin";

/**
 * @hidden
 * This class is implementation of "CordovaFirebaseCore" for browser platform.
 * Not use for JS side.
 */
export class CordovaFirebaseCore extends BaseClass {

  constructor() {
    super();
  }

  public newInstance(resolve, reject, args: Array<any>): void {

    loadJsPromise({
      package: "firebase.app",
      url: "https://www.gstatic.com/firebasejs/5.5.0/firebase-app.js",
    })
    .then(() => {
      // args[0]
      // {
      //   id: this.id,
      //   name: this.name,
      //   options: this._options,
      // }
      const options: any = args[0] || {};
      const name: string = args[1] || "[DEFAULT]";

      // Create an application instance
      const app: any = (window as any).firebase.initializeApp(options.options, name);
      console.log("--->[browser] CordovaFirebaseCore.newInstance() : " + options.id);

      // Create firebase app reference
      const instance: FirebaseAppPlugin = new FirebaseAppPlugin(options.id, app);
      const dummyObj: any = {};
      const keys: Array<string> = Object.getOwnPropertyNames(FirebaseAppPlugin.prototype).filter((p: string) => {
        return typeof FirebaseAppPlugin.prototype[p] === "function";
      });
      keys.forEach((key: string) => {
        dummyObj[key] = instance[key].bind(instance);
      });
      const proxy: any = require("cordova/exec/proxy");
      proxy.add(options.id, dummyObj);

      resolve();
    })
    .catch(reject);

  }

}


// Register this plugin
if ((window as any).cordova) {
  (() => {
    const instance: any = new CordovaFirebaseCore();
    const dummyObj = {};
    const keys: Array<string> = Object.getOwnPropertyNames(CordovaFirebaseCore.prototype).filter((p: string) => {
      return typeof CordovaFirebaseCore.prototype[p] === "function";
    });
    keys.forEach((key: string) => {
      dummyObj[key] = instance[key].bind(instance);
    });

    const proxy: any = require("cordova/exec/proxy");
    proxy.add("CordovaFirebaseCore", dummyObj);
  })();
}
