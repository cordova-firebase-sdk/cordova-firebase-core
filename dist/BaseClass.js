"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Base class implementing KVO.
 *
 * The MVCObject constructor is guaranteed to be an empty function,
 * and so you may inherit from MVCObject by simply writing
 * `MySubclass.prototype = new plugin.firebase.core.BaseClass();`.
 * Unless otherwise noted, this is not true of other classes in the API,
 * and inheriting from other classes in the API is not supported.
 *
 * @remarks
 * This class does not provided in original Firebase JS SDK,
 * however this is useful for creating this plugin.
 */
var BaseClass = /** @class */ (function () {
    function BaseClass() {
        /**
         * Unique hash string.
         */
        this.hashCode = Math.floor(Date.now() * Math.random()).toString();
        /**
         * @hidden
         * Keep values with keys.
         */
        this.vars = {};
        /**
         * @hidden
         * Keep listeners with event name.
         */
        this.subs = {};
        /**
         * @hidden
         * Keep bindTo information
         */
        this._bindToDic = {};
    }
    // /**
    //  * Create new BaseClass
    //  * @constructor
    //  */
    // constructor() {}
    /**
     * Removes all key-value stores
     */
    BaseClass.prototype._empty = function () {
        var _this = this;
        Object.keys(this.vars).forEach(function (name) {
            _this.vars[name] = null;
            delete _this.vars[name];
        });
    };
    /**
     * Deletes the value saved with key.
     *
     * @param key - target key
     */
    BaseClass.prototype._delete = function (key) {
        delete this.vars[key];
    };
    /**
     * Returns the value saved with key.
     *
     * @param key - target key
     */
    BaseClass.prototype._get = function (key) {
        return this.vars[key];
    };
    /**
     * Saves one value with key.
     *
     * @param key - key
     * @param value - value
     * @param [noNotify] - Sets `true` if you don't want to fire `(key)_changed` event.
     */
    BaseClass.prototype._set = function (key, value, noNotify) {
        var _this = this;
        var prev = this.vars[key];
        this.vars[key] = value;
        if (prev !== value) {
            if (this._bindToDic[key]) {
                var keys = Object.keys(this._bindToDic[key]);
                keys.forEach(function (hashCode) {
                    var info = _this._bindToDic[key][hashCode];
                    info.target._set(info.targetKey, value);
                });
            }
            if (!noNotify) {
                this._trigger(key + "_changed", prev, value, key);
            }
        }
    };
    /**
     * Binds one value to another BaseClass instance.
     * Automatically changes the value of target instance if this instance's property is changed.
     *
     * ```ts
     * instanceA.bindTo('hello', instanceB);  // instanceB.hello = instanceA.hello
     * ```
     *
     * @param key - key
     * @param target - target instance
     * @param [targetKey] - Sets the property name of `target`. If omit, `key` is used.
     * @param [noNotify] - Sets `true` if you don't want to fire `(key)_changed` event at the first time.
     */
    BaseClass.prototype._bindTo = function (key, target, targetKey, noNotify) {
        targetKey = targetKey || key;
        // If `noNotify` is true, prevent `(targetKey)_changed` event occurrs,
        // when bind the value for the first time only.
        // (Same behaviour as Google Maps JavaScript v3)
        target._set(targetKey, this.vars[key], noNotify);
        this._bindToDic[key] = this._bindToDic[key] || {};
        this._bindToDic[key][target.hashCode] = {
            target: target,
            targetKey: targetKey,
        };
    };
    /**
     * Fire an event named `eventName` with `parameters`.
     *
     * ```ts
     * instanceA._trigger('myEvent', 1, 2, 3);
     * ```
     *
     * @param eventName - event name
     * @param parameters - any data
     */
    BaseClass.prototype._trigger = function (eventName) {
        var _this = this;
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        if (!eventName || !this.subs[eventName]) {
            return;
        }
        var listeners = this.subs[eventName];
        listeners.forEach(function (info) {
            if (info && info.listener && !info.deleted) {
                if (info.once) {
                    info.deleted = true;
                }
                Promise.resolve().then(function () {
                    info.listener.apply(_this, params);
                });
            }
        });
        this.subs[eventName] = this.subs[eventName].filter(function (info) {
            return info && info.listener && !info.deleted;
        });
    };
    /**
     * Catch the events fired with {@link BaseClass._trigger | the _trigger() method}.
     *
     * ```ts
     * instanceA._on('myEvent', (one: number, two: number, three: number) => {
     *   console.log(one, two, three);
     * });
     *
     * instanceA._trigger('myEvent', 1, 2, 3);
     * ```
     *
     * @param eventName - event name
     * @param listener - event listener
     */
    BaseClass.prototype._on = function (eventName, listener) {
        if (!listener || typeof listener !== "function") {
            throw new Error("Listener must be a function");
        }
        this.subs[eventName] = this.subs[eventName] || [];
        this.subs[eventName].push({
            deleted: false,
            listener: listener,
            once: false,
        });
    };
    /**
     * Remove event listener
     *
     * If you specify `eventName` and `listener`,
     * remove only the event listener.
     * ```ts
     * const listener: () => {} = (one: number, two: number, three: number) => {
     *   console.log(one, two, three);
     * };
     *
     * instanceA._on('myEvent', listener);
     *
     * instanceA._off('myEvent', listener);
     * ```
     *
     * If you specify only `eventName` ,
     * remove all event listeners for the eventName.
     * ```ts
     * instanceA._on('myEvent', (one: number, two: number, three: number) => {
     *   console.log(one, two, three);
     * });
     * instanceA._on('myEvent', (...params: any[]) => {
     *   console.log(one, two, three);
     * });
     *
     * instanceA._off('myEvent');
     *
     * ```
     * If you don't specify anything ,
     * remove all event listeners that are registerd to this instance.
     * ```ts
     * instanceA._on('myEvent', (one: number, two: number, three: number) => {
     *   console.log(one, two, three);
     * });
     * instanceA._on('myEvent', (...params: any[]) => {
     *   console.log(one, two, three);
     * });
     *
     * instanceA._off();
     *
     * ```
     *
     * @param [eventName] - event name
     * @param [listener] - event listener
     * @returnss Removed event listeners.
     */
    BaseClass.prototype._off = function (eventName, listener) {
        var _this = this;
        var removedListeners = [];
        if (eventName && listener) {
            for (var i = 0; i < this.subs[eventName].length; i++) {
                if (this.subs[eventName][i].listener === listener) {
                    this.subs[eventName][i].deleted = true;
                    this.subs[eventName].splice(i, 1);
                    removedListeners.push(listener);
                    break;
                }
            }
        }
        else if (eventName) {
            this.subs[eventName].forEach(function (info) {
                info.delete = true;
                removedListeners.push(info.listener);
            });
            delete this.subs[eventName];
        }
        else {
            var eventNames = Object.keys(this.subs);
            eventNames.forEach(function (name) {
                _this.subs[name].forEach(function (info) {
                    info.delete = true;
                    removedListeners.push(info.listener);
                });
                delete _this.subs[name];
            });
        }
        return removedListeners;
    };
    /**
     * The same as {@link cordova-firebase-core#BaseClass._on}, but it works only one time.
     *
     * ```ts
     * instanceA._one('myEvent', (one: number, two: number, three: number) => {
     *   console.log(one, two, three);  // only output 1, 2, 3
     * });
     *
     * instanceA._trigger('myEvent', 1, 2, 3);
     * instanceA._trigger('myEvent', 4, 5, 6);
     * ```
     *
     * @param eventName - event name
     * @param listener - event listener
     */
    BaseClass.prototype._one = function (eventName, listener) {
        if (!listener || typeof listener !== "function") {
            throw new Error("Listener must be a function");
        }
        this.subs[eventName] = this.subs[eventName] || [];
        this.subs[eventName].push({
            deleted: false,
            listener: listener,
            once: true,
        });
    };
    return BaseClass;
}());
exports.BaseClass = BaseClass;
//# sourceMappingURL=BaseClass.js.map