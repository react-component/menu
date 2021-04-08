/* eslint no-console:0 */

import React from 'react';
import type { CSSMotionProps } from 'rc-motion';
import Menu from '../../src';
import type { MenuProps } from '../../src';
import '../../assets/index.less';
import '../../assets/menu.less';
import type { MenuInfo } from '@/interface';

const collapseNode = () => ({ height: 0 });
const expandNode = node => ({ height: node.scrollHeight });

const horizontalMotion: CSSMotionProps = {
  motionName: 'rc-menu-open-slide-up',
  motionAppear: true,
  motionEnter: true,
  motionLeave: true,
};

const verticalMotion: CSSMotionProps = {
  motionName: 'rc-menu-open-zoom',
  motionAppear: true,
  motionEnter: true,
  motionLeave: true,
};

const inlineMotion: CSSMotionProps = {
  motionName: 'rc-menu-collapse',
  onAppearStart: collapseNode,
  onAppearActive: expandNode,
  onEnterStart: collapseNode,
  onEnterActive: expandNode,
  onLeaveStart: expandNode,
  onLeaveActive: collapseNode,
};

const motionMap: Record<MenuProps['mode'], CSSMotionProps> = {
  horizontal: horizontalMotion,
  inline: inlineMotion,
  vertical: verticalMotion,
};

export default () => {
  const [mode, setMode] = React.useState<MenuProps['mode']>('horizontal');

  const onRootClick = (info: MenuInfo) => {
    console.log('Root Menu Item Click:', info);
  };

  const onSubMenuClick = (info: MenuInfo) => {
    console.log('Sub Menu Item Click:', info);
  };

  const onClick = (info: MenuInfo) => {
    console.log('Menu Item Click:', info);
  };

  return (
    <>
      <div>
        <select value={mode} onChange={e => setMode(e.target.value as any)}>
          <option value="inline">Inline</option>
          <option value="vertical">Vertical</option>
          <option value="horizontal">Horizontal</option>
        </select>
      </div>
      <Menu
        mode={mode}
        style={{ width: mode === 'horizontal' ? undefined : 256 }}
        onClick={onRootClick}
        motion={motionMap[mode]}
      >
        <Menu.Item key="mail">Navigation One</Menu.Item>
        <Menu.Item key="next">Next Item</Menu.Item>
        <Menu.SubMenu title="Sub Menu" key="sub" onClick={onSubMenuClick}>
          <Menu.Item key="sub1" onClick={onClick}>
            Sub Item 1
          </Menu.Item>
          <Menu.Item key="sub2">Sub Item 2</Menu.Item>
        </Menu.SubMenu>
      </Menu>
    </>
  );
};
