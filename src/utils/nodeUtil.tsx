import * as React from 'react';
import type { ItemType } from '../interface';
import MenuItemGroup from '../MenuItemGroup';
import SubMenu from '../SubMenu';
import Divider from '../Divider';
import MenuItem from '../MenuItem';
import { parseChildren } from './commonUtil';


function convertItemsToNodes(list: ItemType[]) {
  return (list || [])
    .map((opt, index) => {
      if (opt && typeof opt === 'object') {
        const { label, children, key, type, ...restProps } = opt as any;
        const mergedKey = key ?? `tmp-${index}`;

        // MenuItemGroup & SubMenuItem
        if (children || type === 'group') {
          if (type === 'group') {
            // Group
            return (
              <MenuItemGroup key={mergedKey} {...restProps} title={label}>
                {convertItemsToNodes(children)}
              </MenuItemGroup>
            );
          }

          // Sub Menu
          return (
            <SubMenu key={mergedKey} {...restProps} title={label}>
              {convertItemsToNodes(children)}
            </SubMenu>
          );
        }

        // MenuItem & Divider
        if (type === 'divider') {
          return <Divider key={mergedKey} {...restProps} />;
        }

        return (
          <MenuItem key={mergedKey} {...restProps}>
            {label}
          </MenuItem>
        );
      }

      return null;
    })
    .filter(opt => opt);
}

export function parseItems(
  children: React.ReactNode | undefined,
  items: ItemType[] | undefined,
  keyPath: string[],
) {
  let childNodes = children;

  if (items) {
    childNodes = convertItemsToNodes(items);
  }

  return parseChildren(childNodes, keyPath);
}
