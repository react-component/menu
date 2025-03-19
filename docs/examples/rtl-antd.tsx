/* eslint-disable no-console, react/require-default-props, no-param-reassign */

import React from 'react';
import type { CSSMotionProps } from '@rc-component/motion';
import Menu, { SubMenu, Item as MenuItem, Divider, MenuProps } from '@rc-component/menu';
import '../../assets/index.less';

function handleClick(info) {
  console.log(`clicked ${info.key}`);
  console.log(info);
}

const collapseNode = () => {
  return { height: 0 };
};
const expandNode = node => {
  return { height: node.scrollHeight };
};

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
  motionAppear: true,
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

const nestSubMenu = (
  <SubMenu
    title={<span className="submenu-title-wrapper">offset sub menu 2</span>}
    key="4"
    popupOffset={[-10, 15]}
  >
    <MenuItem key="4-1">inner inner</MenuItem>
    <Divider />
    <SubMenu key="4-2" title={<span className="submenu-title-wrapper">sub menu 1</span>}>
      <SubMenu title={<span className="submenu-title-wrapper">sub 4-2-0</span>} key="4-2-0">
        <MenuItem key="4-2-0-1">inner inner</MenuItem>
        <MenuItem key="4-2-0-2">inner inner2</MenuItem>
      </SubMenu>
      <MenuItem key="4-2-1">inn</MenuItem>
      <SubMenu title={<span className="submenu-title-wrapper">sub menu 4</span>} key="4-2-2">
        <MenuItem key="4-2-2-1">inner inner</MenuItem>
        <MenuItem key="4-2-2-2">inner inner2</MenuItem>
      </SubMenu>
      <SubMenu title={<span className="submenu-title-wrapper">sub menu 3</span>} key="4-2-3">
        <MenuItem key="4-2-3-1">inner inner</MenuItem>
        <MenuItem key="4-2-3-2">inner inner2</MenuItem>
      </SubMenu>
    </SubMenu>
  </SubMenu>
);

function onOpenChange(value) {
  console.log('onOpenChange', value);
}

const children1 = [
  <SubMenu title={<span className="submenu-title-wrapper">sub menu</span>} key="1">
    <MenuItem key="1-1">0-1</MenuItem>
    <MenuItem key="1-2">0-2</MenuItem>
  </SubMenu>,
  nestSubMenu,
  <MenuItem key="2">1</MenuItem>,
  <MenuItem key="3">outer</MenuItem>,
  <MenuItem key="5" disabled>
    disabled
  </MenuItem>,
  <MenuItem key="6">outer3</MenuItem>,
];

const children2 = [
  <SubMenu title={<span className="submenu-title-wrapper">sub menu</span>} key="1">
    <MenuItem key="1-1">0-1</MenuItem>
    <MenuItem key="1-2">0-2</MenuItem>
  </SubMenu>,
  <MenuItem key="2">1</MenuItem>,
  <MenuItem key="3">outer</MenuItem>,
];

const customizeIndicator = <span>Add More Items</span>;

interface CommonMenuState {
  children: React.ReactNode;
  overflowedIndicator?: React.ReactNode;
}

class CommonMenu extends React.Component<any, CommonMenuState> {
  state = {
    children: children1,
    overflowedIndicator: undefined,
  } as CommonMenuState;

  toggleChildren = () => {
    this.setState(({ children }) => ({
      children: children === children1 ? children2 : children1,
    }));
  };

  toggleOverflowedIndicator = () => {
    this.setState(({ overflowedIndicator }) => ({
      overflowedIndicator: overflowedIndicator === undefined ? customizeIndicator : undefined,
    }));
  };

  render() {
    const { updateChildrenAndOverflowedIndicator, ...restProps } = this.props;
    const { children, overflowedIndicator } = this.state;
    return (
      <div>
        {updateChildrenAndOverflowedIndicator && (
          <div>
            <button type="button" onClick={this.toggleChildren}>
              toggle children
            </button>
            <button type="button" onClick={this.toggleOverflowedIndicator}>
              toggle overflowedIndicator
            </button>
          </div>
        )}
        <Menu
          onClick={handleClick}
          onOpenChange={onOpenChange}
          selectedKeys={['3']}
          overflowedIndicator={overflowedIndicator}
          direction="rtl"
          {...restProps}
        >
          {children}
        </Menu>
      </div>
    );
  }
}

function Demo() {
  const horizontalMenu = (
    <CommonMenu
      mode="horizontal"
      // use openTransition for antd
      defaultMotions={motionMap}
    />
  );

  const horizontalMenu2 = (
    <CommonMenu
      mode="horizontal"
      // use openTransition for antd
      defaultMotions={motionMap}
      triggerSubMenuAction="click"
      updateChildrenAndOverflowedIndicator
    />
  );

  const verticalMenu = <CommonMenu mode="vertical" defaultMotions={motionMap} />;

  const inlineMenu = <CommonMenu mode="inline" defaultOpenKeys={['1']} motion={inlineMotion} />;

  return (
    <div style={{ margin: 20, direction: 'rtl' }}>
      <h2>Rtl antd menu</h2>
      <div>
        <h3>horizontal</h3>

        <div style={{ margin: 20 }}>{horizontalMenu}</div>
        <h3>horizontal and click</h3>

        <div style={{ margin: 20 }}>{horizontalMenu2}</div>
        <h3>vertical</h3>

        <div style={{ margin: 20, width: 200 }}>{verticalMenu}</div>
        <h3>inline</h3>

        <div style={{ margin: 20, width: 400 }}>{inlineMenu}</div>
      </div>
    </div>
  );
}

export default Demo;
/* eslint-enable */
