export const exec = jest.fn((onSuccess, onError, pluginName, methodName, args) => {
  // Insert tiny delay
  console.log("--->hello");
  setTimeout(() => {
    onSuccess(args);
  }, 5);
  return {
    args,
    methodName,
    pluginName,
  };
});
