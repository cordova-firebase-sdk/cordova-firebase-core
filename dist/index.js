"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Exports modules for type script compiler
var App_1 = require("./App");
exports.App = App_1.App;
var BaseArrayClass_1 = require("./BaseArrayClass");
exports.BaseArrayClass = BaseArrayClass_1.BaseArrayClass;
var BaseClass_1 = require("./BaseClass");
exports.BaseClass = BaseClass_1.BaseClass;
var common_1 = require("./common");
exports.isInitialized = common_1.isInitialized;
exports.nextTick = common_1.nextTick;
var PluginBase_1 = require("./PluginBase");
exports.PluginBase = PluginBase_1.PluginBase;
if (window.cordova.version) {
    cordova.define("cordova-firebase-core/App", function () {
        module.exports = exports.App;
    });
    cordova.define("cordova-firebase-core/BaseArrayClass", function () {
        module.exports = exports.BaseArrayClass;
    });
    cordova.define("cordova-firebase-core/BaseClass", function () {
        module.exports = exports.BaseClass;
    });
    cordova.define("cordova-firebase-core/common", function () {
        module.exports = {
            isInitialized: exports.isInitialized,
            nextTick: exports.nextTick,
        };
    });
    cordova.define("cordova-firebase-core/IAppInitializeOptions", function () {
        module.exports = exports.IAppInitializeOptions;
    });
    cordova.define("cordova-firebase-core/PluginBase", function () {
        module.exports = exports.PluginBase;
    });
}
