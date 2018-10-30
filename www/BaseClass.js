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
 */
var BaseClass = /** @class */ (function () {
    /**
     * Create new BaseClass
     * @constructor
     */
    function BaseClass() {
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
        Object.defineProperty(this, "hashCode", {
            value: Math.floor(Date.now() * Math.random()),
        });
    }
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
        var prev = this.vars[key];
        this.vars[key] = value;
        if (!noNotify && prev !== value) {
            this._trigger(key + "_changed", prev, value, key);
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
        this._on(key + "_changed", function (oldValue, newValue) {
            target._set(targetKey, newValue);
        });
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
        this.subs[eventName].push(listener);
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
     * @returns Removed event listeners.
     */
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
exports.BaseClass = BaseClass;
