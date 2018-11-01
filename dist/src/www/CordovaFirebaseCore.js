"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var BaseClass_1 = require("./BaseClass");
var common_1 = require("./common");
var FirebaseAppPlugin_1 = require("./FirebaseAppPlugin");
/**
 * @hidden
 * This class is implementation of "CordovaFirebaseCore" for browser platform.
 * Not use for JS side.
 */
var CordovaFirebaseCore = /** @class */ (function (_super) {
    __extends(CordovaFirebaseCore, _super);
    function CordovaFirebaseCore() {
        return _super.call(this) || this;
    }
    CordovaFirebaseCore.prototype.newInstance = function (resolve, reject, args) {
        common_1.loadJsPromise({
            package: "firebase.app",
            url: "https://www.gstatic.com/firebasejs/5.5.0/firebase-app.js",
        })
            .then(function () {
            // args[0]
            // {
            //   id: this.id,
            //   name: this.name,
            //   options: this._options,
            // }
            var options = args[0] || {};
            var name = args[1] || "[DEFAULT]";
            // Create an application instance
            var app = window.firebase.initializeApp(options.options, name);
            console.log("--->[browser] CordovaFirebaseCore.newInstance() : " + options.id);
            // Create firebase app reference
            var instance = new FirebaseAppPlugin_1.FirebaseAppPlugin(options.id, app);
            var dummyObj = {};
            var keys = Object.getOwnPropertyNames(FirebaseAppPlugin_1.FirebaseAppPlugin.prototype).filter(function (p) {
                return typeof FirebaseAppPlugin_1.FirebaseAppPlugin.prototype[p] === "function";
            });
            keys.forEach(function (key) {
                dummyObj[key] = instance[key].bind(instance);
            });
            var proxy = require("cordova/exec/proxy");
            proxy.add(options.id, dummyObj);
            resolve();
        })
            .catch(reject);
    };
    return CordovaFirebaseCore;
}(BaseClass_1.BaseClass));
exports.CordovaFirebaseCore = CordovaFirebaseCore;
// Register this plugin
if (window.cordova) {
    (function () {
        var instance = new CordovaFirebaseCore();
        var dummyObj = {};
        var keys = Object.getOwnPropertyNames(CordovaFirebaseCore.prototype).filter(function (p) {
            return typeof CordovaFirebaseCore.prototype[p] === "function";
        });
        keys.forEach(function (key) {
            dummyObj[key] = instance[key].bind(instance);
        });
        var proxy = require("cordova/exec/proxy");
        proxy.add("CordovaFirebaseCore", dummyObj);
    })();
}
