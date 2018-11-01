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
// import { Promise } from "es6-promise";
var common_1 = require("./common");
var FirebaseCoreCommandQueue_1 = require("./FirebaseCoreCommandQueue");
var PluginBase_1 = require("./PluginBase");
var App = /** @class */ (function (_super) {
    __extends(App, _super);
    /**
     * @constructor
     * @param [name] - Application name. Default value is "[DEFAULT]"
     * @param [initOptions] - Application initialize option.
     *  This parameter is for {@link: plugin.firebase.initializeApp()} method.
     */
    function App(name, initOptions) {
        var _this = _super.call(this, "fireapp") || this;
        _this.name = "[DEFAULT]";
        _this._options = {
            apiKey: null,
            authDomain: null,
            databaseURL: null,
            messagingSenderId: null,
            storageBucket: null,
        };
        _this._isReady = true;
        _this._options = {
            apiKey: initOptions.apiKey || null,
            authDomain: initOptions.authDomain || null,
            databaseURL: initOptions.databaseURL || null,
            messagingSenderId: initOptions.messagingSenderId || null,
            storageBucket: initOptions.storageBucket || null,
        };
        // Create one new instance in native side.
        FirebaseCoreCommandQueue_1.execCmd({
            args: [{
                    id: _this.id,
                    name: _this.name,
                    options: _this._options,
                }],
            context: _this,
            methodName: "newInstance",
            pluginName: "CordovaFirebaseCore",
        }).then(function () {
            _this._isInitialized = true;
            _this._trigger("ready");
        });
        return _this;
    }
    /**
     * Generate FirebaseDatabse instance
     * @param [url] - Realtime database url
     * @returns database instance
     */
    App.prototype.database = function (url) {
        if (common_1.isInitialized("plugin.firebase.database._DBs")) {
            var CordovaFirebaseDatabase = require("cordvoa-firebase-datbase.cordova-firebase-database");
            var options = Object.create(this._options);
            if (url) {
                options.databaseURL = url;
            }
            var db_1 = new CordovaFirebaseDatabase(this.id, options);
            if (this._isInitialized) {
                db_1._trigger("fireAppReady");
            }
            else {
                this._on("ready", function () {
                    db_1._trigger("fireAppReady");
                });
            }
        }
        else {
            throw new Error("cordova-firebase-databse plugin is required");
        }
    };
    return App;
}(PluginBase_1.PluginBase));
exports.App = App;
var SecretClass = /** @class */ (function () {
    function SecretClass() {
        this.SDK_VERSION = "0.0.2";
        this.WEBJS_SDK_VERSION = "5.5.0";
        this.ANDROID_SDK_VERSION = "5.5.0";
        this.IOS_SDK_VERSION = "5.5.0";
        this._apps = [];
    }
    Object.defineProperty(SecretClass.prototype, "apps", {
        get: function () {
            return this._apps;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param initOptions - Application initialize options
     * @param [name] - Application name.
     * @returns Application instance
     */
    SecretClass.prototype.initializeApp = function (initOptions, name) {
        name = name || "[DEFAULT]";
        var app = new App(name, initOptions);
        this._apps.push(app);
        return app;
    };
    return SecretClass;
}());
cordova.addConstructor(function () {
    window.plugin = window.plugin || {};
    // (window as any).plugin.firebase = (window as any).plugin.firebase || {};
    if (!window.plugin.firebase) {
        Object.defineProperty(window.plugin, "firebase", {
            value: new SecretClass(),
        });
    }
});
