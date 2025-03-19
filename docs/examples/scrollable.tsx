/* eslint no-console:0 */

import React from 'react';
import Menu, { Item as MenuItem } from '@rc-component/menu';

import '../../assets/index.less';

const children = [];
for (let i = 0; i < 20; i += 1) {
  children.push(<MenuItem key={String(i)}>{i}</MenuItem>);
}

const menuStyle = {
  width: 200,
  height: 200,
  overflow: 'auto',
};

export default () => (
  <div>
    <h2>keyboard scrollable menu</h2>
    <Menu style={menuStyle}>{children}</Menu>
  </div>
);
