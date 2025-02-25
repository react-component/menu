/* eslint no-console:0 */

import React from 'react';
import Menu from '@rc-component/menu';
import '../../assets/index.less';

const menu1List = [
  {
    titleLocalKey: 'Properties',
    key: 'Properties',
  },
  {
    titleLocalKey: 'Resources',
    key: 'Resources',
    children: [
      {
        titleLocalKey: 'FAQ',
        key: 'Faq',
        isSub: true,
      },
      {
        titleLocalKey: 'Learn',
        key: 'Learn',
        isSub: true,
      },
    ],
  },
  {
    titleLocalKey: 'About Us',
    key: 'AboutUs',
  },
];

const menu1Items = values => {
  if (!values) {
    return undefined;
  }
  return values.map((item, index) => {
    return {
      label: <div>{item.titleLocalKey}</div>,
      key: item.key,
      children: menu1Items(item.children),
    };
  });
};

console.log(menu1Items(menu1List));

export default () => (
  <Menu
    selectable={false}
    mode="inline"
    defaultOpenKeys={['Resources']}
    style={{ width: '100%' }}
    items={menu1Items(menu1List)}
  />
);
