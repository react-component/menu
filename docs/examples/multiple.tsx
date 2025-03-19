/* eslint no-console:0 */

import React from 'react';
import Menu, { SubMenu, Item as MenuItem, Divider } from '@rc-component/menu';

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
    >
      <SubMenu title={titleRight} key="1">
        <MenuItem key="1-1">0-1</MenuItem>
        <MenuItem key="1-2">0-2</MenuItem>
      </SubMenu>
      <MenuItem key="2" disabled>
        can not deselect me, i am disabled
      </MenuItem>
      <MenuItem key="3">outer</MenuItem>
      <SubMenu title={titleRight1} key="4">
        <MenuItem key="4-1">inner inner</MenuItem>
        <Divider />
        <SubMenu key="4-2" title={titleRight2}>
          <MenuItem key="4-2-1">inn</MenuItem>
          <SubMenu title={titleRight3} key="4-2-2">
            <MenuItem key="4-2-2-1">inner inner</MenuItem>
            <MenuItem key="4-2-2-2">inner inner2</MenuItem>
          </SubMenu>
        </SubMenu>
      </SubMenu>
      <MenuItem disabled key="disabled">
        disabled
      </MenuItem>
      <MenuItem key="4-3">outer3</MenuItem>
    </Menu>
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
