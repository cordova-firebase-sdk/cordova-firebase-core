"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exec = jest.fn(function (onSuccess, onError, pluginName, methodName, args) {
    // Insert tiny delay
    setTimeout(function () {
        onSuccess(args);
    }, 5);
    return {
        args: args,
        methodName: methodName,
        pluginName: pluginName,
    };
});
