import { BaseClass } from "./BaseClass";
/**
 * MVC Array class.
 *
 * @remarks
 * This class extends {@link BaseClass}
 */
export declare class BaseArrayClass extends BaseClass {
    /**
     * @hidden
     * Keep array values
     */
    protected array: Array<any>;
    /**
     * Create new BaseArrayClass
     * @constructor
     */
    constructor(initialArray?: Array<any>);
    /**
     * The same as `Array.map` but runs a single async operation at a time.
     *
     * @param iteratee - An async function to apply to each item in array.
     * @returns a promise with transformed values
     */
    _mapSeries(iteratee: (item: any, idx: number, next: (result: any) => void) => void): Promise<Array<any>>;
    /**
     * The same as `Array.map` but runs async all `iteratee` function at the same time.
     *
     * @param iteratee - An async function to apply to each item in array.
     * @returns a promise with transformed values
     */
    _mapAsync(iteratee: (item: any, idx: number, next: (result: any) => void) => void): Promise<Array<any>>;
    /**
     * The same as `Array.map`
     *
     * @param iteratee - An async function to apply to each item in array.
     * @returns transformed values
     */
    _map(iteratee: (item: any) => any): Array<any>;
    /**
     * The same as `Array.forEach` but runs async all `iteratee` functions.
     *
     * @param iteratee - An async function to apply to each item in array.
     * @returns a promise
     */
    _forEachAsync(iteratee: (item: any, idx: number, next: () => void) => void): Promise<void>;
    /**
     * The same as `Array.forEach`
     *
     * @param iteratee - An async function to apply to each item in array.
     */
    _forEach(iteratee: (item: any, idx: number) => any): void;
    /**
     * The same as `Array.filter` but runs async all `iteratee` functions at the same time.
     *
     * @param iteratee - An async function to apply to each item in array.
     * @returns a promise with filtered values
     */
    _filterAsync(iteratee: (item: any, idx: number, next: (result: boolean) => void) => void): Promise<Array<any>>;
    /**
     * The same as `Array.filter`
     *
     * @param iteratee - An async function to apply to each item in array.
     * @returns filtered values
     */
    _filter(iteratee: (item: any, idx: number) => boolean): Array<any>;
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
    _indexOf(item: any, searchElement?: number): number;
    /**
     * Removes all elements. Fire `remove_at` event for each element.
     *
     * @param [noNotify] - Sets `true` if you don't want to fire `remove_at` event.
     */
    _empty(noNotify?: boolean): void;
    /**
     * Adds one element to the end of an array and returns the new length of the array.
     * Fire `insert_at` event if `noNotify` is `false`.
     *
     * @param value - The element to add to the end of the array.
     * @param [noNotify] - Sets `true` if you don't want to fire `insert_at` event.
     * @returns The new length property of the object upon which the method was called.
     */
    _push(value: any, noNotify?: boolean): number;
    /**
     * Adds one element to the end of an array and returns the new length of the array.
     * Fire `insert_at` event if `noNotify` is `false`.
     *
     * @param index - The position of the array you want to insert new element.
     * @param value - The element to add to the end of the array.
     * @param [noNotify] - Sets `true` if you don't want to fire `insert_at` event.
     * @returns The new length property of the object upon which the method was called.
     */
    _insertAt(index: number, value: any, noNotify?: boolean): number;
    /**
     * Returns a new array that is the clone of internal array.
     *
     * @returns New array
     */
    _getArray(): Array<any>;
    /**
     * Returns item of specified position.
     *
     * @name getAt
     * @param index - The position of the array you want to get.
     * @returns item
     */
    _getAt(index: number): any;
    /**
     * Replaces item of specified position.
     *
     * @param index - The position of the array you want to get.
     * @param value - New element
     * @param [noNotify] - Sets `true` if you don't want to fire `set_at` event.
     * @returns previous item
     */
    _setAt(index: number, value: any, noNotify?: boolean): any;
    /**
     * Removes item of specified position.
     *
     * @param index - The position of the array you want to get.
     * @param [noNotify] - Sets `true` if you don't want to fire `remove_at` event.
     * @returns removed item
     */
    _removeAt(index: number, noNotify?: boolean): any;
    /**
     * Removes item of the last array item.
     *
     * @param [noNotify] - Sets `true` if you don't want to fire `remove_at` event.
     * @returns  removed item
     */
    _pop(noNotify?: boolean): any;
    /**
     * Returns the length of array.
     *
     * @returns Number of items
     */
    _getLength(): number;
    /**
     * Reverses an array in place.
     * The first array element becomes the last, and the last array element becomes the first.
     *
     */
    _reverse(): void;
    /**
     * The `sort()` method sorts the elements of an array in place and returns the array.
     * The same as `array.sort()`.
     *
     * @param [compareFunction] - Specifies a function that defines the sort order.
     *  If omitted, the array is sorted according to each character's Unicode code point value,
     *  according to the string conversion of each element.
     */
    _sort(compareFunction?: (a: any, b: any) => number): void;
}
