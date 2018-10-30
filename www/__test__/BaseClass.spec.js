"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var es6_promise_1 = require("es6-promise");
var BaseClass_1 = require("../BaseClass");
describe("BaseClass test", function () {
    describe("_set()", function () {
        it("'instance.hello' should be 'world'", function () {
            var instance = new BaseClass_1.BaseClass();
            instance._set("hello", "world");
            expect(instance._get("hello")).toEqual("world");
        });
    });
    describe("_bindTo()", function () {
        it("'instanceB.anotherHello' should be the same as 'instanceA.hello'", function () {
            var instanceA = new BaseClass_1.BaseClass();
            var instanceB = new BaseClass_1.BaseClass();
            instanceA._bindTo("hello", instanceB, "anotherHello");
            instanceA._set("hello", "world");
            expect(instanceA._get("hello")).toEqual("world");
            expect(instanceB._get("anotherHello")).toEqual("world");
        });
    });
    describe("_one()", function () {
        it("'instance._one()' should receive 'hello_changed' event.", function (done) {
            var instance = new BaseClass_1.BaseClass();
            instance._set("hello", "world");
            instance._one("hello_changed", function (prevValue, newValue) {
                expect(prevValue).toEqual("world");
                expect(newValue).toEqual("Aloha");
                done();
            });
            instance._set("hello", "Aloha");
        });
    });
    describe("_on()", function () {
        it("'instance._on()' should receive 'hello_changed' event twice.", function (done) {
            (new es6_promise_1.Promise(function (resolve, reject) {
                var instance = new BaseClass_1.BaseClass();
                var timer = setTimeout(reject, 10); // just in case
                var count = 0;
                var listener = function (prevValue, newValue) {
                    count++;
                    if (count === 2) {
                        instance._off("hello_changed", listener);
                        clearTimeout(timer);
                        resolve(newValue);
                    }
                };
                instance._on("hello_changed", listener);
                instance._set("hello", "你好"); // should receive
                instance._set("hello", "こんにちは"); // should receive
                instance._set("hello", "안녕하세요"); // should not receive
            }))
                .then(function (answer) {
                expect(answer).toBe("こんにちは");
                done();
            });
        });
        it("'instance._on(one, two, three)' should receive `1, 2, 3`.", function (done) {
            (new es6_promise_1.Promise(function (resolve, reject) {
                var instance = new BaseClass_1.BaseClass();
                var timer = setTimeout(reject, 10); // just in case
                instance._on("myEvent", function (one, two, three) {
                    expect(one).toBe(1);
                    expect(two).toBe(2);
                    expect(three).toBe(3);
                    resolve();
                });
                instance._trigger("myEvent", 1, 2, 3);
            }))
                .then(done);
        });
    });
    describe("_off()", function () {
        it("'instance._on() then ._off()' should receive only one time 'hello_changed' event.", function (done) {
            (new es6_promise_1.Promise(function (resolve, reject) {
                var instance = new BaseClass_1.BaseClass();
                var count = 0;
                var listener = function () {
                    count++;
                    instance._off("hello_changed", listener);
                };
                instance._on("hello_changed", listener);
                for (var i = 0; i < 10; i++) {
                    instance._set("hello", i);
                }
                setTimeout(function () {
                    resolve(count);
                }, 3);
            }))
                .then(function (answer) {
                expect(answer).toBe(1);
                done();
            });
        });
        it("'instance._off()' should remove all event listeners.", function (done) {
            (new es6_promise_1.Promise(function (resolve, reject) {
                var instance = new BaseClass_1.BaseClass();
                var called = false;
                var dummyListener = function () {
                    called = true;
                };
                instance._on("myEvent", dummyListener);
                instance._on("myEvent", dummyListener);
                instance._on("myEvent", dummyListener);
                instance._on("myEvent", dummyListener);
                instance._off("myEvent");
                instance._trigger("myEvent");
                setTimeout(function () {
                    resolve(called);
                }, 3);
            }))
                .then(function (answer) {
                expect(answer).toBe(false);
                done();
            });
        });
    });
    describe("_trigger()", function () {
        it("'instance._trigger()' should fire a 'myEvent' event.", function (done) {
            (new es6_promise_1.Promise(function (resolve, reject) {
                var instance = new BaseClass_1.BaseClass();
                var timer = setTimeout(reject, 10); // just in case
                instance._on("myEvent", function () {
                    var parameters = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        parameters[_i] = arguments[_i];
                    }
                    clearTimeout(timer);
                    resolve(parameters);
                });
                instance._trigger("myEvent", "data", 1);
            }))
                .then(function (receivedData) {
                expect(receivedData[0]).toBe("data");
                expect(receivedData[1]).toBe(1);
                done();
            });
        });
    });
    describe("_delete()", function () {
        it("'instance._set(), _delete(), then _get()' should be undefined.", function () {
            var instance = new BaseClass_1.BaseClass();
            instance._set("hello", "BaseClass");
            instance._delete("hello");
            expect(instance._get("hello")).toBe(undefined);
        });
    });
    describe("_empty()", function () {
        it("'instance._empty()' should delete all holded variables.", function () {
            var instance = new BaseClass_1.BaseClass();
            instance._set("hello1", "world");
            instance._set("hello2", "test");
            instance._empty();
            expect(instance._get("hello1")).toBe(undefined);
            expect(instance._get("hello2")).toBe(undefined);
        });
    });
});
