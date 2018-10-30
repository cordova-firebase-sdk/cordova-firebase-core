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
var es6_promise_1 = require("es6-promise");
var BaseClass_1 = require("./BaseClass");
/**
 * MVC Array class.
 *
 * @remarks
 * This class extends {@link BaseClass}
 */
var BaseArrayClass = /** @class */ (function (_super) {
    __extends(BaseArrayClass, _super);
    /**
     * Create new BaseArrayClass
     * @constructor
     */
    function BaseArrayClass(initialArray) {
        var _this = _super.call(this) || this;
        /**
         * @hidden
         * Keep array values
         */
        _this.array = [];
        if (Array.isArray(initialArray) && initialArray.length > 0) {
            initialArray.forEach(function (item) {
                _this.array.push(item);
            });
        }
        return _this;
    }
    /**
     * The same as `Array.map` but runs a single async operation at a time.
     *
     * @param iteratee - An async function to apply to each item in array.
     * @returns a promise with transformed values
     */
    BaseArrayClass.prototype._mapSeries = function (iteratee) {
        var _this = this;
        if (this.array.length === 0) {
            return es6_promise_1.Promise.resolve([]);
        }
        var results = [];
        var goal = this.array.length;
        var looper = function (idx, resolve) {
            iteratee(_this.array[idx], idx, function (result) {
                results.push(result);
                if (results.length === goal) {
                    resolve(results);
                }
                else {
                    looper(idx + 1, resolve);
                }
            });
        };
        return new es6_promise_1.Promise(function (resolve) {
            looper(0, resolve);
        });
    };
    /**
     * The same as `Array.map` but runs async all `iteratee` function at the same time.
     *
     * @param iteratee - An async function to apply to each item in array.
     * @returns a promise with transformed values
     */
    BaseArrayClass.prototype._mapAsync = function (iteratee) {
        var _this = this;
        if (this.array.length === 0) {
            return es6_promise_1.Promise.resolve([]);
        }
        var results = [];
        var currentCnt = 0;
        var goal = this.array.length;
        var looper = function (item, idx, resolve) {
            iteratee(_this.array[idx], idx, function (result) {
                results[idx] = result;
                currentCnt++;
                if (currentCnt === goal) {
                    resolve(results);
                }
            });
        };
        return new es6_promise_1.Promise(function (resolve) {
            _this.array.forEach(function (item, idx) {
                looper(item, idx, resolve);
            });
        });
    };
    /**
     * The same as `Array.map`
     *
     * @param iteratee - An async function to apply to each item in array.
     * @returns transformed values
     */
    BaseArrayClass.prototype._map = function (iteratee) {
        return this.array.map(iteratee);
    };
    /**
     * The same as `Array.forEach` but runs async all `iteratee` functions.
     *
     * @param iteratee - An async function to apply to each item in array.
     * @returns a promise
     */
    BaseArrayClass.prototype._forEachAsync = function (iteratee) {
        var _this = this;
        if (this.array.length === 0) {
            return es6_promise_1.Promise.resolve();
        }
        var goal = this.array.length;
        var currentCnt = 0;
        var looper = function (item, idx, resolve) {
            iteratee(_this.array[idx], idx, function () {
                currentCnt++;
                if (goal === currentCnt) {
                    resolve();
                }
            });
        };
        return new es6_promise_1.Promise(function (resolve) {
            _this.array.forEach(function (item, idx) {
                looper(item, idx, resolve);
            });
        });
    };
    /**
     * The same as `Array.forEach`
     *
     * @param iteratee - An async function to apply to each item in array.
     */
    BaseArrayClass.prototype._forEach = function (iteratee) {
        if (this.array.length > 0) {
            this.array.forEach(iteratee);
        }
    };
    /**
     * The same as `Array.filter` but runs async all `iteratee` functions at the same time.
     *
     * @param iteratee - An async function to apply to each item in array.
     * @returns a promise with filtered values
     */
    BaseArrayClass.prototype._filterAsync = function (iteratee) {
        var _this = this;
        if (this.array.length === 0) {
            return es6_promise_1.Promise.resolve([]);
        }
        var results = [];
        var currentCnt = 0;
        var goal = this.array.length;
        var looper = function (item, idx, resolve) {
            iteratee(_this.array[idx], idx, function (result) {
                results[idx] = result;
                currentCnt++;
                if (currentCnt === goal) {
                    resolve(_this.array.filter(function (value, j) {
                        return results[j];
                    }));
                }
            });
        };
        return new es6_promise_1.Promise(function (resolve) {
            _this.array.forEach(function (item, idx) {
                looper(item, idx, resolve);
            });
        });
    };
    /**
     * The same as `Array.filter`
     *
     * @param iteratee - An async function to apply to each item in array.
     * @returns filtered values
     */
    BaseArrayClass.prototype._filter = function (iteratee) {
        if (this.array.length === 0) {
            return [];
        }
        var results = this.array.filter(iteratee);
        return results;
    };
    /**
     * Returns the first index at which a given element can be found in the array, or -1 if it is not present.
     *
     * @param searchElement - Element to locate in the array.
     * @param [searchElement] - The index to start the search at.
     * If the index is greater than or equal to the array's length, -1 is returned,
     * which means the array will not be searched.
     * If the provided index value is a negative number,
     * it is taken as the offset from the end of the array.
     * Note: if the provided index is negative, the array is still searched from front to back.
     * If the provided index is 0, then the whole array will be searched. Default: 0 (entire array is searched).
     * @return The first index of the element in the array; -1 if not found.
     */
    BaseArrayClass.prototype._indexOf = function (item, searchElement) {
        searchElement = searchElement === undefined || searchElement === null ? 0 : searchElement;
        if (typeof searchElement !== "number") {
            throw new Error("searchElement must be a number");
        }
        if (searchElement < 0) {
            throw new Error("searchElement must be over number than 0");
        }
        return this.array.indexOf(item, searchElement);
    };
    /**
     * Removes all elements. Fire `remove_at` event for each element.
     *
     * @param [noNotify] - Sets `true` if you don't want to fire `remove_at` event.
     */
    BaseArrayClass.prototype._empty = function (noNotify) {
        var cnt = this.array.length;
        for (var i = cnt - 1; i >= 0; i--) {
            this._removeAt(i, noNotify);
        }
    };
    /**
     * Adds one element to the end of an array and returns the new length of the array.
     * Fire `insert_at` event if `noNotify` is `false`.
     *
     * @param value - The element to add to the end of the array.
     * @param [noNotify] - Sets `true` if you don't want to fire `insert_at` event.
     * @returns The new length property of the object upon which the method was called.
     */
    BaseArrayClass.prototype._push = function (value, noNotify) {
        this.array.push(value);
        if (!noNotify) {
            this._trigger("insert_at", this.array.length - 1);
        }
        return this.array.length;
    };
    /**
     * Adds one element to the end of an array and returns the new length of the array.
     * Fire `insert_at` event if `noNotify` is `false`.
     *
     * @param index - The position of the array you want to insert new element.
     * @param value - The element to add to the end of the array.
     * @param [noNotify] - Sets `true` if you don't want to fire `insert_at` event.
     * @returns The new length property of the object upon which the method was called.
     */
    BaseArrayClass.prototype._insertAt = function (index, value, noNotify) {
        if (index < 0) {
            throw new Error("index must be over number than 0");
        }
        this.array.splice(index, 0, value);
        if (noNotify !== true) {
            this._trigger("insert_at", index);
        }
        return this.array.length;
    };
    /**
     * Returns a new array that is the clone of internal array.
     *
     * @returns New array
     */
    BaseArrayClass.prototype._getArray = function () {
        return JSON.parse(JSON.stringify(this.array));
    };
    /**
     * Returns item of specified position.
     *
     * @name getAt
     * @param index - The position of the array you want to get.
     * @returns item
     */
    BaseArrayClass.prototype._getAt = function (index) {
        if (index < 0) {
            throw new Error("index must be over number than 0");
        }
        if (index >= this.array.length) {
            throw new Error("index must be lower number than " + this.array.length);
        }
        return this.array[index];
    };
    /**
     * Replaces item of specified position.
     *
     * @param index - The position of the array you want to get.
     * @param value - New element
     * @param [noNotify] - Sets `true` if you don't want to fire `set_at` event.
     * @returns previous item
     */
    BaseArrayClass.prototype._setAt = function (index, value, noNotify) {
        if (index < 0) {
            throw new Error("index must be over number than 0");
        }
        if (index > this.array.length) {
            for (var i = this.array.length; i <= index; i++) {
                this.array[i] = undefined;
            }
        }
        var prev = this.array[index];
        this.array[index] = value;
        if (noNotify !== true) {
            this._trigger("set_at", index, prev);
        }
        return prev;
    };
    /**
     * Removes item of specified position.
     *
     * @param index - The position of the array you want to get.
     * @param [noNotify] - Sets `true` if you don't want to fire `remove_at` event.
     * @returns removed item
     */
    BaseArrayClass.prototype._removeAt = function (index, noNotify) {
        if (index < 0) {
            throw new Error("index must be over number than 0");
        }
        if (index >= this.array.length) {
            throw new Error("index must be lower number than " + this.array.length);
        }
        var prev = this.array[index];
        this.array.splice(index, 1);
        if (noNotify !== true) {
            this._trigger("remove_at", index, prev);
        }
        return prev;
    };
    /**
     * Removes item of the last array item.
     *
     * @param [noNotify] - Sets `true` if you don't want to fire `remove_at` event.
     * @returns  removed item
     */
    BaseArrayClass.prototype._pop = function (noNotify) {
        var index = this.array.length - 1;
        var prev = this.array.pop();
        this.array.splice(index, 1);
        if (noNotify !== true) {
            this._trigger("remove_at", index, prev);
        }
        return prev;
    };
    /**
     * Returns the length of array.
     *
     * @returns Number of items
     */
    BaseArrayClass.prototype._getLength = function () {
        return this.array.length;
    };
    /**
     * Reverses an array in place.
     * The first array element becomes the last, and the last array element becomes the first.
     *
     */
    BaseArrayClass.prototype._reverse = function () {
        this.array.reverse();
    };
    /**
     * The `sort()` method sorts the elements of an array in place and returns the array.
     * The same as `array.sort()`.
     *
     * @param [compareFunction] - Specifies a function that defines the sort order.
     *  If omitted, the array is sorted according to each character's Unicode code point value,
     *  according to the string conversion of each element.
     */
    BaseArrayClass.prototype._sort = function (compareFunction) {
        if (typeof compareFunction === "function") {
            this.array.sort(compareFunction);
        }
        else {
            this.array.sort();
        }
    };
    return BaseArrayClass;
}(BaseClass_1.BaseClass));
exports.BaseArrayClass = BaseArrayClass;
