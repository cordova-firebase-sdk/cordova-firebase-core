

var VARS_FIELD = typeof Symbol === 'undefined' ? '__vars' + Date.now() : Symbol('vars');
var SUBSCRIPTIONS_FIELD = typeof Symbol === 'undefined' ? '__subs' + Date.now() : Symbol('subscriptions');

function BaseClass() {
  this[VARS_FIELD] = {};
  this[SUBSCRIPTIONS_FIELD] = {};

  Object.defineProperty(this, 'hashCode', {
    value: Math.floor(Date.now() * Math.random())
  });
}

BaseClass.prototype = {
  _empty: function () {
    var vars = this[VARS_FIELD];

    Object.keys(vars).forEach(function (name) {
      vars[name] = null;
      delete vars[name];
    });
  },

  _delete: function (key) {
    return delete this[VARS_FIELD][key];
  },

  _get: function (key) {
    return this[VARS_FIELD].hasOwnProperty(key) ? this[VARS_FIELD][key] : undefined;
  },

  _set: function (key, value, noNotify) {
    var prev = this._get(key);

    this[VARS_FIELD][key] = value;

    if (!noNotify && prev !== value) {
      this._trigger(key + '_changed', prev, value, key);
    }

    return this;
  },

  _bindTo: function (key, target, targetKey, noNotify) {
    targetKey = targetKey || key;

    // If `noNotify` is true, prevent `(targetKey)_changed` event occurrs,
    // when bind the value for the first time only.
    // (Same behaviour as Google Maps JavaScript v3)
    target._set(targetKey, target._get(targetKey), noNotify);

    this.on(key + '_changed', function (oldValue, value) {
      target._set(targetKey, value);
    });
  },

  _trigger: function (eventName) {
    if (!eventName) {
      return this;
    }

    if (!this[SUBSCRIPTIONS_FIELD][eventName]) {
      return this;
    }

    var listeners = this[SUBSCRIPTIONS_FIELD][eventName];
    var i = listeners.length;
    var args = Array.prototype.slice.call(arguments, 1);
    listeners = listeners.filter(function(listener) {
      return !!listener;
    });

    while (i--) {
      listeners[i].apply(this, args);
    }

    return this;
  },

  _on: function (eventName, listener) {
    if (!listener || typeof listener !== 'function') {
      throw Error('Listener for on()/addEventListener() method is not a function');
    }
    var topic;
    this[SUBSCRIPTIONS_FIELD][eventName] = this[SUBSCRIPTIONS_FIELD][eventName] || [];
    topic = this[SUBSCRIPTIONS_FIELD][eventName];
    topic.push(listener);
    return this;
  },

  _off: function (eventName, listener) {
    var self = this;
    var removedListeners = [];
    if (!eventName && !listener) {
      var eventFields = self[SUBSCRIPTIONS_FIELD];
      var eventNames = Object.keys(eventFields);
      eventNames.forEach(function(eventName) {
        removedListeners = Array.prototype.concat.apply(removedListeners, self[SUBSCRIPTIONS_FIELD][eventName]);
        delete self[SUBSCRIPTIONS_FIELD][eventName];
      });
      return removedListeners;
    }

    if (eventName && !listener) {
      var listeners = self[SUBSCRIPTIONS_FIELD][eventName];
      var keys = Object.keys(listeners);
      keys.forEach(function(key) {
        removedListeners.push(self[SUBSCRIPTIONS_FIELD][key]);
        delete self[SUBSCRIPTIONS_FIELD][key];
      });
      delete this[SUBSCRIPTIONS_FIELD][eventName];
    } else if (this[SUBSCRIPTIONS_FIELD][eventName]) {
      var index = this[SUBSCRIPTIONS_FIELD][eventName].indexOf(listener);

      if (index !== -1) {
        var registered = this[SUBSCRIPTIONS_FIELD][eventName].splice(index, 1);
        removedListeners.push(registered[0]);
      }
    }

    return removedListeners;
  },

  _one: function (eventName, listener) {
    if (!listener || typeof listener !== 'function') {
      throw Error('Listener for one()/addEventListenerOnce() method is not a function');
    }

    var self = this;

    var callback = function () {
      self._off(eventName, arguments.callee);
      listener.apply(self, arguments);
      callback = undefined;
    };
    this._on(eventName, callback);

    return this;
  }
};

module.exports = BaseClass;
