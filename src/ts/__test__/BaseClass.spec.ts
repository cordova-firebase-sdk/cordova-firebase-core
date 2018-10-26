import Promise = require("es6-promise");
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

  it("'instanceA._one()' should receive 'hello_changed' event.", (done) => {
    instanceA._one("hello_changed", (prevValue: string, newValue: string) => {
      expect(prevValue).toEqual("world");
      expect(newValue).toEqual("Aloha");
      done();
    });
    instanceA._set("hello", "Aloha");
  });

  it("'instanceA._on()' should receive 'hello_changed' event twice.", (done) => {
    (new Promise.Promise((resolve, reject) => {
      const timer: any = setTimeout(reject, 100); // just in case

      let count: number = 0;
      const listener = (prevValue: string, newValue: string) => {
        count++;
        if (count === 2) {
          instanceA._off("hello_changed", listener);
          clearTimeout(timer);
          resolve(newValue);
        }
      };
      instanceA._on("hello_changed", listener);

      instanceA._set("hello", "你好");
      instanceA._set("hello", "こんにちは");
    }))
    .then((answer: string) => {
      expect(answer).toBe("こんにちは");
      done();
    });
  });

  it("'instanceA._on() then ._off()' should receive only one time 'hello_changed' event.", (done) => {
    (new Promise.Promise((resolve, reject) => {
      let count: number = 0;
      const listener = () => {
        count++;
        instanceA._off("hello_changed", listener);
      };
      instanceA._on("hello_changed", listener);

      setTimeout(() => {
        resolve(count);
      }, 100);

      for (let i: number = 0; i < 100; i++) {
        instanceA._set("hello", i);
      }
    }))
    .then((answer: number) => {
      expect(answer).toBe(1);
      done();
    });
  });

  it("'instanceA._off()' should remove all event listeners.", (done) => {
    (new Promise.Promise((resolve, reject) => {
      let called: boolean = false;
      const dummyListener = () => {
        called = true;
      };

      instanceA._on("myEvent", dummyListener);
      instanceA._on("myEvent", dummyListener);
      instanceA._on("myEvent", dummyListener);
      instanceA._on("myEvent", dummyListener);
      instanceA._off("myEvent");
      instanceA._trigger("myEvent");

      setTimeout(() => {
        resolve(called);
      }, 100);

    }))
    .then((answer: boolean) => {
      expect(answer).toBe(false);
      done();
    });
  });

  it("'instanceA._trigger()' should fire a 'myEvent' event.", (done) => {
    (new Promise.Promise((resolve, reject) => {

      const timer: any = setTimeout(reject, 100); // just in case

      instanceA._on("myEvent", (...parameters: any[]) => {
        clearTimeout(timer);
        resolve(parameters);
      });

      instanceA._trigger("myEvent", "data", 1);
    }))
    .then((receivedData: any[]) => {
      expect(receivedData[0]).toBe("data");
      expect(receivedData[1]).toBe(1);
      done();
    });
  });

  it("'instanceA._set(), _delete(), then _get()' should be undefined.", () => {
    instanceA._set("hello", "BaseClass");
    instanceA._delete("hello");
    expect(instanceA._get("hello")).toBe(undefined);
  });

  it("'instanceA._empty()' should delete all holded variables.", () => {
    instanceA._set("hello1", "world");
    instanceA._set("hello2", "test");
    instanceA._empty();
    expect(instanceA._get("hello1")).toBe(undefined);
    expect(instanceA._get("hello2")).toBe(undefined);
  });

});
