import { PluginBase } from "./PluginBase";
export interface IAppInitializeOptions {
    /**
     * Auth / General Use
     */
    apiKey?: string;
    /**
     * Auth with popup/redirect
     */
    authDomain?: string;
    /**
     * Realtime Database
     */
    databaseURL?: string;
    /**
     * Storage
     */
    storageBucket?: string;
    /**
     * Cloud Messaging
     */
    messagingSenderId?: string;
}
export declare class App extends PluginBase {
    name: string;
    private _options;
    private _isInitialized;
    /**
     * @constructor
     * @param [name] - Application name. Default value is "[DEFAULT]"
     * @param [initOptions] - Application initialize option.
     *  This parameter is for {@link: plugin.firebase.initializeApp()} method.
     */
    constructor(name?: string, initOptions?: IAppInitializeOptions);
    /**
     * Generate FirebaseDatabse instance
     * @param [url] - Realtime database url
     * @returns database instance
     */
    database(url?: string): any;
}
