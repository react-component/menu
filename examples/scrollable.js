/** @jsx React.DOM */
var React = require('react');
var Menu = require('rc-menu');
var SubMenu = Menu.SubMenu;
var MenuItem = Menu.Item;

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
  <h1>keyboard scrollable menu</h1>
  <style>{style}</style>
  <Menu>{children}</Menu>
</div>, document.getElementById('__react-content'));
