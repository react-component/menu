import React, { useState } from 'react';
import Menu, { SubMenu, Item } from 'rc-menu';
import './inlineCollapsed.less';
import { inlineMotion } from './antd'

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div style={{ height: 600 }}>
      <label>
        <input type="checkbox" value={collapsed} onChange={e => setCollapsed(e.target.checked)} />
        inlineCollapsed: {collapsed.toString()}
      </label>
      <Menu
        mode="inline"
        inlineCollapsed={collapsed}
        style={{ width: 600 }}
        className={collapsed ? 'collapsed' : ''}
        motion={inlineMotion}
      >
        <Item key="1">item 1</Item>
        <SubMenu key="2" title={`inlineCollapsed: ${collapsed.toString()}`}>
          <Item key="3">item 2</Item>
          <Item key="4">item 3</Item>
          <SubMenu key="5" title={`inlineCollapsed: ${collapsed.toString()}`} style={{ minWidth: 220 }}>
            <Item key="6">item 4</Item>
            <Item key="7">item 5</Item>
          </SubMenu>
        </SubMenu>
      </Menu>
    </div>
  );
}

export default App;
