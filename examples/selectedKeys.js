import React from 'react';
import ReactDOM from 'react-dom';
import Menu, {SubMenu, Item as MenuItem} from 'rc-menu';

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

  onDeselect(info) {
    console.log('deselect ', info);
  },

  onOpen(info) {
    console.log('open ', info);
    this.setState({
      openKeys: info.openKeys,
    });
  },

  onClose(info) {
    console.log('open ', info);
    this.setState({
      openKeys: info.openKeys,
    });
  },

  onCheck(e) {
    const value = e.target.value;
    if (e.target.checked) {
      this.setState({
        selectedKeys: this.state.selectedKeys.concat(value),
      });
    } else {
      const selectedKeys = this.state.selectedKeys.concat();
      const index = selectedKeys.indexOf(value);
      if (value !== -1) {
        selectedKeys.splice(index, 1);
      }
      this.setState({
        selectedKeys: selectedKeys,
      });
    }
  },

  onOpenCheck(e) {
    const value = e.target.value;
    if (e.target.checked) {
      this.setState({
        openKeys: this.state.openKeys.concat(value),
      });
    } else {
      const openKeys = this.state.openKeys.concat();
      const index = openKeys.indexOf(value);
      if (value !== -1) {
        openKeys.splice(index, 1);
      }
      this.setState({
        openKeys: openKeys,
      });
    }
  },

  getMenu() {
    return (
      <Menu multiple
            onSelect={this.onSelect}
            onDeselect={this.onDeselect}
            onOpen={this.onOpen}
            onClose={this.onClose}
            openKeys={this.state.openKeys}
            selectedKeys={this.state.selectedKeys}>
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

  destroy() {
    this.setState({
      destroyed: true,
    });
  },

  render() {
    if (this.state.destroyed) {
      return null;
    }
    const allSelectedKeys = ['1-1', '1-2', '2-1', '2-2', '3'];
    const allOpenKeys = ['1', '2'];
    const selectedKeys = this.state.selectedKeys;
    const openKeys = this.state.openKeys;

    return (<div>
      <h2>multiple selectable menu</h2>

      <p>
        selectedKeys: &nbsp;&nbsp;&nbsp;
        {allSelectedKeys.map((k) => {
          return (<label key={k}>{k} <input value={k} key={k} type="checkbox" onChange={this.onCheck}
                                           checked={selectedKeys.indexOf(k) !== -1}/></label>);
        })}
      </p>

      <p>
        openKeys: &nbsp;&nbsp;&nbsp;
        {allOpenKeys.map((k)=> {
          return (<label key={k}>{k} <input value={k} type="checkbox" onChange={this.onOpenCheck}
                                           checked={openKeys.indexOf(k) !== -1}/></label>);
        })}
      </p>

      <div style={{width: 400}}>{this.getMenu()}</div>
    </div>);
  },
});


ReactDOM.render(<Test />, document.getElementById('__react-content'));
