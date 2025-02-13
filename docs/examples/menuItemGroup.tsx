/* eslint no-console:0 */

import React from 'react';
import Menu from 'rc-menu';

import '../../assets/index.less';

export default () => (
  <div>
    <h2>menu item group</h2>
    <Menu
      style={{ margin: 20, width: 300 }}
      onClick={() => console.log('click')}
      items={[
        {
          type: 'group',
          label: 'group 1',
          key: '2',
          children: [
            {
              key: '21',
              label: '2',
            },
            {
              key: '22',
              label: '3',
            },
          ],
        },
        {
          type: 'group',
          label: 'group 2',
          key: '3',
          children: [
            {
              key: '31',
              label: '4',
            },
            {
              key: '32',
              label: '5',
            },
          ],
        },
      ]}
    />
  </div>
);
