module.exports = function(ctx) {

  var PluginInfoProvider = ctx.requireCordovaModule("cordova-common").PluginInfoProvider;

  var Q = ctx.requireCordovaModule("q"),
      path = ctx.requireCordovaModule("path");
  var fs = require("fs");

  var projectRoot = ctx.opts.projectRoot;
  return Q.Promise(function(resolve, reject, notify) {

    var iosPlatformDir = path.join(projectRoot, "platforms", "ios");
    if (fs.existsSync(iosPlatformDir)) {

      var exec = require("child_process").exec;
      exec("pod --version 2>&1", function(err, podVersion) {
        if (err) {
          reject(err);
        } else {
          console.log("pod --version: " + podVersion);
          if (/^0./.test(podVersion)) {
            reject("The cocoa pod version is out-of-dated. Please upgrade cocoapod on your PC. https://bit.ly/2DjJcA8")
          } else {
            exec("pod update 2>&1", function() {
              resolve();
            });
          }
        }
      });
    } else {
      resolve();
    }
  });

};
