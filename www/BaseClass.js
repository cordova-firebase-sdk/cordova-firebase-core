"use strict";
var BaseClass = /** @class */ (function () {
    function BaseClass() {
        this.vars = {};
        this.subs = {};
        Object.defineProperty(this, "hashCode", {
            value: Math.floor(Date.now() * Math.random()),
        });
    }
    BaseClass.prototype._empty = function () {
        var _this = this;
        Object.keys(this.vars).forEach(function (name) {
            _this.vars[name] = null;
            delete _this.vars[name];
        });
    };
    BaseClass.prototype._delete = function (key) {
        delete this.vars[key];
    };
    BaseClass.prototype._get = function (key) {
        return this.vars[key];
    };
    BaseClass.prototype._set = function (key, value, noNotify) {
        var prev = this.vars[key];
        this.vars[key] = value;
        if (!noNotify && prev !== value) {
            this._trigger(key + "_changed", prev, value, key);
        }
    };
    BaseClass.prototype._bindTo = function (key, target, targetKey, noNotify) {
        targetKey = targetKey || key;
        // If `noNotify` is true, prevent `(targetKey)_changed` event occurrs,
        // when bind the value for the first time only.
        // (Same behaviour as Google Maps JavaScript v3)
        target._set(targetKey, target._get(targetKey), noNotify);
        this._on(key + "_changed", function (oldValue, newValue) {
            target._set(targetKey, newValue);
        });
    };
    BaseClass.prototype._trigger = function (eventName) {
        var _this = this;
        var parameters = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            parameters[_i - 1] = arguments[_i];
        }
        if (!eventName || !this.subs[eventName]) {
            return;
        }
        var listeners = this.subs[eventName];
        listeners.forEach(function (subscriber) {
            if (subscriber) {
                subscriber.apply(_this, parameters);
            }
        });
    };
    BaseClass.prototype._on = function (eventName, listener) {
        if (!listener || typeof listener !== "function") {
            throw new Error("Listener must be a function");
        }
        this.subs[eventName] = this.subs[eventName] || [];
        this.subs[eventName].push(listener);
    };
    BaseClass.prototype._off = function (eventName, listener) {
        var _this = this;
        var removedListeners = [];
        if (!eventName && !listener) {
            var eventNames = Object.keys(this.subs);
            eventNames.forEach(function (name) {
                removedListeners = Array.prototype.concat.apply(removedListeners, _this.subs[name]);
                delete _this.subs[name];
            });
        }
        else if (eventName) {
            removedListeners = Array.prototype.concat.apply(removedListeners, this.subs[eventName]);
            delete this.subs[eventName];
        }
        else {
            var index = this.subs[eventName].indexOf(listener);
            if (index !== -1) {
                this.subs[eventName].splice(index, 1);
                removedListeners.push(listener);
            }
        }
        return removedListeners;
    };
    BaseClass.prototype._one = function (eventName, listener) {
        var _this = this;
        if (!listener || typeof listener !== "function") {
            throw new Error("Listener must be a function");
        }
        var callback = function () {
            var parameters = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                parameters[_i] = arguments[_i];
            }
            _this._off(eventName, callback);
            listener.apply(_this, parameters);
        };
        this._on(eventName, callback);
    };
    return BaseClass;
}());
module.exports = BaseClass;
