import React from 'react';
import Menu, { SubMenu, Item as MenuItem, Divider } from '@rc-component/menu';
import '../../assets/index.less';

export default () => (
  <Menu style={{ width: 200 }}>
    <SubMenu title="sub menu" key="1">
      <MenuItem key="1-1">0-1</MenuItem>
      <MenuItem key="1-2">0-2</MenuItem>
    </SubMenu>
    <MenuItem key="2">Menu Item</MenuItem>
    <MenuItem key="3">outer</MenuItem>
    <>
      <SubMenu key="4" title="sub menu">
        <MenuItem key="4-1">inner inner</MenuItem>
        <Divider />
        <SubMenu key="4-2" title="sub menu">
          <MenuItem key="4-2-1">inn</MenuItem>
          <SubMenu title="sub menu" key="4-2-2">
            <MenuItem key="4-2-2-1">inner inner</MenuItem>
            <MenuItem key="4-2-2-2">inner inner2</MenuItem>
          </SubMenu>
        </SubMenu>
      </SubMenu>
      <MenuItem disabled>disabled</MenuItem>
      <MenuItem key="4-3">outer3</MenuItem>
    </>
  </Menu>
);
