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
   * Credential
   */
  credential?: string;

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

  /**
   * Accept extra properties
   */
  [key: string]: any;
}
