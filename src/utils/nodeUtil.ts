import * as React from 'react';
import toArray from 'rc-util/lib/Children/toArray';

export function parseChildren(children: React.ReactNode) {
  return toArray(children).map(child => {
    if (React.isValidElement(child) && child.key !== undefined) {
      return React.cloneElement(child, {
        eventKey: child.key,
      } as any);
    }

    return child;
  });
}
