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
/**
 * @hidden
 * This class is implementation of "FirebaseAppPlugin" for browser platform.
 * Not use for JS side.
 */
var FirebaseAppPlugin = /** @class */ (function (_super) {
    __extends(FirebaseAppPlugin, _super);
    function FirebaseAppPlugin(id, app) {
        var _this = _super.call(this) || this;
        _this._app = app;
        _this._id = id;
        return _this;
    }
    Object.defineProperty(FirebaseAppPlugin.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FirebaseAppPlugin.prototype, "app", {
        get: function () {
            return this._app;
        },
        enumerable: true,
        configurable: true
    });
    FirebaseAppPlugin.prototype.delete = function (onSuccess, onError) {
        this._app.delete()
            .then(onSuccess)
            .catch(onError);
    };
    return FirebaseAppPlugin;
}(BaseClass_1.BaseClass));
exports.FirebaseAppPlugin = FirebaseAppPlugin;
//# sourceMappingURL=FirebaseAppPlugin.js.map