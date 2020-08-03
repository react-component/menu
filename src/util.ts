import * as React from 'react';
import isMobile from './utils/isMobile';
import MenuItemGroup from './MenuItemGroup';
import SubMenu from './SubMenu';
import MenuItem from './MenuItem';

export function noop() {}

export function getKeyFromChildrenIndex(
  child: React.ReactElement,
  menuEventKey: React.Key,
  index: number,
): React.Key {
  const prefix = menuEventKey || '';
  return child.key || `${prefix}item_${index}`;
}

export function getMenuIdFromSubMenuEventKey(eventKey: string): React.Key {
  return `${eventKey}-menu-`;
}

export function loopMenuItem(
  children: React.ReactNode,
  cb: (node: React.ReactElement, index: number) => void,
) {
  let index = -1;
  React.Children.forEach(children, (c: React.ReactElement) => {
    index += 1;
    if (c && c.type && (c.type as typeof MenuItemGroup).isMenuItemGroup) {
      React.Children.forEach(c.props.children, (c2: React.ReactElement) => {
        index += 1;
        cb(c2, index);
      });
    } else {
      cb(c, index);
    }
  });
}

export function loopMenuItemRecursively(
  children: React.ReactNode,
  keys: string[],
  ret: { find: boolean },
) {
  /* istanbul ignore if */
  if (!children || ret.find) {
    return;
  }
  React.Children.forEach(children, (c: React.ReactElement) => {
    if (c) {
      const construct = c.type as (
        | typeof MenuItemGroup
        | typeof MenuItem
        | typeof SubMenu);
      if (
        !construct ||
        !(
          construct.isSubMenu ||
          construct.isMenuItem ||
          construct.isMenuItemGroup
        )
      ) {
        return;
      }
      if (keys.indexOf((c as any).key) !== -1) {
        ret.find = true;
      } else if (c.props.children) {
        loopMenuItemRecursively(c.props.children, keys, ret);
      }
    }
  });
}

export const menuAllProps = [
  'defaultSelectedKeys',
  'selectedKeys',
  'defaultOpenKeys',
  'openKeys',
  'mode',
  'getPopupContainer',
  'onSelect',
  'onDeselect',
  'onDestroy',
  'openTransitionName',
  'openAnimation',
  'subMenuOpenDelay',
  'subMenuCloseDelay',
  'forceSubMenuRender',
  'triggerSubMenuAction',
  'level',
  'selectable',
  'multiple',
  'onOpenChange',
  'visible',
  'focusable',
  'defaultActiveFirst',
  'prefixCls',
  'inlineIndent',
  'parentMenu',
  'title',
  'rootPrefixCls',
  'eventKey',
  'active',
  'onItemHover',
  'onTitleMouseEnter',
  'onTitleMouseLeave',
  'onTitleClick',
  'popupAlign',
  'popupOffset',
  'isOpen',
  'renderMenuItem',
  'manualRef',
  'subMenuKey',
  'disabled',
  'index',
  'isSelected',
  'store',
  'activeKey',
  'builtinPlacements',
  'overflowedIndicator',
  'motion',

  // the following keys found need to be removed from test regression
  'attribute',
  'value',
  'popupClassName',
  'inlineCollapsed',
  'menu',
  'theme',
  'itemIcon',
  'expandIcon',
];

// ref: https://github.com/ant-design/ant-design/issues/14007
// ref: https://bugs.chromium.org/p/chromium/issues/detail?id=360889
// getBoundingClientRect return the full precision value, which is
// not the same behavior as on chrome. Set the precision to 6 to
// unify their behavior
export const getWidth = (elem: HTMLElement) => {
  let width =
    elem &&
    typeof elem.getBoundingClientRect === 'function' &&
    elem.getBoundingClientRect().width;
  if (width) {
    width = +width.toFixed(6);
  }
  return width || 0;
};

export const setStyle = (
  elem: HTMLElement,
  styleProperty: keyof React.CSSProperties,
  value: string | number,
) => {
  if (elem && typeof elem.style === 'object') {
    elem.style[styleProperty] = value;
  }
};

export const isMobileDevice = (): boolean => isMobile.any;
