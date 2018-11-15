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
var PluginBase_1 = require("../PluginBase");
var Database = /** @class */ (function (_super) {
    __extends(Database, _super);
    function Database(app, options) {
        var _this = _super.call(this, "Database") || this;
        _this.app = app;
        _this._options = options;
        _this._one("fireAppReady", function () {
            _this._isReady = true;
        });
        return _this;
    }
    return Database;
}(PluginBase_1.PluginBase));
exports.Database = Database;
//# sourceMappingURL=Database.js.map