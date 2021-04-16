import * as React from 'react';

const PATH_SPLIT = '__RC_UTIL_PATH_SPLIT__';

const getPathStr = (keyPath: string[]) => keyPath.join(PATH_SPLIT);

function usePathData() {
  const [, forceUpdate] = React.useState({});
  const path2keyRef = React.useRef(new Map<string, string>());
  const key2pathRef = React.useRef(new Map<string, string>());
  const updateRef = React.useRef(0);

  function registerPath(key: string, keyPath: string[]) {
    const connectedPath = getPathStr(keyPath);
    path2keyRef.current.set(connectedPath, key);
    key2pathRef.current.set(key, connectedPath);

    updateRef.current += 1;
    const id = updateRef.current;

    Promise.resolve().then(() => {
      if (id === updateRef.current) {
        forceUpdate({});
      }
    });
  }

  function unregisterPath(key: string, keyPath: string[]) {
    const connectedPath = getPathStr(keyPath);
    path2keyRef.current.delete(connectedPath);
    key2pathRef.current.delete(key);
  }

  function keyInPath(keyList: string[], keyPath: string[]) {
    /**
     * Generate `path1__SPLIT__path2__SPLIT__` instead of `path1__SPLIT__path2`.
     * To avoid full path like `path1__SPLIT__path23__SPLIT__path3` matching.
     */
    const connectedPath = getPathStr([...keyPath, '']);

    return keyList.some(key => {
      const fullPath = key2pathRef.current.get(key);
      return fullPath.startsWith(connectedPath);
    });
  }

  return {
    registerPath,
    unregisterPath,
    keyInPath,
  };
}

export type PathHookRet = ReturnType<typeof usePathData>;

export default usePathData;
