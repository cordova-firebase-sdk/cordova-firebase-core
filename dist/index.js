"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
// Exports modules for type script compiler
__export(require("./App"));
__export(require("./BaseArrayClass"));
__export(require("./BaseClass"));
__export(require("./common"));
__export(require("./PluginBase"));
__export(require("./lz-string"));
if (window.cordova.version) {
    var keys = Object.keys(exports);
    keys.forEach(function (key) {
        var anotherModule = {
            exports: {
                __esModule: true,
            },
        };
        anotherModule.exports[key] = exports[key];
        window.cordova.define.moduleMap["cordova-firebase-core/" + key] = anotherModule;
    });
    var indexModue = { exports: exports };
    window.cordova.define.moduleMap["cordova-firebase-core/index"] = indexModue;
}
