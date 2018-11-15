import { App } from "../App";
import * as common from "../__mocks__/common";
import { Database } from "../__mocks__/Database";
import { exec } from "../__mocks__/cordova";

describe("[App]", () => {

  it ("name should be [DEFAULT]", () => {
    const app: App = new App();
    expect(app.name).toEqual("[DEFAULT]");
  });
  it ("name should be 'hello'", () => {
    const app: App = new App("hello");
    expect(app.name).toEqual("hello");
  });

  describe("[App.databaseURL option]", () => {
    it("should throw error if does not start with https://(projectId).firebaseio.com", () => {
      expect(() => {
        new App("hello", {
          databaseURL: "https://myproject.firebase.com",
        });
      }).toThrowErrorMatchingSnapshot();
    });
    it("should throw error if does not point the root reference", () => {
      expect(() => {
        new App("hello", {
          databaseURL: "https://myproject.firebaseio.com/test/",
        });
      }).toThrowErrorMatchingSnapshot();
    });
    it("should throw error if try to obtain default app before initializing", () => {
      expect(() => {
        (window as any).plugin.firebase.app();
      }).toThrowErrorMatchingSnapshot();
    });
    it("should throw error if specified app has not been initialized", () => {
      expect(() => {
        (window as any).plugin.firebase.app("MYAPP");
      }).toThrowErrorMatchingSnapshot();
    });
    it("should create a DEFAULT app", () => {
      const app = (window as any).plugin.firebase.initializeApp({
        apiKey: "(YOUR API KEY)",
        databaseURL: "https://(PROJECT ID).firebaseio.com",
      });
      expect(app.name).toBe("[DEFAULT]");
    });
    it("should return the DEFAULT app", () => {
      const app = (window as any).plugin.firebase.app();
      expect(app.name).toBe("[DEFAULT]");
    });
    it("should throw error is app name is not string", () => {
      expect(() => {
        (window as any).plugin.firebase.initializeApp({
          apiKey: "(YOUR API KEY)",
          databaseURL: "https://(PROJECT ID).firebaseio.com",
        }, 3333);
      }).toThrowErrorMatchingSnapshot();
    });
    it("should throw error if app is already created", () => {
      expect(() => {
        const app1 = (window as any).plugin.firebase.initializeApp({
          apiKey: "(YOUR API KEY)",
          databaseURL: "https://(PROJECT ID).firebaseio.com",
        }, "MYAPP");
        const app2 = (window as any).plugin.firebase.initializeApp({
          apiKey: "(YOUR API KEY)",
          databaseURL: "https://(PROJECT ID).firebaseio.com",
        }, "MYAPP");
      }).toThrowErrorMatchingSnapshot();
    });
    it("should return 2 apps so far", () => {
      expect((window as any).plugin.firebase.apps).toHaveLength(2);
    });
  });
});

describe("[App.database]", () => {

  // beforeEach(() => {
  //   // Clear all instances and calls to constructor and all methods:
  //   common.isInitialized.mockReset();
  // });

  it("should generate database instance", () => {
    common.isInitialized.mockImplementationOnce(() => {
      return true;
    });
    (window as any).plugin.firebase.database = jest.fn((app, options) => {
      return new Database(app, options);
    });

    const app: App = new App("hello");
    const database = app.database();
    expect(database.app).toEqual(app);
  });

  it("should generate database instance with databaseUrl", () => {
    common.isInitialized.mockImplementationOnce(() => {
      return true;
    });
    (window as any).plugin.firebase.database = jest.fn((app, options) => {
      return new Database(app, options);
    });

    const app: App = new App("hello", {
      apiKey: "(YOUR API KEY)",
      databaseURL: "https://dummy.firebaseio.com",
    });
    const database = app.database("https://dummy.firebaseio.com/users/test");
    expect(database.app).toEqual(app);
  });
  it("should throw Error if additional plugin has not been loaded", () => {
    common.isInitialized.mockImplementationOnce(() => {
      return false;
    });
    (window as any).plugin.firebase.database = jest.fn((app, options) => {
      return new Database(app, options);
    });

    const app: App = new App("hello", {
      apiKey: "(YOUR API KEY)",
      databaseURL: "https://dummy.firebaseio.com",
    });
    expect(() => {
      const database = app.database("https://dummy.firebaseio.com/users/test");
    }).toThrowErrorMatchingSnapshot();
  });
  it("should fire 'fireAppReady' if app fires 'ready' event", (done) => {
    common.isInitialized.mockImplementationOnce(() => {
      return true;
    });
    (window as any).plugin.firebase.database = jest.fn((app, options) => {
      return new Database(app, options);
    });

    const app: App = new App("hello", {
      apiKey: "(YOUR API KEY)",
      databaseURL: "https://dummy.firebaseio.com",
    });
    const database = app.database("https://dummy.firebaseio.com/users/test");
    database._one("fireAppReady", () => {
      setTimeout(() => {
        expect(database.isReady).toBe(true);
        done();
      }, 3);
    });
    app._trigger("ready");
  });
  it("should fire 'fireAppReady' if app has been already initialized", (done) => {
    common.isInitialized.mockImplementationOnce(() => {
      return true;
    });
    (window as any).plugin.firebase.database = jest.fn((app, options) => {
      return new Database(app, options);
    });
    exec.mockReset();
    exec.mockImplementationOnce((onSuccess) => {
      onSuccess();
    });

    const app: App = new App("hello", {
      apiKey: "(YOUR API KEY)",
      databaseURL: "https://dummy.firebaseio.com",
    });

    setTimeout(() => {
      expect(app.isReady).toBe(true);
      const database = app.database("https://dummy.firebaseio.com/users/test");
      setTimeout(() => {
        expect(database.isReady).toBe(true);
        done();
      }, 5);
    }, 10);
  });
});
