/* eslint no-console:0 */

import React from 'react';
import Menu from 'rc-menu';

import '../../assets/index.less';

function handleSelect(info) {
  console.log('selected ', info);
}

function handleDeselect(info) {
  console.log('deselect ', info);
}

const titleRight = <span>sub menu</span>;
const titleRight1 = <span>sub menu 1</span>;
const titleRight2 = <span>sub menu 2</span>;
const titleRight3 = <span>sub menu 3</span>;

function Demo() {
  const [destroy, setDestroy] = React.useState(false);

  const leftMenu = (
    <Menu
      multiple
      onSelect={handleSelect}
      onDeselect={handleDeselect}
      defaultSelectedKeys={['2', '1-1']}
      items={[
        {
          label: titleRight,
          type: 'submenu',
          key: '1',
          children: [
            {
              label: '0-1',
              key: '1-1',
            },
            {
              label: '0-2',
              key: '1-2',
            },
          ],
        },
        {
          label: 'can not deselect me, i am disabled',
          key: '2',
          disabled: true,
        },
        {
          label: 'outer',
          key: '3',
        },
        {
          label: titleRight1,
          type: 'submenu',
          key: '4',
          children: [
            {
              label: 'inner inner',
              key: '4-1',
            },
            {
              type: 'divider',
            },
            {
              label: titleRight2,
              type: 'submenu',
              key: '4-2',
              children: [
                {
                  label: 'inn',
                  key: '4-2-1',
                },
                {
                  label: titleRight3,
                  type: 'submenu',
                  key: '4-2-2',
                  children: [
                    {
                      label: 'inner inner',
                      key: '4-2-2-1',
                    },
                    {
                      label: 'inner inner2',
                      key: '4-2-2-2',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'disabled',
          key: 'disabled',
          disabled: true,
        },
        {
          label: 'outer3',
          key: '4-3',
        },
      ]}
    />
  );
  return (
    <div>
      <h2>multiple selectable menu</h2>

      <p>
        <button
          type="button"
          onClick={() => {
            setDestroy(true);
          }}
        >
          destroy
        </button>
      </p>
      {!destroy && <div style={{ width: 400 }}>{leftMenu}</div>}
    </div>
  );
}

export default Demo;
