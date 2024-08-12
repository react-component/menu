import * as React from 'react';
import Divider from '../Divider';
import type { Components, ItemType } from '../interface';
import MenuItem from '../MenuItem';
import MenuItemGroup from '../MenuItemGroup';
import SubMenu from '../SubMenu';
import { parseChildren } from './commonUtil';

function convertItemsToNodes(
  list: ItemType[],
  components: Required<Components>,
) {
  const {
    item: MergedMenuItem,
    group: MergedMenuItemGroup,
    submenu: MergedSubMenu,
    divider: MergedDivider,
  } = components;

  return (list || [])
    .map((opt, index) => {
      if (opt && typeof opt === 'object') {
        const { label, children, key, type, extra, ...restProps } = opt as any;
        const mergedKey = key ?? `tmp-${index}`;

        // MenuItemGroup & SubMenuItem
        if (children || type === 'group') {
          if (type === 'group') {
            // Group
            return (
              <MergedMenuItemGroup key={mergedKey} {...restProps} title={label}>
                {convertItemsToNodes(children, components)}
              </MergedMenuItemGroup>
            );
          }

          // Sub Menu
          return (
            <MergedSubMenu key={mergedKey} {...restProps} title={label}>
              {convertItemsToNodes(children, components)}
            </MergedSubMenu>
          );
        }

        // MenuItem & Divider
        if (type === 'divider') {
          return <MergedDivider key={mergedKey} {...restProps} />;
        }

        return (
          <MergedMenuItem key={mergedKey} {...restProps}>
            {label}
            {!!extra && <span>{extra}</span>}
          </MergedMenuItem>
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
  components: Components,
) {
  let childNodes = children;

  const mergedComponents: Required<Components> = {
    divider: Divider,
    item: MenuItem,
    group: MenuItemGroup,
    submenu: SubMenu,
    ...components,
  };

  if (items) {
    childNodes = convertItemsToNodes(items, mergedComponents);
  }

  return parseChildren(childNodes, keyPath);
}
