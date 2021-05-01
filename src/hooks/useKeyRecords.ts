import * as React from 'react';
import { useRef, useCallback } from 'react';
import warning from 'rc-util/lib/warning';
import { nextSlice } from '../utils/timeUtil';

const PATH_SPLIT = '__RC_UTIL_PATH_SPLIT__';

const getPathStr = (keyPath: string[]) => keyPath.join(PATH_SPLIT);
const getPathKeys = (keyPathStr: string) => keyPathStr.split(PATH_SPLIT);

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
        `Duplicated key '${key}' used in Menu by path [${keyPath.join(' > ')}]`,
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

  const isSubPathKey = useCallback(
    (pathKeys: string[], eventKey: string) =>
      pathKeys.some(pathKey => {
        const fullPath = key2pathRef.current.get(pathKey) || '';
        const pathKeyList = getPathKeys(fullPath);

        return pathKeyList.includes(eventKey);
      }),
    [],
  );

  const getKeyPath = useCallback((eventKey: string) => {
    const fullPath = key2pathRef.current.get(eventKey) || '';
    return getPathKeys(fullPath);
  }, []);

  const getKeys = () => [...key2pathRef.current.keys()];

  /**
   * Find current key related child path keys
   */
  const getSubPathKeys = useCallback((key: string): Set<string> => {
    const connectedPath = `${key2pathRef.current.get(key)}${PATH_SPLIT}`;
    const pathKeys = new Set<string>();

    [...path2keyRef.current.keys()].forEach(pathKey => {
      if (pathKey.startsWith(connectedPath)) {
        pathKeys.add(path2keyRef.current.get(pathKey));
      }
    });
    return pathKeys;
  }, []);

  return {
    // Register
    registerPath,
    unregisterPath,

    // Util
    isSubPathKey,
    getKeyPath,
    getKeys,
    getSubPathKeys,
  };
}
