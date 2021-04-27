import * as React from 'react';
import { useRef } from 'react';
import { nextSlice } from '../utils/timeUtil';

const PATH_SPLIT = '__RC_UTIL_PATH_SPLIT__';

const getPathStr = (keyPath: string[]) => keyPath.join(PATH_SPLIT);

function usePathData() {
  const [, forceUpdate] = React.useState({});
  const path2keyRef = useRef(new Map<string, string>());
  const key2pathRef = useRef(new Map<string, string>());
  const elementsRef = useRef(new Set<HTMLElement>());
  const element2keyRef = useRef(new Map<HTMLElement, string>());

  const updateRef = useRef(0);

  function registerPath(key: string, keyPath: string[], element: HTMLElement) {
    const connectedPath = getPathStr(keyPath);
    path2keyRef.current.set(connectedPath, key);
    key2pathRef.current.set(key, connectedPath);
    elementsRef.current.add(element);
    element2keyRef.current.set(element, key);

    updateRef.current += 1;
    const id = updateRef.current;

    nextSlice(() => {
      if (id === updateRef.current) {
        forceUpdate({});
      }
    });
  }

  function unregisterPath(
    key: string,
    keyPath: string[],
    element: HTMLElement,
  ) {
    const connectedPath = getPathStr(keyPath);
    path2keyRef.current.delete(connectedPath);
    key2pathRef.current.delete(key);
    elementsRef.current.delete(element);
    element2keyRef.current.delete(element);
  }

  function keyInPath(keyList: string[], keyPath: string[]) {
    /**
     * Generate `path1__SPLIT__path2__SPLIT__` instead of `path1__SPLIT__path2`.
     * To avoid full path like `path1__SPLIT__path23__SPLIT__path3` matching.
     */
    const connectedPath = getPathStr([...keyPath, '']);

    return keyList.some(key => {
      const fullPath = key2pathRef.current.get(key) || '';
      return fullPath.startsWith(connectedPath);
    });
  }

  function getKeyByElement(element: HTMLElement) {
    return element2keyRef.current.get(element);
  }

  React.useEffect(
    () => () => {
      updateRef.current = null;
    },
    [],
  );

  return {
    registerPath,
    unregisterPath,
    keyInPath,
    elementsRef,
    getKeyByElement,
  };
}

export type PathHookRet = ReturnType<typeof usePathData>;

export default usePathData;
