import * as React from 'react';
import toArray from 'rc-util/lib/Children/toArray';
import type { ItemType } from '../interface';
import { Divider, MenuItem, MenuItemGroup, SubMenu } from '..';

export function parseChildren(
  children: React.ReactNode | undefined,
  keyPath: React.Key[],
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
