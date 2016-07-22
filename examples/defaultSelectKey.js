/* eslint no-console:0 */

import React from 'react';
import ReactDOM from 'react-dom';
import Menu, { SubMenu, MenuItem as MenuItem } from 'rc-menu';

import 'rc-menu/assets/index.less';
import 'font-awesome/css/font-awesome.css';

const Test = React.createClass({
  getInitialState() {
    return {
      destroyed: false,
      selectedKeys: [],
      openKeys: [],
    };
  },

  onSelect(info) {
    console.log('selected ', info);
    this.setState({
      selectedKeys: info.selectedKeys,
    });
  },

  getMenu() {
    return (
      <Menu defaultOpenKeys={['sub1']}
        mode="inline"
        onSelect={this.onSelect}
        defaultSelectedKeys={['3', '5']}
      >
        <SubMenu key="sub1" title="导航一">
          <MenuItem key="1">选项1</MenuItem>
          <MenuItem key="2">选项2</MenuItem>
          <MenuItem key="3">选项3</MenuItem>
          <MenuItem key="4">选项4</MenuItem>
        </SubMenu>
        <SubMenu key="sub2" title="导航二">
          <MenuItem key="5">选项5</MenuItem>
          <MenuItem key="6">选项6</MenuItem>
          <SubMenu key="sub3" title="三级导航">
            <MenuItem key="7">选项7</MenuItem>
            <MenuItem key="8">选项8</MenuItem>
          </SubMenu>
        </SubMenu>
        <SubMenu key="sub4" title="导航三">
          <MenuItem key="9">选项9</MenuItem>
          <MenuItem key="10">选项10</MenuItem>
          <MenuItem key="11">选项11</MenuItem>
          <MenuItem key="12">选项12</MenuItem>
        </SubMenu>
      </Menu>
    );
  },

  destroy() {
    this.setState({
      destroyed: true,
    });
  },

  render() {
    if (this.state.destroyed) {
      return null;
    }

    return (<div>
      <h2>multiple selectable menu</h2>

      <div style={{ width: 400 }}>{this.getMenu()}</div>
    </div>);
  },
});


ReactDOM.render(<Test />, document.getElementById('__react-content'));
