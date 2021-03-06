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
var cordova_1 = require("cordova");
var common_1 = require("./common");
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
        if (typeof name === "string") {
            _this.name = name;
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
            _this._options = {
                apiKey: initOptions.apiKey || null,
                authDomain: initOptions.authDomain || null,
                databaseURL: initOptions.databaseURL || null,
                messagingSenderId: initOptions.messagingSenderId || null,
                storageBucket: initOptions.storageBucket || null,
            };
        }
        // Create one new instance in native side.
        cordova_1.exec(function () {
            _this._isReady = true;
            _this._trigger("ready");
        }, function (error) {
            throw new Error(error);
        }, "CordovaFirebaseCore", "newInstance", [{
                id: _this.id,
                name: _this.name,
                options: _this._options,
            }]);
        return _this;
    }
    /**
     * Generate FirebaseDatabse instance
     * @param [url] - Realtime database url
     * @returns database instance
     */
    App.prototype.database = function (url) {
        var options = this.options;
        if (url) {
            options.databaseURL = url;
        }
        // Load `cordova-firebase-database.Database` module if not yet.
        var database;
        if (common_1.isInitialized("plugin.firebase.database") &&
            typeof window.plugin.firebase.database === "function") {
            database = window.plugin.firebase.database(this, options);
        }
        else {
            var moduleName = "cordova-firebase-database";
            if (!window.cordova.define.moduleMap[moduleName + ".Database"]) {
                // cordova-firebase-database is not installed.
                throw new Error(moduleName + " plugin is required");
            }
            cordova.require(moduleName + ".Database");
            database = window.plugin.firebase.database(this, options);
        }
        // Waits if native side of FirebaseAppPlugin is not ready yet.
        if (this._isReady) {
            database._trigger("fireAppReady");
        }
        else {
            this._one("ready", function () {
                database._trigger("fireAppReady");
            });
        }
        return database;
    };
    Object.defineProperty(App.prototype, "options", {
        get: function () {
            return JSON.parse(JSON.stringify(this._options));
        },
        enumerable: true,
        configurable: true
    });
    return App;
}(PluginBase_1.PluginBase));
exports.App = App;
var SecretAppManager = /** @class */ (function () {
    function SecretAppManager() {
        this._buffer = {};
    }
    Object.defineProperty(SecretAppManager.prototype, "apps", {
        get: function () {
            var _this = this;
            var keys = Object.keys(this._buffer);
            var results = [];
            keys.forEach(function (key) {
                results.push(_this._buffer[key]);
            });
            return results;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param initOptions - Application initialize options
     * @param [name] - Application name.
     * @returns Application instance
     */
    SecretAppManager.prototype.initializeApp = function (initOptions, name) {
        name = name || "[DEFAULT]";
        if (name in this._buffer) {
            throw new Error("Name '" + name + "' application has been already existed.");
        }
        if (typeof name !== "string") {
            throw new Error("Name must be string.");
        }
        var app = new App(name, initOptions);
        this._buffer[name] = app;
        return app;
    };
    return SecretAppManager;
}());
if (window.cordova && window.cordova.version) {
    var manager_1 = new SecretAppManager();
    Object.defineProperty(manager_1, "Promise", {
        value: Promise,
    });
    Object.defineProperty(manager_1, "SDK_VERSION", {
        value: "5.5.0",
    });
    window.plugin = window.plugin || {};
    // (window as any).plugin.firebase = (window as any).plugin.firebase || {};
    if (!window.plugin.firebase) {
        Object.defineProperty(window.plugin, "firebase", {
            value: manager_1,
        });
        Object.defineProperty(window.plugin.firebase, "app", {
            value: function (name) {
                name = name || "[DEFAULT]";
                var results = manager_1.apps.filter(function (app) {
                    return app.name === name;
                });
                if (results.length === 1) {
                    return results[0];
                }
                else if (name === "[DEFAULT]") {
                    throw new Error("Default app has been not initialized.");
                }
                else {
                    throw new Error("App '" + name + "' has been not initialized.");
                }
            },
        });
    }
}
//# sourceMappingURL=App.js.map