import React from 'react';
import '../../assets/index.less';
import Menu, { Divider, Item as MenuItem, SubMenu } from '../../src';

const nestSubMenu = (
  <SubMenu
    title={<span className="submenu-title-wrapper">offset sub menu 2</span>}
    key="4"
    popupOffset={[10, 15]}
  >
    <MenuItem key="4-1">inner inner</MenuItem>
    <Divider />
    <SubMenu
      key="4-2"
      title={<span className="submenu-title-wrapper">sub menu 1</span>}
    >
      <SubMenu
        title={<span className="submenu-title-wrapper">sub 4-2-0</span>}
        key="4-2-0"
      >
        <MenuItem key="4-2-0-1">inner inner</MenuItem>
        <MenuItem key="4-2-0-2">inner inner2</MenuItem>
      </SubMenu>
      <MenuItem key="4-2-1">inn</MenuItem>
      <SubMenu
        title={<span className="submenu-title-wrapper">sub menu 4</span>}
        key="4-2-2"
      >
        <MenuItem key="4-2-2-1">inner inner</MenuItem>
        <MenuItem key="4-2-2-2">inner inner2</MenuItem>
      </SubMenu>
      <SubMenu
        title={<span className="submenu-title-wrapper">sub menu 3</span>}
        key="4-2-3"
      >
        <MenuItem key="4-2-3-1">inner inner</MenuItem>
        <MenuItem key="4-2-3-2">inner inner2</MenuItem>
      </SubMenu>
    </SubMenu>
  </SubMenu>
);

function handleClick(info) {
  console.log(`clicked ${info.key}`);
  console.log(info);
}

function Demo() {
  return (
    <>
      <Menu mode="horizontal" onClick={handleClick} ssr="off">
        <SubMenu
          title={<span className="submenu-title-wrapper">sub menu</span>}
          key="1"
        >
          <MenuItem key="1-1">0-1</MenuItem>
          <MenuItem key="1-2">0-2</MenuItem>
        </SubMenu>
        {nestSubMenu}
        <MenuItem key="2">1</MenuItem>
        <MenuItem key="3">outer</MenuItem>
        <MenuItem key="5" disabled>
          disabled
        </MenuItem>
        <MenuItem key="6">outer3</MenuItem>
      </Menu>
    </>
  );
}

export default Demo;
