import * as React from 'react';
import { useRef, useCallback } from 'react';
import warning from '@rc-component/util/lib/warning';
import { nextSlice } from '../utils/timeUtil';

const PATH_SPLIT = '__RC_UTIL_PATH_SPLIT__';

const getPathStr = (keyPath: string[]) => keyPath.join(PATH_SPLIT);
const getPathKeys = (keyPathStr: string) => keyPathStr.split(PATH_SPLIT);

export const OVERFLOW_KEY = 'rc-menu-more';

export default function useKeyRecords() {
  const [, internalForceUpdate] = React.useState({});
  const key2pathRef = useRef(new Map<string, string>());
  const path2keyRef = useRef(new Map<string, string>());
  const [overflowKeys, setOverflowKeys] = React.useState([]);
  const updateRef = useRef(0);
  const destroyRef = useRef(false);

  const forceUpdate = () => {
    if (!destroyRef.current) {
      internalForceUpdate({});
    }
  };

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
        forceUpdate();
      }
    });
  }, []);

  const unregisterPath = useCallback((key: string, keyPath: string[]) => {
    const connectedPath = getPathStr(keyPath);
    path2keyRef.current.delete(connectedPath);
    key2pathRef.current.delete(key);
  }, []);

  const refreshOverflowKeys = useCallback((keys: string[]) => {
    setOverflowKeys(keys);
  }, []);

  const getKeyPath = useCallback(
    (eventKey: string, includeOverflow?: boolean) => {
      const fullPath = key2pathRef.current.get(eventKey) || '';
      const keys = getPathKeys(fullPath);

      if (includeOverflow && overflowKeys.includes(keys[0])) {
        keys.unshift(OVERFLOW_KEY);
      }

      return keys;
    },
    [overflowKeys],
  );

  const isSubPathKey = useCallback(
    (pathKeys: string[], eventKey: string) =>
      pathKeys
        .filter(item => item !== undefined)
        .some(pathKey => {
          const pathKeyList = getKeyPath(pathKey, true);
          return pathKeyList.includes(eventKey);
        }),
    [getKeyPath],
  );
  const getKeys = () => {
    const keys = [...key2pathRef.current.keys()];

    if (overflowKeys.length) {
      keys.push(OVERFLOW_KEY);
    }

    return keys;
  };

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

  React.useEffect(
    () => () => {
      destroyRef.current = true;
    },
    [],
  );

  return {
    // Register
    registerPath,
    unregisterPath,
    refreshOverflowKeys,

    // Util
    isSubPathKey,
    getKeyPath,
    getKeys,
    getSubPathKeys,
  };
}
