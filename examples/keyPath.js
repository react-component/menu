/* eslint no-console:0 */

import React from 'react';
import ReactDOM from 'react-dom';
import Menu, { SubMenu, Item as MenuItem } from 'rc-menu';

import 'rc-menu/assets/index.less';

class Test extends React.Component {
  onClick(info) {
    console.log('click ', info);
  }

  getMenu() {
    return (
      <Menu
        onClick={this.onClick}
        mode="inline"
      >
        <SubMenu key="1" title="submenu1">
          <MenuItem key="1-1">item1-1</MenuItem>
          <MenuItem key="1-2">item1-2</MenuItem>
        </SubMenu>
        <SubMenu key="2" title="submenu2">
          <MenuItem key="2-1">item2-1</MenuItem>
          <MenuItem key="2-2">item2-2</MenuItem>
          <SubMenu key="2-3" title="submenu2-3">
            <MenuItem key="2-3-1">item2-3-1</MenuItem>
            <MenuItem key="2-3-2">item2-3-2</MenuItem>
          </SubMenu>
        </SubMenu>
        <MenuItem key="3">item3</MenuItem>
      </Menu>
    );
  }

  render() {
    return (<div>
      <div style={{ width: 400 }}>{this.getMenu()}</div>
    </div>);
  }
}


ReactDOM.render(<Test />, document.getElementById('__react-content'));
