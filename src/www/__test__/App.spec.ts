import { App } from "../App";

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
    it ("should throw error if does not start with https://(projectId).firebaseio.com", () => {
      expect(() => {
        new App("hello", {
          databaseURL: "https://myproject.firebase.com",
        });
      }).toThrowErrorMatchingSnapshot();
    });
    it ("should throw error if does not point the root reference", () => {
      expect(() => {
        new App("hello", {
          databaseURL: "https://myproject.firebaseio.com/test/",
        });
      }).toThrowErrorMatchingSnapshot();
    });
  });
});
