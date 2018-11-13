// import { Promise } from "es6-promise";
import { BaseClass } from "../BaseClass";
declare let Promise: any;

describe("BaseClass test", () => {
  

  describe("_set()", () => {
    it("'instance.hello' should be 'world'", () => {
      const instance: BaseClass = new BaseClass();
      instance._set("hello", "world");
      expect(instance._get("hello")).toEqual("world");
    });
  });

  describe("_bindTo()", () => {
    it("'instanceB.anotherHello' should be the same as 'instanceA.hello'", () => {
      const instanceA: BaseClass = new BaseClass();
      const instanceB: BaseClass = new BaseClass();

      instanceA._bindTo("hello", instanceB, "anotherHello");
      instanceA._set("hello", "world");
      expect(instanceA._get("hello")).toEqual("world");
      expect(instanceB._get("anotherHello")).toEqual("world");
    });
  });

  describe("_one()", () => {
    it("'instance._one()' should receive 'hello_changed' event only one time.", (done) => {
      const instance: BaseClass = new BaseClass();
      instance._set("hello", "world");

      instance._one("hello_changed", (prevValue: string, newValue: string) => {
        expect(prevValue).toEqual("world");
        expect(newValue).toEqual("Aloha");
        done();
      });

      instance._set("hello", "Aloha");
      instance._set("hello", "こんにちは");
    });
  });

  describe("_on()", () => {
    it("'instance._on()' should receive 'hello_changed' event twice.", (done) => {
      (new Promise((resolve, reject) => {
        const instance: BaseClass = new BaseClass();
        const timer: any = setTimeout(reject, 10); // just in case

        let count: number = 0;
        const listener = (prevValue: string, newValue: string) => {
          count++;
          if (count === 2) {
            instance._off("hello_changed", listener);
            clearTimeout(timer);
            resolve(newValue);
          }
        };
        instance._on("hello_changed", listener);

        instance._set("hello", "你好");      // should receive
        instance._set("hello", "こんにちは"); // should receive
        instance._set("hello", "안녕하세요");  // should not receive
      }))
      .then((answer: string) => {
        expect(answer).toBe("こんにちは");
        done();
      });
    });

    it("'instance._on(one, two, three)' should receive `1, 2, 3`.", (done) => {
      (new Promise((resolve, reject) => {
        const instance: BaseClass = new BaseClass();
        const timer: any = setTimeout(reject, 10); // just in case

        instance._on("myEvent", (one: number, two: number, three: number) => {
          expect(one).toBe(1);
          expect(two).toBe(2);
          expect(three).toBe(3);
          resolve();
        });

        instance._trigger("myEvent", 1, 2, 3);
      }))
      .then(done);
    });

    it("should work multiple event listeners for one event.", (done) => {
      (new Promise((resolve, reject) => {
        const instance: BaseClass = new BaseClass();
        const timer: any = setTimeout(reject, 10); // just in case
        let receiveCnt: number = 0;
        instance._on("received", () => {
          receiveCnt++;
          if (receiveCnt === 3) {
            resolve();
          }
        });
        instance._one("myEvent", () => {
          instance._trigger("received");
        });
        instance._on("myEvent", () => {
          instance._trigger("received");
        });

        instance._trigger("myEvent");
        instance._trigger("myEvent");
        instance._trigger("myEvent");
      }))
      .then(done);
    });
  });

  describe("_off()", () => {
    it("'instance._on() then ._off()' should receive only one time 'hello_changed' event.", (done) => {
      (new Promise((resolve, reject) => {
        const instance: BaseClass = new BaseClass();
        let count: number = 0;
        const listener = () => {
          count++;
          instance._off("hello_changed", listener);
        };
        instance._on("hello_changed", listener);


        for (let i: number = 0; i < 10; i++) {
          instance._set("hello", i);
        }
        setTimeout(() => {
          resolve(count);
        }, 3);
      }))
      .then((answer: number) => {
        expect(answer).toBe(1);
        done();
      });
    });

    it("'instance._off()' should remove all event listeners.", (done) => {
      (new Promise((resolve, reject) => {
        const instance: BaseClass = new BaseClass();
        let called: boolean = false;
        const dummyListener = () => {
          called = true;
        };

        instance._on("myEvent", dummyListener);
        instance._on("myEvent", dummyListener);
        instance._on("myEvent", dummyListener);
        instance._on("myEvent", dummyListener);
        instance._off("myEvent");
        instance._trigger("myEvent");

        setTimeout(() => {
          resolve(called);
        }, 3);

      }))
      .then((answer: boolean) => {
        expect(answer).toBe(false);
        done();
      });
    });
  });

  describe("_trigger()", () => {
    it("'instance._trigger()' should fire a 'myEvent' event.", (done) => {
      (new Promise((resolve, reject) => {
        const instance: BaseClass = new BaseClass();
        const timer: any = setTimeout(reject, 10); // just in case

        instance._on("myEvent", (...parameters: any[]) => {
          clearTimeout(timer);
          resolve(parameters);
        });

        instance._trigger("myEvent", "data", 1);
      }))
      .then((receivedData: any[]) => {
        expect(receivedData[0]).toBe("data");
        expect(receivedData[1]).toBe(1);
        done();
      });
    });
  });

  describe("_delete()", () => {
    it("'instance._set(), _delete(), then _get()' should be undefined.", () => {
      const instance: BaseClass = new BaseClass();
      instance._set("hello", "BaseClass");
      instance._delete("hello");
      expect(instance._get("hello")).toBe(undefined);
    });
  });

  describe("_empty()", () => {
    it("'instance._empty()' should delete all holded variables.", () => {
      const instance: BaseClass = new BaseClass();
      instance._set("hello1", "world");
      instance._set("hello2", "test");
      instance._empty();
      expect(instance._get("hello1")).toBe(undefined);
      expect(instance._get("hello2")).toBe(undefined);
    });
  });

});
