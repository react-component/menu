'use strict';

var React = require('react');
var Menu = require('rc-menu');
var SubMenu = Menu.SubMenu;
var MenuItem = Menu.Item;
var pkg = require('../package.json');

require('rc-menu/assets/index.css');
require('font-awesome/css/font-awesome.css');

var children = [];
for (var i = 0; i < 20; i++) {
  children.push(<MenuItem key={i + ""}>{i}</MenuItem>);
}
var style = '.rc-menu {\
height: 200px;\
width:200px;\
overflow:auto;\
}';
React.render(<div>
  <h1>{pkg.name}@{pkg.version}</h1>
  <h2>keyboard scrollable menu</h2>
  <style>{style}</style>
  <Menu>{children}</Menu>
</div>, document.getElementById('__react-content'));
