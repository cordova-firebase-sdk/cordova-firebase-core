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
 * PluginBase class base class of this plugin.
 */
var PluginBase = /** @class */ (function (_super) {
    __extends(PluginBase, _super);
    /**
     * @constructor
     * @param idSuffix - Plugin's ID suffix
     */
    function PluginBase(idSuffix) {
        var _this = _super.call(this) || this;
        _this._id = _this.hashCode + "_" + idSuffix;
        return _this;
    }
    Object.defineProperty(PluginBase.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PluginBase.prototype, "isReady", {
        get: function () {
            return this._isReady;
        },
        enumerable: true,
        configurable: true
    });
    return PluginBase;
}(BaseClass_1.BaseClass));
exports.PluginBase = PluginBase;
//# sourceMappingURL=PluginBase.js.map