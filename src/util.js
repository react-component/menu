import React from 'react';

export function noop() {
}

export function getKeyFromChildrenIndex(child, menuEventKey, index) {
  const prefix = menuEventKey || '';
  return child.key || `${prefix}item_${index}`;
}

export function getMenuIdFromSubMenuEventKey(eventKey) {
  return `${eventKey}-menu-`;
}

export function loopMenuItem(children, cb) {
  let index = -1;
  React.Children.forEach(children, (c) => {
    index++;
    if (c && c.type && c.type.isMenuItemGroup) {
      React.Children.forEach(c.props.children, (c2) => {
        index++;
        cb(c2, index);
      });
    } else {
      cb(c, index);
    }
  });
}

export function loopMenuItemRecursively(children, keys, ret) {
  /* istanbul ignore if */
  if (!children || ret.find) {
    return;
  }
  React.Children.forEach(children, (c) => {
    if (c) {
      const construct = c.type;
      if (!construct
            ||
          !(construct.isSubMenu || construct.isMenuItem || construct.isMenuItemGroup)
      ) {
        return;
      }
      if (keys.indexOf(c.key) !== -1) {
        ret.find = true;
      } else if (c.props.children) {
        loopMenuItemRecursively(c.props.children, keys, ret);
      }
    }
  });
}
