/* eslint no-console:0 */

import React from 'react';
import Menu from '../../src';
import '../../assets/index.less';

export default () => (
  <Menu
    options={[
      {
        // MenuItem
        title: 'Top Menu Item',
        key: 'top',
      },
      {
        // MenuGroup
        type: 'group',
        title: 'Top Menu Group without children',
      },
      {
        // MenuGroup
        type: 'group',
        title: 'Top Menu Group with children',
        children: [
          {
            // MenuItem
            title: 'Menu Item 1',
            key: 'inner1',
          },
          {
            // Divider
            type: 'divider',
          },
          {
            // MenuItem
            title: 'Menu Item 2',
            key: 'inner2',
          },
        ],
      },
      {
        // SubMenu
        title: 'SubMenu',
        key: 'sub1',
        children: [
          {
            // MenuItem
            title: 'Menu Item 1-1',
            key: 'inner11',
          },

          {
            // SubMenu
            title: 'SubMenu inner',
            key: 'sub1-1',
            children: [
              {
                // MenuItem
                title: 'Menu Item 111',
                key: 'inner1-1-1',
              },
            ],
          },
        ],
      },
    ]}
  />
);
