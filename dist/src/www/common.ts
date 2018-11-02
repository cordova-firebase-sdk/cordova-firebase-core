// import { Promise } from "es6-promise";

declare let Promise: any;

/**
 * Returns true if given `packageName` is available.
 *
 * ```ts
 * isInitialized("firebase.app"); // true if window.firebase.app is available
 * ```
 * @param packageName - name space
 * @returns true if available.
 */
export const isInitialized = (packageName: string): boolean => {

  let parent: any = window;
  const steps: Array<string> = packageName.split(".");
  const results: Array<string> = steps.filter((step: string): boolean => {
    if (step in parent) {
      parent = parent[step];
      return true;
    } else {
      return false;
    }
  });

  return results.length === steps.length;
};

export interface IloadJsPromiseOptions {

  /**
   * expect JS package name after JS initized.
   */
  package: string;

  /**
   * JS url
   */
  url: string;
}

/**
 * Load JS file, and wait it is initialized.
 * @param options - options
 * @returns Promise<void>
 */
export const loadJsPromise = (options: IloadJsPromiseOptions): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (isInitialized(options.package)) {
      resolve();
    } else {
      const scriptTag: HTMLScriptElement = document.createElement("script") as HTMLScriptElement;
      scriptTag.src = options.url;
      scriptTag.onerror = reject;
      scriptTag.onload = () => {
        let timeout: number = 20;
        const timer = setInterval(() => {
          timeout--;
          if (isInitialized(options.package)) {
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
export const nextTick = (fn) => {
  Promise.resolve().then(fn);
};
