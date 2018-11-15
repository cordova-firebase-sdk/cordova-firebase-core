export let isInitialized = jest.fn(() => {
  console.log("--->here!");
  return false;
});
export let loadJsPromise = jest.fn();
