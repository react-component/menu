/* eslint no-console:0 */

import React from 'react';
import Menu, { SubMenu, Item as MenuItem } from '@rc-component/menu';

import '../../assets/index.less';

interface TestState {
  destroyed: boolean;
  selectedKeys: string[];
  openKeys: string[];
}

class Test extends React.Component<any, TestState> {
  state = {
    destroyed: false,
    selectedKeys: [],
    openKeys: [],
  } as TestState;

  onSelect = info => {
    console.log('selected ', info);
    this.setState({
      selectedKeys: info.selectedKeys,
    });
  };

  onDeselect = info => {
    console.log('deselect ', info);
  };

  onOpenChange = openKeys => {
    console.log('onOpenChange ', openKeys);
    this.setState({
      openKeys,
    });
  };

  onCheck = e => {
    const { value } = e.target;
    if (e.target.checked) {
      this.setState(state => ({
        selectedKeys: state.selectedKeys.concat(value),
      }));
    } else {
      this.setState(({ selectedKeys }) => {
        const newSelectedKeys = selectedKeys.concat();
        const index = newSelectedKeys.indexOf(value);
        if (value !== -1) {
          newSelectedKeys.splice(index, 1);
        }

        return {
          selectedKeys: newSelectedKeys,
        };
      });
    }
  };

  onOpenCheck = e => {
    const { value } = e.target;
    if (e.target.checked) {
      this.setState(state => ({
        openKeys: state.openKeys.concat(value),
      }));
    } else {
      this.setState(({ openKeys }) => {
        const newOpenKeys = openKeys.concat();
        const index = newOpenKeys.indexOf(value);
        if (value !== -1) {
          newOpenKeys.splice(index, 1);
        }
        return {
          openKeys: newOpenKeys,
        };
      });
    }
  };

  getMenu() {
    return (
      <Menu
        multiple
        onSelect={this.onSelect}
        onDeselect={this.onDeselect}
        onOpenChange={this.onOpenChange}
        openKeys={this.state.openKeys}
        selectedKeys={this.state.selectedKeys}
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

  destroy() {
    this.setState({
      destroyed: true,
    });
  }

  render() {
    if (this.state.destroyed) {
      return null;
    }
    const allSelectedKeys = ['1-1', '1-2', '2-1', '2-2', '3'];
    const allOpenKeys = ['1', '2'];
    const { selectedKeys } = this.state;
    const { openKeys } = this.state;

    return (
      <div>
        <h2>multiple selectable menu</h2>

        <p>
          selectedKeys: &nbsp;&nbsp;&nbsp;
          {allSelectedKeys.map(k => (
            <label key={k}>
              {k}
              <input
                value={k}
                key={k}
                type="checkbox"
                onChange={this.onCheck}
                checked={selectedKeys.indexOf(k) !== -1}
              />
            </label>
          ))}
        </p>

        <p>
          openKeys: &nbsp;&nbsp;&nbsp;
          {allOpenKeys.map(k => (
            <label key={k}>
              {k}
              <input
                value={k}
                type="checkbox"
                onChange={this.onOpenCheck}
                checked={openKeys.indexOf(k) !== -1}
              />
            </label>
          ))}
        </p>

        <div style={{ width: 400 }}>{this.getMenu()}</div>
      </div>
    );
  }
}

export default Test;
