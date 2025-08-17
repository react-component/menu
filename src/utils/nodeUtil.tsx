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
  prefixCls?: string,
  itemsRender?: (originNode: React.ReactNode, item: NonNullable<ItemType>) => React.ReactNode,
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

        let originNode: React.ReactNode = null;

        // MenuItemGroup & SubMenu
        if (children || type === 'group') {
          if (type === 'group') {
            originNode = (
              <MergedMenuItemGroup key={mergedKey} {...restProps} title={label}>
                {convertItemsToNodes(children, components, prefixCls, itemsRender)}
              </MergedMenuItemGroup>
            );
          } else {
            originNode = (
              <MergedSubMenu key={mergedKey} {...restProps} title={label}>
                {convertItemsToNodes(children, components, prefixCls, itemsRender)}
              </MergedSubMenu>
            );
          }
        }
        // Divider
        else if (type === 'divider') {
          originNode = <MergedDivider key={mergedKey} {...restProps} />;
        }
        // MenuItem
        else {
          originNode = (
            <MergedMenuItem key={mergedKey} {...restProps} extra={extra}>
              {label}
              {(!!extra || extra === 0) && (
                <span className={`${prefixCls}-item-extra`}>{extra}</span>
              )}
            </MergedMenuItem>
          );
        }

        if (typeof itemsRender === 'function') {
          return itemsRender(originNode, opt);
        }
        return originNode;
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
  prefixCls?: string,
  itemsRender?: (originNode: React.ReactNode, item: NonNullable<ItemType>) => React.ReactNode,
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
    childNodes = convertItemsToNodes(items, mergedComponents, prefixCls, itemsRender);
  }

  return parseChildren(childNodes, keyPath);
}
