"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseArrayClass_1 = require("../BaseArrayClass");
describe("[BaseArrayClass]", function () {
    describe("_getLength()", function () {
        it("should return the same size with initial array", function () {
            var initArray = [0, 1, 2];
            var _ = new BaseArrayClass_1.BaseArrayClass(initArray);
            expect(_._getLength()).toBe(initArray.length);
        });
    });
    describe("_mapSeries()", function () {
        it("should keep item order", function () {
            var initArray = ["mapSeriesA", "B", "C"];
            var _ = new BaseArrayClass_1.BaseArrayClass(initArray);
            expect(_._mapSeries(function (item, idx, next) {
                setTimeout(function () {
                    next(item);
                }, 3 * Math.random());
            })).resolves.toEqual(initArray);
        });
    });
    describe("_mapAsync()", function () {
        it("should keep item order", function () {
            var initArray = ["mapAsyncA", "B", "C"];
            var _ = new BaseArrayClass_1.BaseArrayClass(initArray);
            expect(_._mapAsync(function (item, idx, next) {
                setTimeout(function () {
                    next(item);
                }, 3 * Math.random());
            })).resolves.toEqual(initArray);
        });
    });
    describe("_map()", function () {
        it("should work as `Array.map()`", function () {
            var initArray = ["mapA", "B", "C"];
            var _ = new BaseArrayClass_1.BaseArrayClass(initArray);
            expect(_._map(function (item) {
                return item;
            })).toEqual(initArray);
        });
    });
    describe("_forEachAsync()", function () {
        it("should execute `iteratee` 3 times", function (done) {
            var initArray = ["forEachAsyncA", "B", "C"];
            var _ = new BaseArrayClass_1.BaseArrayClass(initArray);
            var i = 0;
            _._forEachAsync(function (item, idx, next) {
                setTimeout(function () {
                    i++;
                    next(item);
                }, 10 * Math.random());
            }).then(function () {
                expect(i).toBe(3);
                done();
            });
        });
    });
    describe("_forEach()", function () {
        it("should work as `Array.forEach()`", function () {
            var i = 0;
            var initArray = ["A", "B", "C"];
            var _ = new BaseArrayClass_1.BaseArrayClass(initArray);
            _._forEach(function (item) {
                i++;
            });
            expect(i).toBe(3);
        });
    });
    describe("_filterAsync()", function () {
        it("should return [0, 2, 4]", function (done) {
            var initArray = [0, 1, 2, 3, 4, 5];
            var _ = new BaseArrayClass_1.BaseArrayClass(initArray);
            _._filterAsync(function (item, idx, next) {
                setTimeout(function () {
                    next(item % 2 === 0);
                }, 3 * Math.random());
            }).then(function (results) {
                expect(results).toEqual([0, 2, 4]);
                done();
            });
        });
    });
    describe("_filter()", function () {
        it("should work as `Array.filter()` if callback is omitted", function () {
            var initArray = [
                { condition: true },
                { condition: false },
                { condition: true },
            ];
            var _ = new BaseArrayClass_1.BaseArrayClass(initArray);
            expect(_._filter(function (item) {
                return item.condition === true;
            })).toHaveLength(2);
        });
    });
    describe("_indexOf()", function () {
        it("should find the first element position", function () {
            var initArray = ["Hello", "World", "test"];
            var _ = new BaseArrayClass_1.BaseArrayClass(initArray);
            expect(_._indexOf("World")).toBe(1);
        });
        it("should find the second element position", function () {
            var initArray = ["Hello", "World", "test", "World"];
            var _ = new BaseArrayClass_1.BaseArrayClass(initArray);
            expect(_._indexOf("World", 2)).toBe(3);
        });
    });
    describe("_empty()", function () {
        it("should delete all elements", function () {
            var initArray = ["Hello", "World", "test"];
            var _ = new BaseArrayClass_1.BaseArrayClass(initArray);
            _._empty();
            expect(_._getLength()).toBe(0);
        });
    });
    describe("_push()", function () {
        it("should add the item to the last", function () {
            var initArray = ["Hello", "World", "test"];
            var _ = new BaseArrayClass_1.BaseArrayClass(initArray);
            _._push("HelloWorld");
            expect(_._getAt(3)).toEqual("HelloWorld");
        });
    });
    describe("_insertAt()", function () {
        it("should add the item at the specified position", function () {
            var initArray = ["Hello", "World", "test"];
            var _ = new BaseArrayClass_1.BaseArrayClass(initArray);
            _._insertAt(1, "Aloha");
            expect(_._getArray()).toEqual(["Hello", "Aloha", "World", "test"]);
        });
    });
    describe("_getArray()", function () {
        it("should return the same array", function () {
            var initArray = ["Hello", "World", "test"];
            var _ = new BaseArrayClass_1.BaseArrayClass(initArray);
            expect(_._getArray()).toEqual(["Hello", "World", "test"]);
        });
    });
    describe("_getAt()", function () {
        it("should return the same item at specified position", function () {
            var initArray = ["Hello", "World", "test"];
            var _ = new BaseArrayClass_1.BaseArrayClass(initArray);
            expect(_._getAt(1)).toEqual("World");
        });
    });
    describe("_setAt()", function () {
        it("should replace the item of specified position", function () {
            var initArray = ["Hello", "World", "test"];
            var _ = new BaseArrayClass_1.BaseArrayClass(initArray);
            _._setAt(0, "Aloha");
            expect(_._getAt(0)).toEqual("Aloha");
        });
    });
    describe("_removeAt()", function () {
        it("should remove the item of specified position", function () {
            var initArray = ["Hello", "World", "test"];
            var _ = new BaseArrayClass_1.BaseArrayClass(initArray);
            _._removeAt(1);
            expect(_._getAt(1)).toEqual("test");
            expect(_._getLength()).toBe(2);
        });
    });
    describe("_pop()", function () {
        it("should return the same item of the last item", function () {
            var initArray = ["Hello", "World", "test"];
            var _ = new BaseArrayClass_1.BaseArrayClass(initArray);
            expect(_._pop()).toEqual("test");
            expect(_._getLength()).toBe(2);
        });
    });
    describe("_reverse()", function () {
        it("should reverse the array", function () {
            var initArray = ["Hello", "World", "test"];
            var _ = new BaseArrayClass_1.BaseArrayClass(initArray);
            _._reverse();
            expect(_._getArray()).toEqual(["test", "World", "Hello"]);
        });
    });
    describe("_sort()", function () {
        it("should return ['A', 'B', 'C', 'a', 'b', 'c']", function () {
            var initArray = ["c", "C", "A", "B", "b", "a"];
            var _ = new BaseArrayClass_1.BaseArrayClass(initArray);
            _._sort();
            expect(_._getArray()).toEqual(["A", "B", "C", "a", "b", "c"]);
        });
        it("should return ['a', 'A', 'b', 'B', 'c', 'C']", function () {
            var initArray = ["c", "C", "A", "B", "b", "a"];
            var _ = new BaseArrayClass_1.BaseArrayClass(initArray);
            _._sort(function (a, b) {
                var charCodeA = a.charCodeAt(0);
                var charCodeB = b.charCodeAt(0);
                var lowerA = charCodeA > 96 ? charCodeA - 32 : charCodeA;
                var lowerB = charCodeB > 96 ? charCodeB - 32 : charCodeB;
                return lowerA === lowerB ? charCodeB - charCodeA : lowerA - lowerB;
            });
            expect(_._getArray()).toEqual(["a", "A", "b", "B", "c", "C"]);
        });
    });
});
