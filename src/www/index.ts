// Exports modules for type script compiler
export * from "./App";
export * from "./BaseArrayClass";
export * from "./BaseClass";
export * from "./common";
export * from "./IAppInitializeOptions";
export * from "./PluginBase";
export * from "./lz-string";

// Registers modules as part of cordova plugin
declare let window: any;
if (window.cordova && window.cordova.version && !window.jest) {
  const _orgRequire = window.cordova.require;
  window.cordova.require = (id: string): void => {
    id = id.replace(/([a-z0-9])\/([a-z0-9])/i, "$1.$2");
    _orgRequire(id);
  };
  // const keys: Array<string> = Object.keys(exports);
  // keys.forEach((key: string) => {
  //   const anotherModule = {
  //     exports: {
  //       __esModule: true,
  //     },
  //   };
  //   anotherModule.exports[key] = exports[key];
  //   window.cordova.define.moduleMap["cordova-firebase-core/" + key] = anotherModule;
  // });

  const indexModue: any = { exports };
  window.cordova.define.moduleMap["cordova-firebase-core/index"] = indexModue;
}
