module.exports = {
  roots: [
    "<rootDir>/src/"
  ],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node"
  ],
  globals: {
    firebase: {},
    window: {
      cordova: {
        define: {
          moduleMap: {}
        },
        platformId: "browser",
        version: "8.0.0"
      }
    },
  },
  coveragePathIgnorePatterns: [
    "src/www/common.ts"
  ],
  moduleNameMapper: {
    "common$": "<rootDir>/src/www/__mocks__/common"
  },
  preset: "jest-puppeteer"
};
