



var App = require('./App');

function initializeApp(options, name) {
  if (!options) {
    throw new Error('Options parameter is required');
  }
  name = name || '[DEFAULT]';
  var app = new App(options, name);
  window.plugin.firebase.app._APPs[app.id] = app;
  return app;
}

cordova.addConstructor(function() {
  if (!window.Cordova) {
    window.Cordova = cordova;
  }
  window.plugin = window.plugin || {};
  window.plugin.firebase = window.plugin.firebase || {};

  Object.defineProperty(window.plugin.firebase, 'initializeApp', {
    value: initializeApp
  });

  window.plugin.firebase.app = window.plugin.firebase.app || {};

  Object.defineProperty(window.plugin.firebase.app, '_APPs', {
    value: {}
  });

  Object.defineProperty(window.plugin.firebase.app, 'WEBJS_SDK_VERSION', {
    value: '5.5.0'
  });
  Object.defineProperty(window.plugin.firebase.app, 'IOS_SDK_VERSION', {
    value: '5.5.0'
  });
  Object.defineProperty(window.plugin.firebase.app, 'ANDROID_SDK_VERSION', {
    value: '5.5.0'
  });
});
