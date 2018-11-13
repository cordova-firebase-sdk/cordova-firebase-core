export const exec = jest.fn((onSuccess, onError, pluginName, methodName, args) => {
  // Insert tiny delay
  setTimeout(() => {
    onSuccess(args);
  }, 5);
  return {
    args,
    methodName,
    pluginName,
  };
});
