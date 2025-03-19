/* eslint no-console:0 */

import React from 'react';
import Menu, { SubMenu, Item as MenuItem } from '@rc-component/menu';

import '../../assets/index.less';

class Test extends React.Component {
  state = {
    openKeys: [],
  };

  onClick = info => {
    console.log('click ', info);
  };

  onOpenChange = openKeys => {
    console.log('onOpenChange', openKeys);
    this.setState({
      openKeys,
    });
  };

  getMenu() {
    return (
      <Menu
        onClick={this.onClick}
        mode="inline"
        onOpenChange={this.onOpenChange}
        openKeys={this.state.openKeys}
      >
        <SubMenu key="1" title="submenu1">
          <MenuItem key="1-1">item1-1</MenuItem>
          <MenuItem key="1-2">item1-2</MenuItem>
        </SubMenu>
        <SubMenu key="2" title="submenu2">
          <MenuItem key="2-1">item2-1</MenuItem>
          <MenuItem key="2-2">item2-2</MenuItem>
        </SubMenu>
        <MenuItem key="3">item3</MenuItem>
      </Menu>
    );
  }

  render() {
    return (
      <div>
        <div style={{ width: 400 }}>{this.getMenu()}</div>
      </div>
    );
  }
}

export default Test;
