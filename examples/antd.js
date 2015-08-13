'use strict';

import React from 'react';
import Menu, {SubMenu, Item as MenuItem, ItemGroup as MenuItemGroup, Divider} from 'rc-menu';

import 'rc-menu/assets/index.less';

function handleSelect(info) {
  console.log(info);
  console.log('selected ' + info.key);
}

var container = document.getElementById('__react-content');

var nestSubMenu=<SubMenu title={<span>sub menu 2</span>} key="4">
  <MenuItem key="4-1">inner inner</MenuItem>
  <Menu.Divider/>
  <SubMenu key="4-2"
           title={<span>sub menu 3</span>}
    >
    <SubMenu title="sub 4-2-0" key="4-2-0">
      <MenuItem key="4-2-0-1">inner inner</MenuItem>
      <MenuItem key="4-2-0-2">inner inner2</MenuItem>
    </SubMenu>
    <MenuItem key="4-2-1">inn</MenuItem>
    <SubMenu title={<span>sub menu 4</span>} key="4-2-2">
      <MenuItem key="4-2-2-1">inner inner</MenuItem>
      <MenuItem key="4-2-2-2">inner inner2</MenuItem>
    </SubMenu>
    <SubMenu title="sub 4-2-3" key="4-2-3">
      <MenuItem key="4-2-3-1">inner inner</MenuItem>
      <MenuItem key="4-2-3-2">inner inner2</MenuItem>
    </SubMenu>
  </SubMenu>
</SubMenu>;

var commonMenu=<Menu onSelect={handleSelect}>
  <SubMenu title={<span>sub menu</span>} key="1">
    <MenuItem key="1-1">0-1</MenuItem>
    <MenuItem key="1-2">0-2</MenuItem>
  </SubMenu>
  {nestSubMenu}
  <MenuItem key="2">1</MenuItem>
  <MenuItem key="3">outer</MenuItem>
  <MenuItem disabled>disabled</MenuItem>
  <MenuItem key="5">outer3</MenuItem>
</Menu>;

var subMenus=<Menu onSelect={handleSelect}>
  <SubMenu title={<span>sub menu</span>} key="1">
    <MenuItem key="1-1">0-1</MenuItem>
    <MenuItem key="1-2">0-2</MenuItem>
  </SubMenu>
  <SubMenu title={<span>sub menu 1</span>} key="2">
    <MenuItem key="2-1">2-1</MenuItem>
    <MenuItem key="2-2">2-2</MenuItem>
  </SubMenu>
  {nestSubMenu}
</Menu>;

render(container);

function render(container) {
  var horizontalMenu = React.cloneElement(commonMenu,{
    mode:'horizontal'
  });

  var horizontalMenu2 = React.cloneElement(commonMenu,{
    mode:'horizontal',
    closeSubMenuOnMouseLeave:false
  });

  var horizontalClickMenu = React.cloneElement(subMenus,{
    mode:'horizontal',
    openSubMenuOnMouseEnter:false,
    closeSubMenuOnMouseLeave:false
  });

  var verticalMenu = React.cloneElement(commonMenu,{
    mode:'vertical'
  });

  var inlineMenu = React.cloneElement(commonMenu,{
    mode:'inline'
  });

  React.render(<div style={{margin:20}}>
    <h2>antd menu</h2>
    <div>
      <h3>horizontal</h3>
      <div style={{margin:20,width: 800,}}>{horizontalMenu}</div>
      <h3>horizontal keep open</h3>
      <div style={{margin:20,width: 800,}}>{horizontalMenu2}</div>
      <h3>horizontal and click</h3>
      <div style={{margin:20,width: 800,}}>{horizontalClickMenu}</div>
      <h3>vertical</h3>
      <div style={{margin:20,width: 200,}}>{verticalMenu}</div>
      <h3>inline</h3>
      <div style={{margin:20,width: 400,}}>{inlineMenu}</div>
    </div>
  </div>, container);
}
