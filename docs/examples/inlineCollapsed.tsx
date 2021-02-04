import React, { useState } from 'react';
import Menu, { SubMenu, Item } from 'rc-menu';
import './inlineCollapsed.less';

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <>
      <label>
        <input type="checkbox" value={collapsed} onChange={e => setCollapsed(e.target.checked)} />
        inlineCollapsed: {collapsed.toString()}
      </label>
      <Menu
        mode="inline"
        inlineCollapsed={collapsed}
        style={{ width: 600 }}
        className={collapsed ? 'collapsed' : ''}
      >
        <Item key="1">item 1</Item>
        <SubMenu key="2" title={`inlineCollapsed: ${collapsed.toString()}`}>
          <Item key="3">item 2</Item>
          <Item key="4">item 3</Item>
        </SubMenu>
      </Menu>
    </>
  );
}

export default App;
