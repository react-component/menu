'use strict';

import React from 'react';
import Menu, {SubMenu, Item as MenuItem, ItemGroup as MenuItemGroup, Divider} from 'rc-menu';

import 'rc-menu/assets/index.less';

function handleSelect(selectedKey) {
  console.log('selected ' + selectedKey);
}

function handleDeselect(selectedKey) {
  console.log('deselect ' + selectedKey);
}

var titleRight = <span>sub menu</span>;
var titleRight1 = <span>sub menu 1</span>;
var titleRight2 = <span>sub menu 2</span>;
var titleRight3 = <span>sub menu 3</span>;
var container = document.getElementById('__react-content');

render(container);

function render(container) {
  var topAlign = {
    points: ['lt', 'lb']
  };
  var leftMenu = (
    <Menu onSelect={handleSelect} onDeselect={handleDeselect} horizontal>
      <SubMenu title={titleRight} key="1" align={topAlign}>
        <MenuItem key="1-1">0-1</MenuItem>
        <MenuItem key="1-2">0-2</MenuItem>
      </SubMenu>
      <MenuItem key="2">1</MenuItem>
      <MenuItem key="3">outer</MenuItem>
      <SubMenu title={titleRight1} key="4" align={topAlign}>
        <MenuItem key="4-1">inner inner</MenuItem>
        <Menu.Divider/>
        <SubMenu
          openOnHover={false}
          key="4-2"
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
  React.render(<div>
    <h2>single selectable menu</h2>
    <div style={{width: 800, margin:20}}>{leftMenu}</div>
  </div>, container);
}
