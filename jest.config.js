module.exports = {
  roots: [
    "<rootDir>/src/ts"
  ],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
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
  moduleNameMapper: {
    "^cordova/(.*)$": "<rootDir>/node_modules/cordova-js/src/common/$1"
  },
  globals: {
    cordova: {},
  },
};
