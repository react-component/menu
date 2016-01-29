import React from 'react';

const now = Date.now();

export function noop() {
}

export function getKeyFromChildrenIndex(child, menuEventKey, index) {
  const prefix = menuEventKey || '';
  return child.key || prefix + 'item_' + now + '_' + index;
}

export function loopMenuItem(children, cb) {
  let index = -1;
  React.Children.forEach(children, (c) => {
    index++;
    if (c && c.type.isMenuItemGroup) {
      React.Children.forEach(c.props.children, (c2) => {
        index++;
        cb(c2, index);
      });
    } else {
      cb(c, index);
    }
  });
}
