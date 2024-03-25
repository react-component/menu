/* eslint no-console:0 */

import React, { useRef } from 'react';
import '../../assets/index.less';
import Menu from '../../src';

export default () => {
  const ref1 = useRef();
  const ref2 = useRef();
  const ref3 = useRef();
  const ref4 = useRef();
  const ref5 = useRef();
  const ref6 = useRef();
  const ref7 = useRef();

  return (
    <>
      <button
        onClick={() => {
          console.log(ref1.current);
          console.log(ref2.current);
          console.log(ref3.current);
          console.log(ref4.current);
          console.log(ref5.current);
          console.log(ref6.current);
          console.log(ref7.current);
        }}
      >
        获取 Ref
      </button>
      <Menu
        items={[
          {
            // MenuItem
            label: 'Top Menu Item',
            key: 'top',
            ref: ref1,
          },
          {
            // MenuGroup
            type: 'group',
            label: 'Top Menu Group without children',
            ref: ref2,
          },
          {
            // MenuGroup
            type: 'group',
            label: 'Top Menu Group with children',
            ref: ref3,
            children: [
              {
                // MenuItem
                label: 'Menu Item 1',
                key: 'inner1',
              },
              {
                // Divider
                type: 'divider',
              },
              {
                // MenuItem
                label: 'Menu Item 2',
                key: 'inner2',
                ref: ref4,
              },
            ],
          },
          {
            // SubMenu
            label: 'SubMenu',
            key: 'sub1',
            ref: ref5,
            children: [
              {
                // MenuItem
                label: 'Menu Item 1-1',
                key: 'inner11',
                ref: ref6,
              },

              {
                // SubMenu
                label: 'SubMenu inner',
                key: 'sub1-1',
                ref: ref7,
                children: [
                  {
                    // MenuItem
                    label: 'Menu Item 111',
                    key: 'inner1-1-1',
                  },
                ],
              },
            ],
          },
        ]}
      />
    </>
  );
};
