import { BaseClass } from "./BaseClass";
export declare class PluginBase extends BaseClass {
    isReady: boolean;
    isRemoved: boolean;
    private _id;
    /**
     * @constructor
     * @param id - Plugin's ID
     */
    constructor(id: string);
    readonly id: string;
}
