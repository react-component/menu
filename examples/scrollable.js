import React from 'react';
import ReactDOM from 'react-dom';
import Menu, {SubMenu, Item as MenuItem, ItemGroup as MenuItemGroup, Divider} from 'rc-menu';

import 'rc-menu/assets/index.less';
import 'font-awesome/css/font-awesome.css';

var children = [];
for (var i = 0; i < 20; i++) {
  children.push(<MenuItem key={i + ""}>{i}</MenuItem>);
}
ReactDOM.render(<div>
  <h2>keyboard scrollable menu</h2>
  <Menu style={{
  width:200,
  height:200,
  overflow:'auto'
  }}>{children}</Menu>
</div>, document.getElementById('__react-content'));
