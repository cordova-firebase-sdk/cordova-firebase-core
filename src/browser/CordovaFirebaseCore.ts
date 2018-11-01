import { BaseClass } from "../www/BaseClass";
import { loadJsPromise } from "../www/common";
import { FirebaseAppPlugin } from "./FirebaseAppPlugin";

export class CordovaFirebaseCore extends BaseClass {

  constructor() {
    super();
  }

  public newInstance(resolve, reject, args: any[]) {

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
      const keys: string[] = Object.getOwnPropertyNames(FirebaseAppPlugin.prototype).filter((p: string) => {
        return typeof FirebaseAppPlugin.prototype[p] === "function";
      });
      keys.forEach((key: string) => {
        dummyObj[key] = instance[key].bind(instance);
      });
      require("cordova/exec/proxy").add(options.id, dummyObj);

      resolve();
    })
    .catch(reject);

  }

}


// Register this plugin
(() => {
  const instance: any = new CordovaFirebaseCore();
  const dummyObj = {};
  const keys: string[] = Object.getOwnPropertyNames(CordovaFirebaseCore.prototype).filter((p: string) => {
    return typeof CordovaFirebaseCore.prototype[p] === "function";
  });
  keys.forEach((key: string) => {
    dummyObj[key] = instance[key].bind(instance);
  });

  require("cordova/exec/proxy").add("CordovaFirebaseCore", dummyObj);
})();
