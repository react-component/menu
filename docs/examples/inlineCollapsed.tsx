import React, { useState } from 'react';
import Menu from '@rc-component/menu';
import './inlineCollapsed.less';

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <>
      <label>
        <input type="checkbox" checked={collapsed} onChange={e => setCollapsed(e.target.checked)} />
        inlineCollapsed: {collapsed.toString()}
      </label>
      <Menu
        mode="inline"
        inlineCollapsed={collapsed}
        style={{ width: 600 }}
        className={collapsed ? 'collapsed' : ''}
        items={[
          { key: '1', label: 'item 1' },
          {
            key: '2',
            label: `inlineCollapsed: ${collapsed.toString()}`,
            children: [
              { key: '3', label: 'item 2' },
              { key: '4', label: 'item 3' },
              {
                key: '5',
                label: 'SubMenu',
                children: [
                  { key: '6', label: 'item 4' },
                  { key: '7', label: 'item 5' },
                  { key: '8', label: 'item 6' },
                ],
              },
            ],
          },
        ]}
      />
    </>
  );
};

export default App;
