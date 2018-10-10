







var utils = require('cordova/utils'),
  common = require('./Common'),
  BaseClass = require('./BaseClass'),
  execCmd = require('./FirebaseCoreCommandQueue');

/*******************************************************************************
 * @name App
 ******************************************************************************/
function App(options, name) {
  BaseClass.call(this);

  var self = this;

  Object.defineProperty(self, 'options', {
    value: options
  });
  Object.defineProperty(self, 'name', {
    value: name
  });

  Object.defineProperty(self, 'id', {
    value: self.hashCode + '_fireapp',
    writable: true,
    enumerable: false
  });
  Object.defineProperty(self, '_isReady', {
    value: false,
    writable: true,
    enumerable: false
  });

  Object.defineProperty(self, '_isRemoved', {
    value: false,
    enumerable: false
  });

  execCmd.call({
    '_isReady': true
  }, function() {
    self._isReady = true;
    self._trigger('ready');
  }, function(error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error(error);
    }
  }, 'CordovaFirebaseCore', 'newInstance', [{
    'id': self.id,
    'options': options,
    'name': name
  }], {
    'sync': true
  });
}

utils.extend(App, BaseClass);


//---------------------------------------------------------------------------------
// App.database
// https://firebase.google.com/docs/reference/js/firebase.app.App#database
//---------------------------------------------------------------------------------
App.prototype.database = function(url) {
  var self = this;
  if (common.isInitialized('plugin.firebase.database._DBs')) {
    var CordovaFirebaseDatabase = require('cordova-firebase-database.cordova-firebase-database');
    var options = utils.clone(this.options);
    if (url) {
      options.databaseURL = url;
    }
    var db = new CordovaFirebaseDatabase(self.id, options);
    if (self._isReady) {
      db._trigger('fireAppReady');
    } else {
      self._on('ready', function() {
        db._trigger.call(db, 'fireAppReady');
      });
    }
    window.plugin.firebase.database._DBs[db.id] = db;
    return db;
  } else {
    throw new Error('cordova-firebase-database plugin is required to use this feature.');
  }
};







module.exports = App;
