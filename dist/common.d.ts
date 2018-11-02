/**
 * Returns true if given `packageName` is available.
 *
 * ```ts
 * isInitialized("firebase.app"); // true if window.firebase.app is available
 * ```
 * @param packageName - name space
 * @returns true if available.
 */
export declare const isInitialized: (packageName: string) => boolean;
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
export declare const loadJsPromise: (options: IloadJsPromiseOptions) => Promise<void>;
/**
 * @hidden
 */
export declare const nextTick: (fn: any) => void;
