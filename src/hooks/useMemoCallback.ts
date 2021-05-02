import * as React from 'react';

/**
 * Cache callback function that always return same ref instead.
 * This is used for context optimization.
 */
export default function useMemoCallback<T extends (...args: any[]) => void>(
  func: T,
): T {
  const funRef = React.useRef(func);
  funRef.current = func;

  const callback = React.useCallback(
    ((...args: any[]) => funRef.current?.(...args)) as any,
    [],
  );

  return func ? callback : undefined;
}
