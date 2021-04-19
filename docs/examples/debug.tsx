/* eslint no-console:0 */

import React from 'react';
import type { CSSMotionProps } from 'rc-motion';
import Menu, { ItemGroup as MenuItemGroup } from '../../src';
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
        defaultMotions={motionMap}
      >
        <Menu.Item key="mail">Navigation One</Menu.Item>
        <Menu.Item key="next">Next Item</Menu.Item>
        <Menu.SubMenu title="Sub Menu" key="sub" onClick={onSubMenuClick}>
          <Menu.Item key="sub1" onClick={onClick}>
            Sub Item 1
          </Menu.Item>
          <Menu.Item key="sub2">Sub Item 2</Menu.Item>

          <Menu.SubMenu title="Nest Menu" key="nest">
            <MenuItemGroup title="group 1" key="grp1">
              <Menu.Item key="21">2</Menu.Item>
              <Menu.Item key="22">3</Menu.Item>
            </MenuItemGroup>
            <MenuItemGroup title="group 2" key="grp2">
              <Menu.Item key="31">4</Menu.Item>
              <Menu.Item key="32">5</Menu.Item>
            </MenuItemGroup>
          </Menu.SubMenu>
        </Menu.SubMenu>
        <Menu.Item key="disabled" disabled>
          Disabled Item
        </Menu.Item>

        <Menu.SubMenu
          title="Disabled Sub Menu"
          key="disabled-sub"
          onClick={onSubMenuClick}
          disabled
        >
          <Menu.Item key="dis-sub1" onClick={onClick}>
            Disabled Sub Item 1
          </Menu.Item>
        </Menu.SubMenu>
      </Menu>
    </>
  );
};
