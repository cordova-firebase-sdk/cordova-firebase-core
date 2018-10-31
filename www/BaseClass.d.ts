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
export declare class BaseClass {
    /**
     * @hidden
     * Keep values with keys.
     */
    protected vars: any;
    /**
     * @hidden
     * Keep listeners with event name.
     */
    protected subs: any;
    /**
     * @hidden
     * Keep listeners with event name.
     */
    protected readonly hashCode: number;
    /**
     * Removes all key-value stores
     */
    _empty(): void;
    /**
     * Deletes the value saved with key.
     *
     * @param key - target key
     */
    _delete(key: string): void;
    /**
     * Returns the value saved with key.
     *
     * @param key - target key
     */
    _get(key: string): any;
    /**
     * Saves one value with key.
     *
     * @param key - key
     * @param value - value
     * @param [noNotify] - Sets `true` if you don't want to fire `(key)_changed` event.
     */
    _set(key: string, value: any, noNotify?: boolean): void;
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
    _bindTo(key: string, target: BaseClass, targetKey?: string, noNotify?: boolean): void;
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
    _trigger(eventName: string, ...parameters: any[]): void;
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
    _on(eventName: string, listener: (...parameters: any[]) => void): void;
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
    _off(eventName?: string, listener?: (...parameters: any[]) => void): Array<(...parameters: any[]) => void>;
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
    _one(eventName: string, listener: (...parameters: any[]) => void): void;
}
