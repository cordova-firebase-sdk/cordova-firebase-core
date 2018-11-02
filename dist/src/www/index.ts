// Exports modules for type script compiler
export * from "./App";
export * from "./BaseArrayClass";
export * from "./BaseClass";
export * from "./common";
export * from "./IAppInitializeOptions";
export * from "./PluginBase";

// Registers modules as part of cordova plugin
declare let window: any;
if (window.cordova.version) {
  const keys: Array<string> = Object.keys(exports);
  keys.forEach((key: string) => {
    const anotherModule = {
      exports: {
        __esModule: true,
      },
    };
    anotherModule.exports[key] = exports[key];
    window.cordova.define.moduleMap["cordova-firebase-core/" + key] = anotherModule;
  });

  const indexModue: any = { exports };
  window.cordova.define.moduleMap["cordova-firebase-core/index"] = indexModue;
}
