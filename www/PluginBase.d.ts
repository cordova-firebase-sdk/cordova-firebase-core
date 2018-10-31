import { BaseClass } from "./BaseClass";
export declare class PluginBase extends BaseClass {
    isRemoved: boolean;
    protected _isReady: boolean;
    private _id;
    /**
     * @constructor
     * @param idSuffix - Plugin's ID suffix
     */
    constructor(idSuffix: string);
    readonly id: string;
    readonly isReady: boolean;
}
