"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var es6_promise_1 = require("es6-promise");
/**
 * Returns true if given `packageName` is available.
 *
 * ```ts
 * isInitialized("firebase.app"); // true if window.firebase.app is available
 * ```
 * @param packageName - name space
 * @returns true if available.
 */
exports.isInitialized = function (packageName) {
    var parent = window;
    var steps = packageName.split(/\\./);
    var results = steps.filter(function (step) {
        if (step in parent) {
            parent = parent[step];
            return true;
        }
        else {
            return false;
        }
    });
    return results.length === steps.length;
};
/**
 * Load JS file, and wait it is initialized.
 * @param options - options
 * @returns Promise<void>
 */
exports.loadJsPromise = function (options) {
    return new es6_promise_1.Promise(function (resolve, reject) {
        if (exports.isInitialized(options.package)) {
            resolve();
        }
        else {
            var scriptTag = document.createElement("src");
            scriptTag.src = options.url;
            scriptTag.onerror = reject;
            scriptTag.onload = function () {
                var timeout = 20;
                var timer = setInterval(function () {
                    timeout--;
                    if (exports.isInitialized(options.package)) {
                        clearInterval(timer);
                        resolve();
                    }
                    if (timeout === 0) {
                        reject(new Error("[Timeout] JS does not initialized in 2 seconds."));
                    }
                }, 10);
            };
            document.body.appendChild(scriptTag);
        }
    });
};
/**
 * @hidden
 */
exports.nextTick = function (fn) {
    es6_promise_1.Promise.resolve().then(fn);
};
