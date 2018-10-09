







var utils = require('cordova/utils'),
  common = require('./Common'),
  BaseClass = require('./BaseClass'),
  BaseArrayClass = require('./BaseArrayClass'),
  execCmd = require('./FirebaseCoreCommandQueue');

/*******************************************************************************
 * @name App
 ******************************************************************************/
function App(options, name) {
  BaseClass.call(this);

  var self = this,
    cmdQueue = new BaseArrayClass();

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

  cmdQueue._on('insert_at', function() {
    if (!self._isReady) return;

    var cmd;
    while(cmdQueue.getLength() > 0) {
      cmd = cmdQueue.removeAt(0, true);
      if (cmd && cmd.target && cmd.args) {

        execCmd.apply(cmd.target, cmd.args);
      }
    }
  });

  Object.defineProperty(self, '_cmdQueue', {
    value: cmdQueue,
    writable: false,
    enumerable: false
  });


  execCmd.call({
    '_isReady': true
  }, function() {
    self._isReady = true;
    self._cmdQueue._trigger('insert_at');
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

Object.defineProperty(App.prototype, '_exec', {
  value: function() {
    this._cmdQueue.push.call(this._cmdQueue, {
      target: this,
      args: Array.prototype.slice.call(arguments, 0)
    });
  },
  writable: false,
  enumerable: false
});

//---------------------------------------------------------------------------------
// App.database
// https://firebase.google.com/docs/reference/js/firebase.app.App#database
//---------------------------------------------------------------------------------
App.prototype.database = function(url) {
  if (common.isInitialized('plugin.firebase.database._DBs')) {
    var CordovaFirebaseDatabase = require('cordova-firebase-database/CordovaFirebaseDatabase');
    var options = utils.clone(this.options);
    options.databaseURL = url;
    var db = new CordovaFirebaseDatabase(options, this.name);
    window.plugin.firebase.database._DBs[db.id] = db;
    return db;
  } else {
    throw new Error('cordova-firebase-database plugin is required to use this feature.');
  }
};







module.exports = App;
