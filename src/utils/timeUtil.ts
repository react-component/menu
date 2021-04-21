import { act } from 'react-dom/test-utils';

export function nextSlice(callback: () => void) {
  if (process.env.NODE_ENV === 'test') {
    Promise.resolve().then(() => {
      act(() => {
        callback();
      });
    });
  } else {
    /* istanbul ignore next */
    Promise.resolve().then(callback);
  }
}
