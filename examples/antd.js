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
var container = document.getElementById('__react-content');

render(container);

function render(container) {
  var horizontalMenu = (
    <Menu onSelect={handleSelect} mode="horizontal">
      <SubMenu title={titleRight} key="1">
        <MenuItem key="1-1">0-1</MenuItem>
        <MenuItem key="1-2">0-2</MenuItem>
      </SubMenu>
      <MenuItem key="2">1</MenuItem>
      <MenuItem key="3">outer</MenuItem>
      <SubMenu title={titleRight1} key="4">
        <MenuItem key="4-1">inner inner</MenuItem>
        <Menu.Divider/>
        <SubMenu key="4-2"
          title={titleRight2}
          >
          <MenuItem key="4-2-1">inn</MenuItem>
          <SubMenu title={titleRight3} key="4-2-2">
            <Menu>
              <MenuItem key="4-2-2-1">inner inner</MenuItem>
              <MenuItem key="4-2-2-2">inner inner2</MenuItem>
            </Menu>
          </SubMenu>
        </SubMenu>
      </SubMenu>
      <MenuItem disabled>disabled</MenuItem>
      <MenuItem key="4-3">outer3</MenuItem>
    </Menu>
  );

  var verticalMenu = (
    <Menu onSelect={handleSelect} mode="vertical">
      <SubMenu title={titleRight} key="1">
        <MenuItem key="1-1">0-1</MenuItem>
        <MenuItem key="1-2">0-2</MenuItem>
      </SubMenu>
      <MenuItem key="2">1</MenuItem>
      <MenuItem key="3">outer</MenuItem>
      <SubMenu title={titleRight1} key="4">
        <MenuItem key="4-1">inner inner</MenuItem>
        <Menu.Divider/>
        <SubMenu  key="4-2"
          title={titleRight2}
          >
          <MenuItem key="4-2-1">inn</MenuItem>
          <SubMenu title={titleRight3} key="4-2-2">
            <Menu>
              <MenuItem key="4-2-2-1">inner inner</MenuItem>
              <MenuItem key="4-2-2-2">inner inner2</MenuItem>
            </Menu>
          </SubMenu>
        </SubMenu>
      </SubMenu>
      <MenuItem disabled>disabled</MenuItem>
      <MenuItem key="4-3">outer3</MenuItem>
    </Menu>
  );

  var inlineMenu = (
    <Menu onSelect={handleSelect} mode="inline"
          closeSubMenuOnDeactive={false}
          openSubMenuOnHover={false}>
      <SubMenu title={titleRight} key="1">
        <MenuItem key="1-1">0-1</MenuItem>
        <MenuItem key="1-2">0-2</MenuItem>
      </SubMenu>
      <MenuItem key="2">1</MenuItem>
      <MenuItem key="3">outer</MenuItem>
      <SubMenu title={titleRight1} key="4">
        <MenuItem key="4-1">inner inner</MenuItem>
        <SubMenu key="4-2" title={titleRight2}>
          <MenuItem key="4-2-1">inn</MenuItem>
          <SubMenu title={titleRight3} key="4-2-2">
            <Menu>
              <MenuItem key="4-2-2-1">inner inner</MenuItem>
              <MenuItem key="4-2-2-2">inner inner2</MenuItem>
            </Menu>
          </SubMenu>
        </SubMenu>
      </SubMenu>
      <MenuItem disabled>disabled</MenuItem>
      <MenuItem key="4-3">outer3</MenuItem>
    </Menu>
  );


  React.render(<div style={{margin:20}}>
    <h2>antd menu</h2>

    <div>
      <h3>horizontal</h3>
      <div style={{margin:20,width: 800,}}>{horizontalMenu}</div>
      <h3>vertical</h3>
      <div style={{margin:20,width: 200,}}>{verticalMenu}</div>
      <h3>inline</h3>
      <div style={{margin:20,width: 400,}}>{inlineMenu}</div>
    </div>
  </div>, container);
}
