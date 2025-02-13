/* eslint no-console:0 */

import React from 'react';
import Menu from 'rc-menu';

import '../../assets/index.less';

const items = [];
for (let i = 0; i < 20; i += 1) {
  items.push({
    label: i,
    key: String(i),
  });
}

const menuStyle = {
  width: 200,
  height: 200,
  overflow: 'auto',
};

export default () => (
  <div>
    <h2>keyboard scrollable menu</h2>
    <Menu style={menuStyle} items={items} />
  </div>
);
