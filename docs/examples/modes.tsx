/* eslint no-console:0 */

import React from 'react';
import Menu, { SubMenu, Item as MenuItem } from 'rc-menu';
import { MenuMode } from '@/interface';
import '../../assets/index.less';

export default () => {

  const [mode, setMode] = React.useState<MenuMode>("horizontal")

  const [width, setWidth] = React.useState(400)

  function handleSelect(info) {
    console.log('selected ', info);
  }

  function handleClick(info) {
    console.log('click ', info);
  }

  return (
    <div>
      <select value={mode} onChange={(e) => setMode(e.target.value as MenuMode)}>
        <option>horizontal</option>
        <option>inline</option>
        <option>vertical</option>
        <option>vertical-left</option>
        <option>vertical-right</option>
      </select>

      <input value={width} onChange={e => setWidth(Number(e.target.value))} />

      <div style={{ width }}>
        <Menu onSelect={handleSelect} defaultActiveFirst onClick={handleClick} mode={mode}>
          <MenuItem key="1">item 1</MenuItem>
          <MenuItem disabled>disabled</MenuItem>
          <MenuItem key="3">item 3</MenuItem>
          <MenuItem key="4">item 4</MenuItem>
          <SubMenu title="item 5" key="5">
            <MenuItem key="5-1">item 5-1</MenuItem>
            <MenuItem key="5-2">item 5-2</MenuItem>
          </SubMenu>
          <MenuItem key="6">item 6</MenuItem>
        </Menu>
      </div>
    </div>
  );
};
