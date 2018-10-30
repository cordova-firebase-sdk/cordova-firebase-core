"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseArrayClass_1 = require("../BaseArrayClass");
describe("[BaseArrayClass]", () => {
    describe("_getLength()", () => {
        it("should return the same size with initial array", () => {
            const initArray = [0, 1, 2];
            const _ = new BaseArrayClass_1.BaseArrayClass(initArray);
            expect(_._getLength()).toBe(initArray.length);
        });
    });
    describe("_mapSeries()", () => {
        it("should keep item order", () => {
            const initArray = ["mapSeriesA", "B", "C"];
            const _ = new BaseArrayClass_1.BaseArrayClass(initArray);
            expect(_._mapSeries((item, idx, next) => {
                setTimeout(() => {
                    next(item);
                }, 3 * Math.random());
            })).resolves.toEqual(initArray);
        });
    });
    describe("_mapAsync()", () => {
        it("should keep item order", () => {
            const initArray = ["mapAsyncA", "B", "C"];
            const _ = new BaseArrayClass_1.BaseArrayClass(initArray);
            expect(_._mapAsync((item, idx, next) => {
                setTimeout(() => {
                    next(item);
                }, 3 * Math.random());
            })).resolves.toEqual(initArray);
        });
    });
    describe("_map()", () => {
        it("should work as `Array.map()`", () => {
            const initArray = ["mapA", "B", "C"];
            const _ = new BaseArrayClass_1.BaseArrayClass(initArray);
            expect(_._map((item) => {
                return item;
            })).toEqual(initArray);
        });
    });
    describe("_forEachAsync()", () => {
        it("should execute `iteratee` 3 times", (done) => {
            const initArray = ["forEachAsyncA", "B", "C"];
            const _ = new BaseArrayClass_1.BaseArrayClass(initArray);
            let i = 0;
            _._forEachAsync((item, idx, next) => {
                setTimeout(() => {
                    i++;
                    next(item);
                }, 10 * Math.random());
            }).then(() => {
                expect(i).toBe(3);
                done();
            });
        });
    });
    describe("_forEach()", () => {
        it("should work as `Array.forEach()`", () => {
            let i = 0;
            const initArray = ["A", "B", "C"];
            const _ = new BaseArrayClass_1.BaseArrayClass(initArray);
            _._forEach((item) => {
                i++;
            });
            expect(i).toBe(3);
        });
    });
    describe("_filterAsync()", () => {
        it("should return [0, 2, 4]", (done) => {
            const initArray = [0, 1, 2, 3, 4, 5];
            const _ = new BaseArrayClass_1.BaseArrayClass(initArray);
            _._filterAsync((item, idx, next) => {
                setTimeout(() => {
                    next(item % 2 === 0);
                }, 3 * Math.random());
            }).then((results) => {
                expect(results).toEqual([0, 2, 4]);
                done();
            });
        });
    });
    describe("_filter()", () => {
        it("should work as `Array.filter()` if callback is omitted", () => {
            const initArray = [
                { condition: true },
                { condition: false },
                { condition: true },
            ];
            const _ = new BaseArrayClass_1.BaseArrayClass(initArray);
            expect(_._filter((item) => {
                return item.condition === true;
            })).toHaveLength(2);
        });
    });
    describe("_indexOf()", () => {
        it("should find the first element position", () => {
            const initArray = ["Hello", "World", "test"];
            const _ = new BaseArrayClass_1.BaseArrayClass(initArray);
            expect(_._indexOf("World")).toBe(1);
        });
        it("should find the second element position", () => {
            const initArray = ["Hello", "World", "test", "World"];
            const _ = new BaseArrayClass_1.BaseArrayClass(initArray);
            expect(_._indexOf("World", 2)).toBe(3);
        });
    });
    describe("_empty()", () => {
        it("should delete all elements", () => {
            const initArray = ["Hello", "World", "test"];
            const _ = new BaseArrayClass_1.BaseArrayClass(initArray);
            _._empty();
            expect(_._getLength()).toBe(0);
        });
    });
    describe("_push()", () => {
        it("should add the item to the last", () => {
            const initArray = ["Hello", "World", "test"];
            const _ = new BaseArrayClass_1.BaseArrayClass(initArray);
            _._push("HelloWorld");
            expect(_._getAt(3)).toEqual("HelloWorld");
        });
    });
    describe("_insertAt()", () => {
        it("should add the item at the specified position", () => {
            const initArray = ["Hello", "World", "test"];
            const _ = new BaseArrayClass_1.BaseArrayClass(initArray);
            _._insertAt(1, "Aloha");
            expect(_._getArray()).toEqual(["Hello", "Aloha", "World", "test"]);
        });
    });
    describe("_getArray()", () => {
        it("should return the same array", () => {
            const initArray = ["Hello", "World", "test"];
            const _ = new BaseArrayClass_1.BaseArrayClass(initArray);
            expect(_._getArray()).toEqual(["Hello", "World", "test"]);
        });
    });
    describe("_getAt()", () => {
        it("should return the same item at specified position", () => {
            const initArray = ["Hello", "World", "test"];
            const _ = new BaseArrayClass_1.BaseArrayClass(initArray);
            expect(_._getAt(1)).toEqual("World");
        });
    });
    describe("_setAt()", () => {
        it("should replace the item of specified position", () => {
            const initArray = ["Hello", "World", "test"];
            const _ = new BaseArrayClass_1.BaseArrayClass(initArray);
            _._setAt(0, "Aloha");
            expect(_._getAt(0)).toEqual("Aloha");
        });
    });
    describe("_removeAt()", () => {
        it("should remove the item of specified position", () => {
            const initArray = ["Hello", "World", "test"];
            const _ = new BaseArrayClass_1.BaseArrayClass(initArray);
            _._removeAt(1);
            expect(_._getAt(1)).toEqual("test");
            expect(_._getLength()).toBe(2);
        });
    });
    describe("_pop()", () => {
        it("should return the same item of the last item", () => {
            const initArray = ["Hello", "World", "test"];
            const _ = new BaseArrayClass_1.BaseArrayClass(initArray);
            expect(_._pop()).toEqual("test");
            expect(_._getLength()).toBe(2);
        });
    });
    describe("_reverse()", () => {
        it("should reverse the array", () => {
            const initArray = ["Hello", "World", "test"];
            const _ = new BaseArrayClass_1.BaseArrayClass(initArray);
            _._reverse();
            expect(_._getArray()).toEqual(["test", "World", "Hello"]);
        });
    });
    describe("_sort()", () => {
        it("should return ['A', 'B', 'C', 'a', 'b', 'c']", () => {
            const initArray = ["c", "C", "A", "B", "b", "a"];
            const _ = new BaseArrayClass_1.BaseArrayClass(initArray);
            _._sort();
            expect(_._getArray()).toEqual(["A", "B", "C", "a", "b", "c"]);
        });
        it("should return ['a', 'A', 'b', 'B', 'c', 'C']", () => {
            const initArray = ["c", "C", "A", "B", "b", "a"];
            const _ = new BaseArrayClass_1.BaseArrayClass(initArray);
            _._sort((a, b) => {
                const charCodeA = a.charCodeAt(0);
                const charCodeB = b.charCodeAt(0);
                const lowerA = charCodeA > 96 ? charCodeA - 32 : charCodeA;
                const lowerB = charCodeB > 96 ? charCodeB - 32 : charCodeB;
                return lowerA === lowerB ? charCodeB - charCodeA : lowerA - lowerB;
            });
            expect(_._getArray()).toEqual(["a", "A", "b", "B", "c", "C"]);
        });
    });
});
