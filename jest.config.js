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
    cordova: {},
    firebase: {},
    window: {},
  },
  moduleNameMapper: {
    "^cordova": "<rootDir>/src/www/__test__/cordova/"
  }
};
