class BaseClass {

  protected vars: any = {};
  protected subs: any = {};

  constructor() {

    Object.defineProperty(this, "hashCode", {
      value: Math.floor(Date.now() * Math.random()),
    });

  }

  public _empty(): void {
    Object.keys(this.vars).forEach((name: string) => {
      this.vars[name] = null;
      delete this.vars[name];
    });
  }

  public _delete(key: string): void {
    delete this.vars[key];
  }

  public _get(key: string): any {
    return this.vars[key];
  }

  public _set(key: string, value: any, noNotify?: boolean): void {
    const prev: any = this.vars[key];

    this.vars[key] = value;

    if (!noNotify && prev !== value) {
      this._trigger(key + "_changed", prev, value, key);
    }
  }

  public _bindTo(key: string, target: BaseClass, targetKey?: string, noNotify?: boolean): void {
    targetKey = targetKey || key;

    // If `noNotify` is true, prevent `(targetKey)_changed` event occurrs,
    // when bind the value for the first time only.
    // (Same behaviour as Google Maps JavaScript v3)
    target._set(targetKey, this.vars[key], noNotify);

    this._on(key + "_changed", (oldValue: any, newValue: any) => {
      target._set(targetKey, newValue);
    });
  }

  public _trigger(eventName: string, ...parameters: any[]): void {
    if (!eventName || !this.subs[eventName]) {
      return;
    }

    const listeners: Array<(...parameters: any[]) => void> = this.subs[eventName];
    listeners.forEach((subscriber: (...parameters: any[]) => void) => {
      if (subscriber) {
        subscriber.apply(this, parameters);
      }
    });
  }

  public _on(eventName: string, listener: (...parameters: any[]) => void): void {
    if (!listener || typeof listener !== "function") {
      throw new Error("Listener must be a function");
    }

    this.subs[eventName] = this.subs[eventName] || [];
    this.subs[eventName].push(listener);
  }

  public _off(eventName?: string, listener?: (...parameters: any[]) => void): Array<(...parameters: any[]) => void> {
    let removedListeners: Array<(...parameters: any[]) => void> = [];
    if (!eventName && !listener) {
      const eventNames: string[] = Object.keys(this.subs);
      eventNames.forEach((name: string) => {
        removedListeners = Array.prototype.concat.apply(removedListeners, this.subs[name]);
        delete this.subs[name];
      });
    } else if (eventName) {
      removedListeners = Array.prototype.concat.apply(removedListeners, this.subs[eventName]);
      delete this.subs[eventName];
    } else {
      const index: number = this.subs[eventName].indexOf(listener);
      if (index !== -1) {
        this.subs[eventName].splice(index, 1);
        removedListeners.push(listener);
      }
    }

    return removedListeners;
  }

  public _one(eventName: string, listener: (...parameters: any[]) => void): void {
    if (!listener || typeof listener !== "function") {
      throw new Error("Listener must be a function");
    }

    const callback: ((...parameters: any[]) => void) = (...parameters: any[]) => {
      this._off(eventName, callback);
      listener.apply(this, parameters);
    };
    this._on(eventName, callback);
  }

}

export = BaseClass;
