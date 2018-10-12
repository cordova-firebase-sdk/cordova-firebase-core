


var utils = require('cordova/utils'),
  BaseClass = require('./BaseClass');

/****************************************************************************** *
 * @name FirebaseAppPlugin
 ******************************************************************************/
function FirebaseAppPlugin(id, app) {
  var self = this;
  BaseClass.apply(this);

  Object.defineProperty(self, 'id', {
    value: id
  });

  Object.defineProperty(self, 'app', {
    value: app
  });

}

utils.extend(FirebaseAppPlugin, BaseClass);

FirebaseAppPlugin.prototype.delete = function(onSuccess, onError) {
  this.app.delete()
    .then(onSuccess)
    .catch(onError);
};


Object.defineProperty(FirebaseAppPlugin.prototype, '_getInstance', {
  value: function() {
    return this.app;
  },
  enumerable: false
});

module.exports = FirebaseAppPlugin;
