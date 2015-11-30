import React from 'react';
import ReactDOM from 'react-dom';
import Menu, {Item as MenuItem} from 'rc-menu';

import 'rc-menu/assets/index.less';
import 'font-awesome/css/font-awesome.css';

const children = [];
for (let i = 0; i < 20; i++) {
  children.push(<MenuItem key={i + ''}>{i}</MenuItem>);
}

const menuStyle = {
  width: 200,
  height: 200,
  overflow: 'auto',
};
ReactDOM.render(<div>
  <h2>keyboard scrollable menu</h2>
  <Menu style={menuStyle}>{children}</Menu>
</div>, document.getElementById('__react-content'));
