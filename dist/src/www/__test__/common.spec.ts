import * as path from "path";
import * as common from "../common";

describe("www/common", () => {
  const mockDirPath: string =  path.join(__dirname, "common.mock")
  beforeAll(async () => {
    await Promise.all([
      page.coverage.startJSCoverage()
    ]);
    await page.goto("file://" + path.join(mockDirPath, "index.html"), {waitUntil: "networkidle2"});
  });

  describe("isInitialized", () => {
    it("should display 'Hello World' text on page", async () => {
      await expect(page).toMatch("Hello World");
    });
  });

  describe("loadJsPromise", () => {
    it("should load 'dummy.js' file correctly", async () => {
      const result: string = await page.evaluate(() => {
        return exports.loadJsPromise({
          url: "dummy.js",
          package: "firebase.dummy"
        })
        .then(() => {
          return (window as any).firebase.dummy.hello;
        });
      });
      expect(result).toBe("world");

      const [jsCoverage] = await Promise.all([
        page.coverage.stopJSCoverage(),
      ]);
      let totalBytes = 0;
      let usedBytes = 0;
      const coverage = [...jsCoverage];
      for (const entry of coverage) {
        totalBytes += entry.text.length;
        for (const range of entry.ranges)
          usedBytes += range.end - range.start - 1;
      }
      console.log(`Bytes used: ${usedBytes / totalBytes * 100}%`);
    });
  });

});
