/* eslint no-console:0 */

import React from 'react';
import Menu from '../../src';
import '../../assets/index.less';
import '../../assets/menu.less';

// const menuOptions = [{ key: 'bamboo' }, { key: 'light', label: 'Light' }];

export default () => {
  return (
    <Menu>
      <Menu.Item key="mail">Navigation One</Menu.Item>
      <Menu.Item key="next">Next Item</Menu.Item>
    </Menu>
  );
};
