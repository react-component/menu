import * as React from 'react';
import toArray from 'rc-util/lib/Children/toArray';

export function parseChildren(
  children: React.ReactNode,
  keyPath: string[] = [],
) {
  return toArray(children).map((child, index) => {
    if (React.isValidElement(child)) {
      let { key } = child;
      if (key === null || key === undefined) {
        key = `tmp_key-${[...keyPath, index].join('-')}`;
      }

      return React.cloneElement(child, {
        key,
        eventKey: key,
      } as any);
    }

    return child;
  });
}
