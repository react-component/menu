'use strict';

import React from 'react';
import Menu, {SubMenu, Item as MenuItem, ItemGroup as MenuItemGroup, Divider} from 'rc-menu';

import 'rc-menu/assets/index.less';
import 'font-awesome/css/font-awesome.css';

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

var Test = React.createClass({
  getInitialState(){
    return {
      destroyed: false,
      selectedKeys: ['2', '1-1']
    };
  },

  handleSelect(info){
    console.log('selected ', info);
    this.setState({
      selectedKeys: info.selectedKeys
    });
  },

  handleDeselect(info) {
    console.log('deselect ', info);
  },

  getMenu(){
    return (
      <Menu multiple={true} onSelect={this.handleSelect}
            onDeselect={this.handleDeselect}
            selectedKeys={this.state.selectedKeys}>
        <SubMenu title={titleRight} key="1">
          <MenuItem key="1-1">0-1</MenuItem>
          <MenuItem key="1-2">0-2</MenuItem>
        </SubMenu>
        <MenuItem key="2" disabled>can not deselect me,i'm disabled</MenuItem>
        <MenuItem key="3">outer</MenuItem>
        <SubMenu title={titleRight1} key="4">
          <MenuItem key="4-1">inner inner</MenuItem>
          <Menu.Divider />
          <SubMenu key="4-2"
                   title={titleRight2}>
            <MenuItem key="4-2-1">inn</MenuItem>
            <SubMenu title={titleRight3} key="4-2-2">
              <Menu>
                <MenuItem key="4-2-2-1">inner inner</MenuItem>
                <MenuItem key="4-2-2-2">inner inner2</MenuItem>
              </Menu>
            </SubMenu>
          </SubMenu>
        </SubMenu>
        <MenuItem disabled key="disabled">disabled</MenuItem>
        <MenuItem key="4-3">outer3</MenuItem>
      </Menu>
    );
  },

  render(){
    if (this.state.destroyed) {
      return null;
    }
    return <div>
      <h2>multiple selectable menu</h2>

      <p>
        <button onClick={this.destroy}>destroy</button>
      </p>
      <div style={{width: 400}}>{this.getMenu()}</div>
    </div>;
  },

  destroy(){
    this.setState({
      destroyed: true
    });
  }
});


React.render(<Test />, document.getElementById('__react-content'));
