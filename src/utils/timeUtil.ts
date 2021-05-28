export function nextSlice(callback: () => void) {
  /* istanbul ignore next */
  Promise.resolve().then(callback);
}
