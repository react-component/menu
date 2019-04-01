/* eslint no-console:0 */

import React from 'react';
import ReactDOM from 'react-dom';
import Menu, { Item as MenuItem, ItemGroup as MenuItemGroup } from 'rc-menu';

import 'rc-menu/assets/index.less';

ReactDOM.render(<div>
  <h2>menu item group</h2>
  <Menu style={{ margin: 20, width: 300 }}>
    <MenuItemGroup title="group 1" key="2">
      <MenuItem key="21">2</MenuItem>
      <MenuItem key="22">3</MenuItem>
    </MenuItemGroup>
    <MenuItemGroup title="group 2" key="3"
      titleNode={(
        <span>
          <span style={{ fontWeight: 600, fontStyle: 'italic' }}>group</span> 2
        </span>
      )}
    >
      <MenuItem key="31">4</MenuItem>
      <MenuItem key="32">5</MenuItem>
    </MenuItemGroup>
  </Menu>
</div>, document.getElementById('__react-content'));
