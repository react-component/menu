import React from 'react';
import ReactDOM from 'react-dom';
import Menu, {SubMenu, Item as MenuItem} from 'rc-menu';

import 'rc-menu/assets/index.less';

const Test = React.createClass({
  getInitialState() {
    return {
      openKeys: [],
    };
  },

  onClick(info) {
    console.log('click ', info);
    this.setState({
      openKeys: info.keyPath.slice(1),
    });
  },

  onOpen(info) {
    console.log('onOpen', info);
    this.setState({
      openKeys: info.openKeys,
    });
  },

  onClose(info) {
    this.onOpen(info);
  },

  getMenu() {
    return (
      <Menu onClick={this.onClick}
            mode="inline"
            onOpen={this.onOpen}
            onClose={this.onClose}
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
  },

  render() {
    return (<div>
      <div style={{width: 400}}>{this.getMenu()}</div>
    </div>);
  },
});


ReactDOM.render(<Test />, document.getElementById('__react-content'));
