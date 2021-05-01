import * as React from 'react';
import { useRef, useCallback } from 'react';
import warning from 'rc-util/lib/warning';
import { nextSlice } from '../utils/timeUtil';

const PATH_SPLIT = '__RC_UTIL_PATH_SPLIT__';

const getPathStr = (keyPath: string[]) => keyPath.join(PATH_SPLIT);

export default function useKeyRecords() {
  const [, forceUpdate] = React.useState({});
  const key2pathRef = useRef(new Map<string, string>());
  const path2keyRef = useRef(new Map<string, string>());
  const updateRef = useRef(0);

  const registerPath = useCallback((key: string, keyPath: string[]) => {
    // Warning for invalidate or duplicated `key`
    if (process.env.NODE_ENV !== 'production') {
      warning(
        !key2pathRef.current.has(key),
        `Duplicated key '${key}' used in Menu.`,
      );
    }

    // Fill map
    const connectedPath = getPathStr(keyPath);
    path2keyRef.current.set(connectedPath, key);
    key2pathRef.current.set(key, connectedPath);

    updateRef.current += 1;
    const id = updateRef.current;

    nextSlice(() => {
      if (id === updateRef.current) {
        forceUpdate({});
      }
    });
  }, []);

  const unregisterPath = useCallback((key: string, keyPath: string[]) => {
    const connectedPath = getPathStr(keyPath);
    path2keyRef.current.delete(connectedPath);
    key2pathRef.current.delete(key);
  }, []);

  const keyInPath = useCallback((keyList: string[], keyPath: string[]) => {
    /**
     * Generate `path1__SPLIT__path2__SPLIT__` instead of `path1__SPLIT__path2`.
     * To avoid full path like `path1__SPLIT__path23__SPLIT__path3` matching.
     */
    const connectedPath = getPathStr([...keyPath, '']);

    return keyList.some(key => {
      const fullPath = key2pathRef.current.get(key) || '';
      return fullPath.startsWith(connectedPath);
    });
  }, []);

  return {
    keyInPath,
    registerPath,
    unregisterPath,
  };
}
