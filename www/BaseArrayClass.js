"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseClass_1 = require("./BaseClass");
/**
 * MVC Array class.
 *
 * @remarks
 * This class extends {@link BaseClass}
 */
class BaseArrayClass extends BaseClass_1.BaseClass {
    /**
     * Create new BaseArrayClass
     * @constructor
     */
    constructor(initialArray) {
        super();
        /**
         * @hidden
         * Keep array values
         */
        this.array = [];
        if (Array.isArray(initialArray) && initialArray.length > 0) {
            initialArray.forEach((item) => {
                this.array.push(item);
            });
        }
    }
    /**
     * The same as `Array.map` but runs a single async operation at a time.
     *
     * @param iteratee - An async function to apply to each item in array.
     * @returns a promise with transformed values
     */
    _mapSeries(iteratee) {
        if (this.array.length === 0) {
            return Promise.resolve([]);
        }
        const results = [];
        const goal = this.array.length;
        const looper = (idx, resolve) => {
            iteratee(this.array[idx], idx, (result) => {
                results.push(result);
                if (results.length === goal) {
                    resolve(results);
                }
                else {
                    looper(idx + 1, resolve);
                }
            });
        };
        return new Promise((resolve) => {
            looper(0, resolve);
        });
    }
    /**
     * The same as `Array.map` but runs async all `iteratee` function at the same time.
     *
     * @param iteratee - An async function to apply to each item in array.
     * @returns a promise with transformed values
     */
    _mapAsync(iteratee) {
        if (this.array.length === 0) {
            return Promise.resolve([]);
        }
        const results = [];
        let currentCnt = 0;
        const goal = this.array.length;
        const looper = (item, idx, resolve) => {
            iteratee(this.array[idx], idx, (result) => {
                results[idx] = result;
                currentCnt++;
                if (currentCnt === goal) {
                    resolve(results);
                }
            });
        };
        return new Promise((resolve) => {
            this.array.forEach((item, idx) => {
                looper(item, idx, resolve);
            });
        });
    }
    /**
     * The same as `Array.map`
     *
     * @param iteratee - An async function to apply to each item in array.
     * @returns transformed values
     */
    _map(iteratee) {
        return this.array.map(iteratee);
    }
    /**
     * The same as `Array.forEach` but runs async all `iteratee` functions.
     *
     * @param iteratee - An async function to apply to each item in array.
     * @returns a promise
     */
    _forEachAsync(iteratee) {
        if (this.array.length === 0) {
            return Promise.resolve();
        }
        const goal = this.array.length;
        let currentCnt = 0;
        const looper = (item, idx, resolve) => {
            iteratee(this.array[idx], idx, () => {
                currentCnt++;
                if (goal === currentCnt) {
                    resolve();
                }
            });
        };
        return new Promise((resolve) => {
            this.array.forEach((item, idx) => {
                looper(item, idx, resolve);
            });
        });
    }
    /**
     * The same as `Array.forEach`
     *
     * @param iteratee - An async function to apply to each item in array.
     */
    _forEach(iteratee) {
        if (this.array.length > 0) {
            this.array.forEach(iteratee);
        }
    }
    /**
     * The same as `Array.filter` but runs async all `iteratee` functions at the same time.
     *
     * @param iteratee - An async function to apply to each item in array.
     * @returns a promise with filtered values
     */
    _filterAsync(iteratee) {
        if (this.array.length === 0) {
            return Promise.resolve([]);
        }
        const results = [];
        let currentCnt = 0;
        const goal = this.array.length;
        const looper = (item, idx, resolve) => {
            iteratee(this.array[idx], idx, (result) => {
                results[idx] = result;
                currentCnt++;
                if (currentCnt === goal) {
                    resolve(this.array.filter((value, j) => {
                        return results[j];
                    }));
                }
            });
        };
        return new Promise((resolve) => {
            this.array.forEach((item, idx) => {
                looper(item, idx, resolve);
            });
        });
    }
    /**
     * The same as `Array.filter`
     *
     * @param iteratee - An async function to apply to each item in array.
     * @returns filtered values
     */
    _filter(iteratee) {
        if (this.array.length === 0) {
            return [];
        }
        const results = this.array.filter(iteratee);
        return results;
    }
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
    _indexOf(item, searchElement) {
        searchElement = searchElement === undefined || searchElement === null ? 0 : searchElement;
        if (typeof searchElement !== "number") {
            throw new Error("searchElement must be a number");
        }
        if (searchElement < 0) {
            throw new Error("searchElement must be over number than 0");
        }
        return this.array.indexOf(item, searchElement);
    }
    /**
     * Removes all elements. Fire `remove_at` event for each element.
     *
     * @param [noNotify] - Sets `true` if you don't want to fire `remove_at` event.
     */
    _empty(noNotify) {
        const cnt = this.array.length;
        for (let i = cnt - 1; i >= 0; i--) {
            this._removeAt(i, noNotify);
        }
    }
    /**
     * Adds one element to the end of an array and returns the new length of the array.
     * Fire `insert_at` event if `noNotify` is `false`.
     *
     * @param value - The element to add to the end of the array.
     * @param [noNotify] - Sets `true` if you don't want to fire `insert_at` event.
     * @returns The new length property of the object upon which the method was called.
     */
    _push(value, noNotify) {
        this.array.push(value);
        if (!noNotify) {
            this._trigger("insert_at", this.array.length - 1);
        }
        return this.array.length;
    }
    /**
     * Adds one element to the end of an array and returns the new length of the array.
     * Fire `insert_at` event if `noNotify` is `false`.
     *
     * @param index - The position of the array you want to insert new element.
     * @param value - The element to add to the end of the array.
     * @param [noNotify] - Sets `true` if you don't want to fire `insert_at` event.
     * @returns The new length property of the object upon which the method was called.
     */
    _insertAt(index, value, noNotify) {
        if (index < 0) {
            throw new Error("index must be over number than 0");
        }
        this.array.splice(index, 0, value);
        if (noNotify !== true) {
            this._trigger("insert_at", index);
        }
        return this.array.length;
    }
    /**
     * Returns a new array that is the clone of internal array.
     *
     * @returns New array
     */
    _getArray() {
        return JSON.parse(JSON.stringify(this.array));
    }
    /**
     * Returns item of specified position.
     *
     * @name getAt
     * @param index - The position of the array you want to get.
     * @returns item
     */
    _getAt(index) {
        if (index < 0) {
            throw new Error("index must be over number than 0");
        }
        if (index >= this.array.length) {
            throw new Error("index must be lower number than " + this.array.length);
        }
        return this.array[index];
    }
    /**
     * Replaces item of specified position.
     *
     * @param index - The position of the array you want to get.
     * @param value - New element
     * @param [noNotify] - Sets `true` if you don't want to fire `set_at` event.
     * @returns previous item
     */
    _setAt(index, value, noNotify) {
        if (index < 0) {
            throw new Error("index must be over number than 0");
        }
        if (index > this.array.length) {
            for (let i = this.array.length; i <= index; i++) {
                this.array[i] = undefined;
            }
        }
        const prev = this.array[index];
        this.array[index] = value;
        if (noNotify !== true) {
            this._trigger("set_at", index, prev);
        }
        return prev;
    }
    /**
     * Removes item of specified position.
     *
     * @param index - The position of the array you want to get.
     * @param [noNotify] - Sets `true` if you don't want to fire `remove_at` event.
     * @returns removed item
     */
    _removeAt(index, noNotify) {
        if (index < 0) {
            throw new Error("index must be over number than 0");
        }
        if (index >= this.array.length) {
            throw new Error("index must be lower number than " + this.array.length);
        }
        const prev = this.array[index];
        this.array.splice(index, 1);
        if (noNotify !== true) {
            this._trigger("remove_at", index, prev);
        }
        return prev;
    }
    /**
     * Removes item of the last array item.
     *
     * @param [noNotify] - Sets `true` if you don't want to fire `remove_at` event.
     * @returns  removed item
     */
    _pop(noNotify) {
        const index = this.array.length - 1;
        const prev = this.array.pop();
        this.array.splice(index, 1);
        if (noNotify !== true) {
            this._trigger("remove_at", index, prev);
        }
        return prev;
    }
    /**
     * Returns the length of array.
     *
     * @returns Number of items
     */
    _getLength() {
        return this.array.length;
    }
    /**
     * Reverses an array in place.
     * The first array element becomes the last, and the last array element becomes the first.
     *
     */
    _reverse() {
        this.array.reverse();
    }
    /**
     * The `sort()` method sorts the elements of an array in place and returns the array.
     * The same as `array.sort()`.
     *
     * @param [compareFunction] - Specifies a function that defines the sort order.
     *  If omitted, the array is sorted according to each character's Unicode code point value,
     *  according to the string conversion of each element.
     */
    _sort(compareFunction) {
        if (typeof compareFunction === "function") {
            this.array.sort(compareFunction);
        }
        else {
            this.array.sort();
        }
    }
}
exports.BaseArrayClass = BaseArrayClass;
