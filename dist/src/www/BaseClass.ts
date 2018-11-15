
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
export class BaseClass {

  /**
   * Unique hash string.
   */
  public readonly hashCode: string = Math.floor(Date.now() * Math.random()).toString();

  /**
   * @hidden
   * Keep values with keys.
   */
  private vars: any = {};

  /**
   * @hidden
   * Keep listeners with event name.
   */
  private subs: any = {};

  /**
   * @hidden
   * Keep bindTo information
   */
  private _bindToDic = {};

  // /**
  //  * Create new BaseClass
  //  * @constructor
  //  */
  // constructor() {}

  /**
   * Removes all key-value stores
   */
  public _empty(): void {
    Object.keys(this.vars).forEach((name: string) => {
      this.vars[name] = null;
      delete this.vars[name];
    });
  }

  /**
   * Deletes the value saved with key.
   *
   * @param key - target key
   */
  public _delete(key: string): void {
    delete this.vars[key];
  }

  /**
   * Returns the value saved with key.
   *
   * @param key - target key
   */
  public _get(key: string): any {
    return this.vars[key];
  }

  /**
   * Saves one value with key.
   *
   * @param key - key
   * @param value - value
   * @param [noNotify] - Sets `true` if you don't want to fire `(key)_changed` event.
   */
  public _set(key: string, value: any, noNotify?: boolean): void {
    const prev: any = this.vars[key];

    this.vars[key] = value;

    if (prev !== value) {
      if (this._bindToDic[key]) {
        const keys: Array<string> = Object.keys(this._bindToDic[key]);
        keys.forEach((hashCode: any): void => {
            const info: any = this._bindToDic[key][hashCode];
            info.target._set(info.targetKey, value);
        });
      }
      if (!noNotify) {
        this._trigger(key + "_changed", prev, value, key);
      }
    }
  }

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
  public _bindTo(key: string, target: BaseClass, targetKey?: string, noNotify?: boolean): void {
    targetKey = targetKey || key;

    // If `noNotify` is true, prevent `(targetKey)_changed` event occurrs,
    // when bind the value for the first time only.
    // (Same behaviour as Google Maps JavaScript v3)
    target._set(targetKey, this.vars[key], noNotify);


    this._bindToDic[key] = this._bindToDic[key] || {};
    this._bindToDic[key][target.hashCode] = {
      target,
      targetKey,
    };
  }

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
  public _trigger(eventName: string, ...params: Array<any>): void {
    if (!eventName || !this.subs[eventName]) {
      return;
    }

    const listeners: Array<any> = this.subs[eventName];
    listeners.forEach((info: any): void => {
      if (info && info.listener && !info.deleted) {
        if (info.once) {
          info.deleted = true;
        }
        Promise.resolve().then(() => {
          info.listener.apply(this, params);
        });
      }
    });
    this.subs[eventName] = this.subs[eventName].filter((info: any): any => {
      return info && info.listener && !info.deleted;
    });
  }

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
  public _on(eventName: string, listener: (...parameters: Array<any>) => void): void {
    if (!listener || typeof listener !== "function") {
      throw new Error("Listener must be a function");
    }

    this.subs[eventName] = this.subs[eventName] || [];
    this.subs[eventName].push({
      deleted: false,
      listener,
      once: false,
    });
  }

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
  public _off(eventName?: string, listener?: (...parameters: Array<any>) => void): Array<(...parameters: Array<any>) => void> {

    const removedListeners: Array<(...parameters: Array<any>) => void> = [];
    if (eventName && listener) {
      for (let i: number = 0; i < this.subs[eventName].length; i++) {
        if (this.subs[eventName][i].listener === listener) {
          this.subs[eventName][i].deleted = true;
          this.subs[eventName].splice(i, 1);
          removedListeners.push(listener);
          break;
        }
      }
    } else if (eventName) {
      this.subs[eventName].forEach((info: any): void => {
        info.delete = true;
        removedListeners.push(info.listener);
      });
      delete this.subs[eventName];
    } else {
      const eventNames: Array<string> = Object.keys(this.subs);
      eventNames.forEach((name: string) => {
        this.subs[name].forEach((info: any): void => {
          info.delete = true;
          removedListeners.push(info.listener);
        });
        delete this.subs[name];
      });
    }

    return removedListeners;
  }

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
  public _one(eventName: string, listener: (...parameters: Array<any>) => void): void {
    if (!listener || typeof listener !== "function") {
      throw new Error("Listener must be a function");
    }

    this.subs[eventName] = this.subs[eventName] || [];
    this.subs[eventName].push({
      deleted: false,
      listener,
      once: true,
    });
  }

}
