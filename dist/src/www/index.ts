// Exports modules for type script compiler
export { App } from "./App";
export { BaseArrayClass } from "./BaseArrayClass";
export { BaseClass } from "./BaseClass";
export { isInitialized, nextTick } from "./common";
export { IAppInitializeOptions } from "./IAppInitializeOptions";
export { PluginBase } from "./PluginBase";

// Registers modules as part of cordova plugin
declare let window: any;
if (window.cordova.version) {

  cordova.define("cordova-firebase-core/App", () => {
    module.exports = exports.App;
  });
  cordova.define("cordova-firebase-core/BaseArrayClass", () => {
    module.exports = exports.BaseArrayClass;
  });
  cordova.define("cordova-firebase-core/BaseClass", () => {
    module.exports = exports.BaseClass;
  });
  cordova.define("cordova-firebase-core/common", () => {
    module.exports = {
      isInitialized: exports.isInitialized,
      nextTick: exports.nextTick,
    };
  });
  cordova.define("cordova-firebase-core/IAppInitializeOptions", () => {
    module.exports = exports.IAppInitializeOptions;
  });
  cordova.define("cordova-firebase-core/PluginBase", () => {
    module.exports = exports.PluginBase;
  });
}
