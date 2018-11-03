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
});
