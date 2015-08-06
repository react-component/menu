'use strict';

import React from 'react';
import Menu, {SubMenu, Item as MenuItem, ItemGroup as MenuItemGroup, Divider} from 'rc-menu';

import 'rc-menu/assets/index.less';
import 'font-awesome/css/font-awesome.css';

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
  <h2>keyboard scrollable menu</h2>
  <style>{style}</style>
  <Menu>{children}</Menu>
</div>, document.getElementById('__react-content'));
