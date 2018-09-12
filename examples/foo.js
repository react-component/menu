/* eslint no-console:0 */

import React from 'react';
import ReactDOM from 'react-dom';
import Menu, { Item as MenuItem } from 'rc-menu';
import 'rc-menu/assets/index.less';

const reactContainer = document.getElementById('__react-content');

class Index extends React.Component {
  constructor() {
    super();

    this.state = { isEnabled: false };
  }

  render() {
    const { isEnabled } = this.state;

    return (
      <div>
        <Menu mode="horizontal">
          <MenuItem>AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA</MenuItem>

          <MenuItem disabled={!isEnabled} onClick={console.log}>
            Helloooooooooooooooo
          </MenuItem>

          {/* <MenuItem>{isEnabled + ''}</MenuItem> */}
        </Menu>
        <button onClick={() => this.setState({ isEnabled: !isEnabled })}>
          Click to {isEnabled ? 'Disable' : 'Enable'}
        </button>
        The Hello menu item should be {isEnabled ? 'enabled' : 'disabled'}.
      </div>
    );
  }
}

function render(container) {
  ReactDOM.render(
    <div style={{ margin: 20 }}>
      <Index />
    </div>,
    container
  );
}

render(reactContainer);
