import * as React from 'react';
import warning from 'rc-util/lib/warning';
import toArray from 'rc-util/lib/Children/toArray';

export function parseChildren(children: React.ReactNode, keyPath: string[]) {
  return toArray(children).map((child, index) => {
    if (React.isValidElement(child)) {
      let { key } = child;
      if (key === null || key === undefined) {
        key = `tmp_key-${[...keyPath, index].join('-')}`;

        if (process.env.NODE_ENV !== 'production') {
          warning(
            false,
            'MenuItem or SubMenu should not leave undefined `key`.',
          );
        }
      }

      return React.cloneElement(child, {
        key,
        eventKey: key,
      } as any);
    }

    return child;
  });
}
