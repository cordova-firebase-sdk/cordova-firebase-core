import BaseClass = require("../BaseClass");

describe("BaseClass test", () => {

  const instanceA: BaseClass = new BaseClass();
  const instanceB: BaseClass = new BaseClass();

  it("'instanceA.hello' should be 'world'", () => {
    instanceA._set("hello", "world");
    expect(instanceA._get("hello")).toEqual("world");
  });

  it("'instanceB.anotherHello' should be the same as 'instanceA.hello'", () => {
    instanceA._bindTo("hello", instanceB, "anotherHello");
    expect(instanceB._get("anotherHello")).toEqual("world");
  });

});
