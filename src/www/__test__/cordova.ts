export const exec = (onSuccess, onError, pluginName, methodName, args) => {
  // Insert tiny delay
  setTimeout(() => {
    onSuccess(args);
  }, 5);
};
