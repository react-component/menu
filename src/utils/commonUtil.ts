import { MenuKey } from "@/interface";
import toArray from "rc-util/lib/Children/toArray";
import * as React from 'react';

export function parseChildren(
    children: React.ReactNode | undefined,
    keyPath: MenuKey[],
  ) {
    return toArray(children).map((child, index) => {
      if (React.isValidElement(child)) {
        const { key } = child;
        let eventKey = (child.props as any)?.eventKey ?? key;

        const emptyKey = eventKey === null || eventKey === undefined;

        if (emptyKey) {
          eventKey = `tmp_key-${[...keyPath, index].join('-')}`;
        }

        const cloneProps = {
          key: eventKey,
          eventKey,
        } as any;

        if (process.env.NODE_ENV !== 'production' && emptyKey) {
          cloneProps.warnKey = true;
        }

        return React.cloneElement(child, cloneProps);
      }

      return child;
    });
  }
