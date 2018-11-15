import { PluginBase } from "../PluginBase";
export declare class Database extends PluginBase {
    app: any;
    _isReady: boolean;
    private _options;
    constructor(app: any, options?: any);
}
