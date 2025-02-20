/* eslint no-console:0 */

import React from 'react';
import Menu from 'rc-menu';

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
        items={[
          {
            key: '1',
            label: 'submenu1',
            type: 'submenu',
            children: [
              {
                key: '1-1',
                label: 'item1-1',
              },
              {
                key: '1-2',
                label: 'item1-2',
              },
            ],
          },
          {
            key: '2',
            label: 'submenu2',
            type: 'submenu',
            children: [
              {
                key: '2-1',
                label: 'item2-1',
              },
              {
                key: '2-2',
                label: 'item2-2',
              },
            ],
          },
          {
            key: '3',
            label: 'item3',
          },
        ]}
      />
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
