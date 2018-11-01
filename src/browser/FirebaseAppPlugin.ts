import { BaseClass } from "../www/BaseClass";

/**
 * @hidden
 * This class is for native implement. Not for public use.
 */
export class FirebaseAppPlugin extends BaseClass {

  private _app: any;
  private _id: string;

  constructor(id: string, app: any) {
    super();
    this._app = app;
    this._id = id;
  }

  get id(): string {
    return this._id;
  }

  get app(): string {
    return this._app;
  }

  public delete(onSuccess, onError): void {
    this._app.delete()
      .then(onSuccess)
      .catch(onError);
  }
}
