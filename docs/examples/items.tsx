/* eslint no-console:0 */

import React from 'react';
import Menu from '../../src';
import '../../assets/index.less';

export default () => (
  <Menu
    items={[
      {
        // MenuItem
        label: 'Top Menu Item',
        key: 'top',
        extra: '⌘B',
      },
      {
        // MenuGroup
        type: 'group',
        label: 'Top Menu Group without children',
      },
      {
        // MenuGroup
        type: 'group',
        label: 'Top Menu Group with children',
        children: [
          {
            // MenuItem
            label: 'Menu Item 1',
            key: 'inner1',
          },
          {
            // Divider
            type: 'divider',
          },
          {
            // MenuItem
            label: 'Menu Item 2',
            key: 'inner2',
          },
        ],
      },
      {
        // SubMenu
        label: 'SubMenu',
        key: 'sub1',
        children: [
          {
            // MenuItem
            label: 'Menu Item 1-1',
            key: 'inner11',
          },

          {
            // SubMenu
            label: 'SubMenu inner',
            key: 'sub1-1',
            children: [
              {
                // MenuItem
                label: 'Menu Item 111',
                key: 'inner1-1-1',
              },
            ],
          },
        ],
      },
    ]}
  />
);
