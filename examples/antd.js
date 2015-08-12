'use strict';

import React from 'react';
import Menu, {SubMenu, Item as MenuItem, ItemGroup as MenuItemGroup, Divider} from 'rc-menu';

import 'rc-menu/assets/index.less';

function handleSelect(info) {
  console.log(info);
  console.log('selected ' + info.key);
}

var titleRight = <span>sub menu</span>;
var titleRight1 = <span>sub menu 1</span>;
var titleRight2 = <span>sub menu 2</span>;
var titleRight3 = <span>sub menu 3</span>;
var titleRight4 = <span>sub menu 4</span>;
var container = document.getElementById('__react-content');

var nestSubMenu=<SubMenu title={titleRight2} key="4">
  <MenuItem key="4-1">inner inner</MenuItem>
  <Menu.Divider/>
  <SubMenu key="4-2"
           title={titleRight3}
    >
    <SubMenu title="sub 4-2-0" key="4-2-0">
      <MenuItem key="4-2-0-1">inner inner</MenuItem>
      <MenuItem key="4-2-0-2">inner inner2</MenuItem>
    </SubMenu>
    <MenuItem key="4-2-1">inn</MenuItem>
    <SubMenu title={titleRight4} key="4-2-2">
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
  <SubMenu title={titleRight} key="1">
    <MenuItem key="1-1">0-1</MenuItem>
    <MenuItem key="1-2">0-2</MenuItem>
  </SubMenu>
  <MenuItem key="2">1</MenuItem>
  <MenuItem key="3">outer</MenuItem>
  {nestSubMenu}
  <MenuItem disabled>disabled</MenuItem>
  <MenuItem key="4-3">outer3</MenuItem>
</Menu>;

var subMenus=<Menu onSelect={handleSelect}>
  <SubMenu title={titleRight} key="1">
    <MenuItem key="1-1">0-1</MenuItem>
    <MenuItem key="1-2">0-2</MenuItem>
  </SubMenu>
  <SubMenu title={titleRight1} key="2">
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

  var horizontalClickMenu = React.cloneElement(subMenus,{
    mode:'horizontal',
    openSubMenuOnMouseEnter:false
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
      <h3>horizontal and click</h3>
      <div style={{margin:20,width: 800,}}>{horizontalClickMenu}</div>
      <h3>vertical</h3>
      <div style={{margin:20,width: 200,}}>{verticalMenu}</div>
      <h3>inline</h3>
      <div style={{margin:20,width: 400,}}>{inlineMenu}</div>
    </div>
  </div>, container);
}
