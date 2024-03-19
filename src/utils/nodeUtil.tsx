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
        // The type of `key` changes, `eventKey` is the original value
        const mergeProps = { ...restProps, key: mergedKey, eventKey: mergedKey };

        // MenuItemGroup & SubMenuItem
        if (children || type === 'group') {
          if (type === 'group') {
            // Group
            return (
              <MenuItemGroup {...mergeProps} title={label}>
                {convertItemsToNodes(children)}
              </MenuItemGroup>
            );
          }

          // Sub Menu
          return (
            <SubMenu {...mergeProps} title={label}>
              {convertItemsToNodes(children)}
            </SubMenu>
          );
        }

        // MenuItem & Divider
        if (type === 'divider') {
          return <Divider {...mergeProps} />;
        }

        return (
          <MenuItem {...mergeProps}>
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
