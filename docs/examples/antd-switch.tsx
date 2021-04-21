/* eslint-disable no-console, react/require-default-props, no-param-reassign */

import React from 'react';
import { CommonMenu, inlineMotion } from './antd';
import '../../assets/index.less';

const Demo = () => {
  const [inline, setInline] = React.useState(false);
  const [openKeys, setOpenKey] = React.useState(['1']);

  let restProps = {};
  if (inline) {
    restProps = { motion: inlineMotion };
  } else {
    restProps = { openAnimation: 'zoom' };
  }

  return (
    <div style={{ margin: 20, width: 200 }}>
      <label>
        <input
          type="checkbox"
          checked={inline}
          onChange={() => setInline(!inline)}
        />{' '}
        Inline
      </label>
      <CommonMenu
        mode="inline"
        openKeys={openKeys}
        onOpenChange={keys => {
          console.error('Open Keys Changed:', keys);
          setOpenKey(keys);
        }}
        inlineCollapsed={!inline}
        {...restProps}
      />
    </div>
  );
};

export default Demo;
/* eslint-enable */
