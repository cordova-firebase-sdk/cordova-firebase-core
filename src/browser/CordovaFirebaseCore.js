




var BaseClass = require('./BaseClass'),
  utils = require('cordova/utils'),
  FirebaseAppPlugin = require('./FirebaseAppPlugin'),
  common = require('./Common');


function CordovaFirebaseCore() {
  BaseClass.apply(this);
}
utils.extend(CordovaFirebaseCore, BaseClass);

CordovaFirebaseCore.prototype.newInstance = function(resolve, reject, args) {

  common.loadJsPromise({
    'url': 'https://www.gstatic.com/firebasejs/5.5.0/firebase-app.js',
    'package': 'firebase.app'
  })
  .then(function() {
    var options = args[0] || {};
    var name = args[1] || '[DEFAULT]';

    // Create an application instance
    var app = firebase.initializeApp(options.options, name);
    console.log('--->[browser] CordovaFirebaseCore.newInstance() : ' + options.id);

    // Create firebase app reference
    var instance = new FirebaseAppPlugin(options.id, app);
    var dummyObj = {};
    var keys = Object.getOwnPropertyNames(FirebaseAppPlugin.prototype).filter(function (p) {
      return typeof FirebaseAppPlugin.prototype[p] === 'function';
    });
    keys.forEach(function(key) {
      dummyObj[key] = instance[key].bind(instance);
    });
    require('cordova/exec/proxy').add(options.id, dummyObj);

    resolve();
  })
  .catch(reject);
};


// Register this plugin
(function() {
  var instance = new CordovaFirebaseCore();
  var dummyObj = {};
  var keys = Object.getOwnPropertyNames(CordovaFirebaseCore.prototype).filter(function (p) {
    return typeof CordovaFirebaseCore.prototype[p] === 'function';
  });
  keys.forEach(function(key) {
    dummyObj[key] = instance[key].bind(instance);
  });

  require('cordova/exec/proxy').add('CordovaFirebaseCore', dummyObj);
})();
