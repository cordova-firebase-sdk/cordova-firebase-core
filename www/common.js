"use strict";
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
exports.isInitialized = (packageName) => {
    let parent = window;
    const steps = packageName.split(/\\./);
    const results = steps.filter((step) => {
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
exports.loadJsPromise = (options) => {
    return new Promise((resolve, reject) => {
        if (exports.isInitialized(options.package)) {
            resolve();
        }
        else {
            const scriptTag = document.createElement("src");
            scriptTag.src = options.url;
            scriptTag.onerror = reject;
            scriptTag.onload = () => {
                let timeout = 20;
                const timer = setInterval(() => {
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
exports.nextTick = (fn) => {
    Promise.resolve().then(fn);
};
