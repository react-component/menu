import type * as React from 'react';
import toArray from 'rc-util/lib/Children/toArray';
import type { MenuItemData } from './interface';

export function convertToData(children: React.ReactNode): MenuItemData[] {
  const childList = toArray(children);

  return childList.map((node: React.ReactElement) => {
    const {
      key,
      props: { children: subChildren, ...restProps },
    } = node;

    console.log(node);

    const subData = convertToData(subChildren);

    const data = {
      key,
      ...restProps,
    };

    if (subData.length) {
      data.children = subData;
    }

    return data;
  });
}
