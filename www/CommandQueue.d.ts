import { Promise } from "es6-promise";
import { PluginBase } from "./PluginBase";
/**
 * Parameters for execCmd function
 */
export interface IExecCmdParams {
    /**
     * Plugin's context
     */
    context: PluginBase;
    /**
     * Execute method name
     */
    methodName: string;
    /**
     * parameters for native side
     */
    options?: any[];
    /**
     * synchronize options
     */
    execOptions?: {
        sync?: boolean;
        remove?: boolean;
    };
}
export declare const execCmd: (params: IExecCmdParams) => Promise<any>;
