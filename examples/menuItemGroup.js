'use strict';

var React = require('react');
var Menu = require('rc-menu');
var SubMenu = Menu.SubMenu;
var MenuItem = Menu.Item;
var MenuItemGroup = Menu.ItemGroup;
var pkg = require('../package.json');

require('rc-menu/assets/index.css');
require('font-awesome/css/font-awesome.css');

React.render(<div>
  <h1>{pkg.name}@{pkg.version}</h1>
  <h2>menu item group</h2>
  <Menu style={{margin: 20, width: 300}}>
    <MenuItemGroup title="group 1" key="2">
      <MenuItem key="21">2</MenuItem>
      <MenuItem key="22">3</MenuItem>
    </MenuItemGroup>
    <MenuItemGroup title="group 2" key="3">
      <MenuItem key="31">4</MenuItem>
      <MenuItem key="32">5</MenuItem>
    </MenuItemGroup>
  </Menu>
</div>, document.getElementById('__react-content'));
