'use strict';

import React from 'react';
import Menu, {SubMenu, Item as MenuItem, ItemGroup as MenuItemGroup, Divider} from 'rc-menu';

import 'rc-menu/assets/index.less';
import 'font-awesome/css/font-awesome.css';

function handleSelect(selectedKey) {
  console.log('selected ' + selectedKey);
}

function handleClick(selectedKey) {
  console.log('click ' + selectedKey);
}

var titleRight = <span>sub menu
  <i className="fa fa-caret-right pull-right"></i>
</span>;
var titleRight1 = <span>sub menu 1
  <i className="fa fa-caret-right pull-right"></i>
</span>;
var titleRight2 = <span>sub menu 2
  <i className="fa fa-caret-right pull-right"></i>
</span>;
var titleRight3 = <span>sub menu 3
  <i className="fa fa-caret-right pull-right"></i>
</span>;
var container = document.getElementById('__react-content');

render(container);

function render(container) {
  var leftMenu = (
    <Menu onSelect={handleSelect}
      onClick={handleClick}>
      <SubMenu title={titleRight} key="1">
        <MenuItem key="1-1">0-1</MenuItem>
        <MenuItem key="1-2">0-2</MenuItem>
      </SubMenu>
      <MenuItem>
        <a href="http://taobao.com" target="_blank">i do not need key</a>
      </MenuItem>
      <MenuItem key="3">outer</MenuItem>
      <SubMenu title={titleRight1} key="4">
        <MenuItem key="4-1">inner inner</MenuItem>
        <Menu.Divider />
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
    <p>
      <button onClick={destroy}>destroy</button>
    </p>
    <div style={{width: 400}}>{leftMenu}</div>
  </div>, container);


  function destroy() {
    React.unmountComponentAtNode(container);
  }
}
