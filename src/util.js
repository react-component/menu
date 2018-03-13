import React from 'react';

export function noop() {
}

export function getKeyFromChildrenIndex(child, menuEventKey, index) {
  const prefix = menuEventKey || '';
  return child.key || `${prefix}item_${index}`;
}

/*
 find which menu an item with particular event that it belongs to.
 e.g.:
   eventkey of '1' or '2' belongs to root menu ('0-menu-')
   eventkey of '2-1' or '2-2' belongs to sub menu with key id '2-menu-'
   eventkey of '2-2-1' or '2-2-2' belongs to sub menu with key id '2-2-menu-'
*/
export function getMenuIdFromItemEventKey(eventkey) {
  const index = eventkey.lastIndexOf('-');
  if (index === -1) {
    return '0-menu-';
  }

  const ret = eventkey.slice(0, index);
  return `${ret}-menu-`;
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

export function loopMenuItemRecusively(children, keys, ret) {
  if (!children || ret.find) {
    return;
  }
  React.Children.forEach(children, (c) => {
    if (ret.find) {
      return;
    }
    if (c) {
      const construt = c.type;
      if (!construt || !(construt.isSubMenu || construt.isMenuItem || construt.isMenuItemGroup)) {
        return;
      }
      if (keys.indexOf(c.key) !== -1) {
        ret.find = true;
      } else if (c.props.children) {
        loopMenuItemRecusively(c.props.children, keys, ret);
      }
    }
  });
}
