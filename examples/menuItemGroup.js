/* eslint no-console:0 */

import React from 'react';
import ReactDOM from 'react-dom';
import Menu, { SubMenu, Item as MenuItem, ItemGroup as MenuItemGroup } from 'rc-menu';

import 'rc-menu/assets/index.less';

ReactDOM.render(<div>
  <h2>menu item group</h2>
  <Menu style={{ margin: 20, width: 300 }} mode="inline">
    <MenuItem key="11">1</MenuItem>
    <MenuItemGroup title="group 1" key="2">
      <MenuItem key="21">2</MenuItem>
      <MenuItem key="22">3</MenuItem>
    </MenuItemGroup>
    <MenuItemGroup title="group 2" key="3">
      <MenuItem key="31">4</MenuItem>
      <MenuItem key="32">5</MenuItem>
    </MenuItemGroup>
    <SubMenu title="6">
      <MenuItem key="61">6.1</MenuItem>
      <MenuItemGroup title="6.2" key="6.2">
        <MenuItem key="621">6.2.1</MenuItem>
        <MenuItem key="622">6.2.2</MenuItem>
      </MenuItemGroup>
      <MenuItemGroup title="6.3" key="6.3">
        <MenuItem key="631">6.3.1</MenuItem>
        <MenuItem key="632">6.3.2</MenuItem>
      </MenuItemGroup>
      <MenuItem key="64">6.4</MenuItem>
    </SubMenu>
  </Menu>
</div>, document.getElementById('__react-content'));
