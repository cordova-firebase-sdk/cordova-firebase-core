module.exports = {
  roots: [
    "<rootDir>/src/ts"
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
    cordova: {},
  },
  moduleNameMapper: {
    "^cordova": "<rootDir>/src/ts/__test__/cordova/"
  }
};
