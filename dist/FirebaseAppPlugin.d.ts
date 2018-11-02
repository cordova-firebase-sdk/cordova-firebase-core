import { BaseClass } from "./BaseClass";
/**
 * @hidden
 * This class is implementation of "FirebaseAppPlugin" for browser platform.
 * Not use for JS side.
 */
export declare class FirebaseAppPlugin extends BaseClass {
    private _app;
    private _id;
    constructor(id: string, app: any);
    readonly id: string;
    readonly app: any;
    delete(onSuccess: any, onError: any): void;
}
