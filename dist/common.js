"use strict";
// import { Promise } from "es6-promise";
Object.defineProperty(exports, "__esModule", { value: true });
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
    var steps = packageName.split(".");
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
    return new Promise(function (resolve, reject) {
        if (exports.isInitialized(options.package)) {
            resolve();
        }
        else {
            var scriptTag = document.createElement("script");
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
                        clearInterval(timer);
                        reject(new Error("[Timeout] JS does not initialized in 10 seconds."));
                    }
                }, 500);
            };
            document.body.appendChild(scriptTag);
        }
    });
};
/**
 * @hidden
 */
exports.nextTick = function (fn) {
    Promise.resolve().then(fn);
};
