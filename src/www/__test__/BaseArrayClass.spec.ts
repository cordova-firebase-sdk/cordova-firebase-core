import { BaseArrayClass } from "../BaseArrayClass";

describe("[BaseArrayClass]", () => {

  describe("_getLength()", () => {
    it("should return the same size with initial array", () => {
      const initArray: number[] = [0, 1, 2];
      const _: BaseArrayClass = new BaseArrayClass(initArray);
      expect(_._getLength()).toBe(initArray.length);
    });
  });

  describe("_mapSeries()", () => {
    it("should keep item order", () => {
      const initArray: string[] = ["mapSeriesA", "B", "C"];
      const _: BaseArrayClass = new BaseArrayClass(initArray);
      expect(_._mapSeries((item: string, idx: number, next: (result: string) => void) => {
        setTimeout(() => {
          next(item);
        }, 3 * Math.random());
      })).resolves.toEqual(initArray);
    });
    it("should return empty array if no item", () => {
      const _: BaseArrayClass = new BaseArrayClass();
      expect(_._mapSeries((item: string, idx: number, next: (result: string) => void) => {
        setTimeout(() => {
          next(item);
        }, 3 * Math.random());
      })).resolves.toHaveLength(0);
    });
  });


  describe("_mapAsync()", () => {
    it("should keep item order", () => {
      const initArray: string[] = ["mapAsyncA", "B", "C"];
      const _: BaseArrayClass = new BaseArrayClass(initArray);
      expect(_._mapAsync((item: string, idx: number, next: (result: string) => void) => {
        setTimeout(() => {
          next(item);
        }, 3 * Math.random());
      })).resolves.toEqual(initArray);
    });
    it("should return empty array if no item", () => {
      const _: BaseArrayClass = new BaseArrayClass();
      expect(_._mapAsync((item: string, idx: number, next: (result: string) => void) => {
        setTimeout(() => {
          next(item);
        }, 3 * Math.random());
      })).resolves.toHaveLength(0);
    });
  });

  describe("_map()", () => {
    it("should work as `Array.map()`", () => {
      const initArray: string[] = ["mapA", "B", "C"];
      const _: BaseArrayClass = new BaseArrayClass(initArray);
      expect(_._map((item: string): string => {
        return item;
      })).toEqual(initArray);
    });
  });


  describe("_forEachAsync()", () => {
    it("should execute `iteratee` 3 times", (done) => {
      const initArray: string[] = ["forEachAsyncA", "B", "C"];
      const _: BaseArrayClass = new BaseArrayClass(initArray);
      let i: number = 0;
      _._forEachAsync((item: string, idx: number, next: (result: string) => void) => {
        setTimeout(() => {
          i++;
          next(item);
        }, 10 * Math.random());
      }).then(() => {
        expect(i).toBe(3);
        done();
      });
    });
    it("should execute `iteratee` 0 times", (done) => {
      const _: BaseArrayClass = new BaseArrayClass();
      let i: number = 0;
      _._forEachAsync((item: string, idx: number, next: (result: string) => void) => {
        setTimeout(() => {
          i++;
          next(item);
        }, 10 * Math.random());
      }).then(() => {
        expect(i).toBe(0);
        done();
      });
    });
  });

  describe("_forEach()", () => {
    it("should work as `Array.forEach()`", () => {
      let i: number = 0;
      const initArray: string[] = ["A", "B", "C"];
      const _: BaseArrayClass = new BaseArrayClass(initArray);
      _._forEach((item) => {
        i++;
      });
      expect(i).toBe(3);
    });
  });

  describe("_filterAsync()", () => {
    it("should return [0, 2, 4]", (done) => {
      const initArray: number[] = [0, 1, 2, 3, 4, 5];
      const _: BaseArrayClass = new BaseArrayClass(initArray);
      _._filterAsync((item: number, idx: number, next: (result: boolean) => void) => {
        setTimeout(() => {
          next(item % 2 === 0);
        }, 3 * Math.random());
      }).then((results: number[]) => {
        expect(results).toEqual([0, 2, 4]);
        done();
      });
    });
    it("should return empty array if no item", (done) => {
      const _: BaseArrayClass = new BaseArrayClass();
      _._filterAsync((item: number, idx: number, next: (result: boolean) => void) => {
        setTimeout(() => {
          next(item % 2 === 0);
        }, 3 * Math.random());
      }).then((results: number[]) => {
        expect(results).toHaveLength(0);
        done();
      });
    });
  });

  describe("_filter()", () => {
    it("should work as `Array.filter()` if callback is omitted", () => {
      const initArray: Array<{condition: boolean}> = [
        {condition: true},
        {condition: false},
        {condition: true},
      ];
      const _: BaseArrayClass = new BaseArrayClass(initArray);
      expect(_._filter((item: {condition: boolean}): boolean => {
        return item.condition === true;
      })).toHaveLength(2);
    });
    it("should return empty array if no item", () => {
      const _: BaseArrayClass = new BaseArrayClass();
      expect(_._filter((item: {condition: boolean}): boolean => {
        return item.condition === true;
      })).toHaveLength(0);
    });
  });

  describe("_indexOf()", () => {
    it("should find the first element position", () => {
      const initArray: string[] = ["Hello", "World", "test"];
      const _: BaseArrayClass = new BaseArrayClass(initArray);
      expect(_._indexOf("World")).toBe(1);
    });

    it("should find the second element position", () => {
      const initArray: string[] = ["Hello", "World", "test", "World"];
      const _: BaseArrayClass = new BaseArrayClass(initArray);
      expect(_._indexOf("World", 2)).toBe(3);
    });
  });

  describe("_empty()", () => {
    it("should delete all elements", () => {
      const initArray: string[] = ["Hello", "World", "test"];
      const _: BaseArrayClass = new BaseArrayClass(initArray);
      _._empty();
      expect(_._getLength()).toBe(0);
    });

  });

  describe("_push()", () => {
    it("should add the item to the last", () => {
      const initArray: string[] = ["Hello", "World", "test"];
      const _: BaseArrayClass = new BaseArrayClass(initArray);
      _._push("HelloWorld");
      expect(_._getAt(3)).toEqual("HelloWorld");
    });
  });

  describe("_insertAt()", () => {
    it("should add the item at the specified position", () => {
      const initArray: string[] = ["Hello", "World", "test"];
      const _: BaseArrayClass = new BaseArrayClass(initArray);
      _._insertAt(1, "Aloha");
      expect(_._getArray()).toEqual(["Hello", "Aloha", "World", "test"]);
    });
  });


  describe("_getArray()", () => {
    it("should return the same array", () => {
      const initArray: string[] = ["Hello", "World", "test"];
      const _: BaseArrayClass = new BaseArrayClass(initArray);
      expect(_._getArray()).toEqual(["Hello", "World", "test"]);
    });
  });

  describe("_getAt()", () => {
    it("should return the same item at specified position", () => {
      const initArray: string[] = ["Hello", "World", "test"];
      const _: BaseArrayClass = new BaseArrayClass(initArray);
      expect(_._getAt(1)).toEqual("World");
    });
  });

  describe("_setAt()", () => {
    it("should replace the item of specified position", () => {
      const initArray: string[] = ["Hello", "World", "test"];
      const _: BaseArrayClass = new BaseArrayClass(initArray);
      _._setAt(0, "Aloha");
      expect(_._getAt(0)).toEqual("Aloha");
    });
  });

  describe("_removeAt()", () => {
    it("should remove the item of specified position", () => {
      const initArray: string[] = ["Hello", "World", "test"];
      const _: BaseArrayClass = new BaseArrayClass(initArray);
      _._removeAt(1);
      expect(_._getAt(1)).toEqual("test");
      expect(_._getLength()).toBe(2);
    });
  });

  describe("_pop()", () => {
    it("should return the same item of the last item", () => {
      const initArray: string[] = ["Hello", "World", "test"];
      const _: BaseArrayClass = new BaseArrayClass(initArray);
      expect(_._pop()).toEqual("test");
      expect(_._getLength()).toBe(2);
    });
  });


  describe("_reverse()", () => {
    it("should reverse the array", () => {
      const initArray: string[] = ["Hello", "World", "test"];
      const _: BaseArrayClass = new BaseArrayClass(initArray);
      _._reverse();
      expect(_._getArray()).toEqual(["test", "World", "Hello"]);
    });
  });

  describe("_sort()", () => {
    it("should return ['A', 'B', 'C', 'a', 'b', 'c']", () => {
      const initArray: string[] = ["c", "C", "A", "B", "b", "a"];
      const _: BaseArrayClass = new BaseArrayClass(initArray);
      _._sort();
      expect(_._getArray()).toEqual(["A", "B", "C", "a", "b", "c"]);
    });

    it("should return ['a', 'A', 'b', 'B', 'c', 'C']", () => {
      const initArray: string[] = ["c", "C", "A", "B", "b", "a"];
      const _: BaseArrayClass = new BaseArrayClass(initArray);
      _._sort((a: string, b: string) => {
        const charCodeA: number = a.charCodeAt(0);
        const charCodeB: number = b.charCodeAt(0);
        const lowerA: number = charCodeA > 96 ? charCodeA - 32 : charCodeA;
        const lowerB: number = charCodeB > 96 ? charCodeB - 32 : charCodeB;
        return lowerA === lowerB ? charCodeB - charCodeA : lowerA - lowerB;
      });
      expect(_._getArray()).toEqual(["a", "A", "b", "B", "c", "C"]);
    });
  });
});
