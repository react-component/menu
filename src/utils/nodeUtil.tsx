import * as React from 'react';
import toArray from 'rc-util/lib/Children/toArray';
import type { MenuItemOption, Option } from '../interface';
import { Divider, MenuItem, MenuItemGroup, SubMenu } from '..';

export function parseChildren(
  children: React.ReactNode | undefined,
  keyPath: string[],
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

function convertOptionsToNodes(list: Option[]) {
  return (list || [])
    .map(opt => {
      if (opt && typeof opt === 'object') {
        const { children, type, ...restProps } = opt as any;

        // MenuItemGroup & SubMenuItem
        if (children || type === 'group') {
          if (type === 'group') {
            // Group
            return (
              <MenuItemGroup {...restProps}>
                {convertOptionsToNodes(children)}
              </MenuItemGroup>
            );
          }

          // Sub Menu
          return (
            <SubMenu {...restProps}>{convertOptionsToNodes(children)}</SubMenu>
          );
        }

        // MenuItem & Divider
        if (type === 'divider') {
          return <Divider {...restProps} />;
        }

        const { title, ...restMenuItemProps } = restProps as MenuItemOption;
        return <MenuItem {...restMenuItemProps}>{title}</MenuItem>;
      }

      return null;
    })
    .filter(opt => opt);
}

export function parseOptions(
  children: React.ReactNode | undefined,
  options: Option[] | undefined,
  keyPath: string[],
) {
  let childNodes = children;

  if (options) {
    childNodes = convertOptionsToNodes(options);
  }

  return parseChildren(childNodes, keyPath);
}
