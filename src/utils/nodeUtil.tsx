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
  itemRender?: (originNode: React.ReactNode, item: NonNullable<ItemType>) => React.ReactElement,
) {
  const {
    item: MergedMenuItem,
    group: MergedMenuItemGroup,
    submenu: MergedSubMenu,
    divider: MergedDivider,
  } = components;

  return (list || [])
    .map((opt, index) => {
      const renderNodeWrapper = node => {
        return typeof itemRender === 'function' ? itemRender(node, opt as any) : node;
      };
      if (opt && typeof opt === 'object') {
        const { label, children, key, type, extra, ...restProps } = opt as any;
        const mergedKey = key ?? `tmp-${index}`;

        // MenuItemGroup & SubMenuItem
        if (children || type === 'group') {
          if (type === 'group') {
            // Group
            return (
              <MergedMenuItemGroup
                key={mergedKey}
                {...restProps}
                itemRender={renderNodeWrapper}
                title={label}
              >
                {convertItemsToNodes(children, components, prefixCls, itemRender)}
              </MergedMenuItemGroup>
            );
          }

          // Sub Menu
          return (
            <MergedSubMenu
              key={mergedKey}
              {...restProps}
              itemRender={renderNodeWrapper}
              title={label}
            >
              {convertItemsToNodes(children, components, prefixCls, itemRender)}
            </MergedSubMenu>
          );
        }

        // MenuItem & Divider
        if (type === 'divider') {
          return <MergedDivider key={mergedKey} {...restProps} itemRender={renderNodeWrapper} />;
        }

        return (
          <MergedMenuItem
            key={mergedKey}
            {...restProps}
            extra={extra}
            itemRender={renderNodeWrapper}
          >
            {label}
            {(!!extra || extra === 0) && <span className={`${prefixCls}-item-extra`}>{extra}</span>}
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
  prefixCls?: string,
  itemRender?: (originNode: React.ReactNode, item?: NonNullable<ItemType>) => React.ReactElement,
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
    childNodes = convertItemsToNodes(items, mergedComponents, prefixCls, itemRender);
  }

  return parseChildren(childNodes, keyPath);
}
