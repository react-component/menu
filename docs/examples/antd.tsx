/* eslint-disable no-console, react/require-default-props, no-param-reassign */

import React from 'react';
import type { CSSMotionProps } from 'rc-motion';
import Menu from 'rc-menu';
import type { ItemType } from '@/interface';
import type { MenuProps } from 'rc-menu';
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

export const inlineMotion: CSSMotionProps = {
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

const nestSubMenu: ItemType = {
  key: '4',
  type: 'submenu',
  label: <span className="submenu-title-wrapper">offset sub menu 2</span>,
  popupOffset: [10, 15],
  children: [
    {
      key: '4-1',
      label: 'inner inner',
    },
    {
      type: 'divider',
    },
    {
      key: '4-2',
      type: 'submenu',
      label: <span className="submenu-title-wrapper">sub menu 1</span>,
      children: [
        {
          key: '4-2-0',
          type: 'submenu',
          label: <span className="submenu-title-wrapper">sub 4-2-0</span>,
          children: [
            {
              key: '4-2-0-1',
              label: 'inner inner',
            },
            {
              key: '4-2-0-2',
              label: 'inner inner2',
            },
          ],
        },
        {
          key: '4-2-1',
          label: 'inn',
        },
        {
          key: '4-2-2',
          type: 'submenu',
          label: <span className="submenu-title-wrapper">sub menu 4</span>,
          children: [
            {
              key: '4-2-2-1',
              label: 'inner inner',
            },
            {
              key: '4-2-2-2',
              label: 'inner inner2',
            },
          ],
        },
        {
          key: '4-2-3',
          type: 'submenu',
          label: <span className="submenu-title-wrapper">sub menu 3</span>,
          children: [
            {
              key: '4-2-3-1',
              label: 'inner inner',
            },
            {
              key: '4-2-3-2',
              label: 'inner inner2',
            },
          ],
        },
      ],
    },
  ],
};

function onOpenChange(value) {
  console.log('onOpenChange', value);
}

const items1: ItemType[] = [
  {
    type: 'submenu',
    key: '1',
    label: <span className="submenu-title-wrapper">sub menu</span>,
    children: [
      {
        key: '1-1',
        label: '0-1',
      },
      {
        key: '1-2',
        label: '0-2',
      },
    ],
  },
  nestSubMenu,
  {
    key: '2',
    label: '1',
  },
  {
    key: '3',
    label: 'outer',
  },
  {
    key: '5',
    label: 'disabled',
    disabled: true,
  },
  {
    key: '6',
    label: 'outer3',
  },
];

const items2 = [
  {
    type: 'submenu',
    key: '1',
    label: <span className="submenu-title-wrapper">sub menu</span>,
    children: [
      {
        key: '1-1',
        label: '0-1',
      },
      {
        key: '1-2',
        label: '0-2',
      },
    ],
  },
  {
    key: '2',
    label: '1',
  },
  {
    key: '3',
    label: 'outer',
  },
];

const customizeIndicator = <span>Add More Items</span>;

interface CommonMenuProps extends MenuProps {
  triggerSubMenuAction?: MenuProps['triggerSubMenuAction'];
  updateChildrenAndOverflowedIndicator?: boolean;
}

interface CommonMenuState {
  items: ItemType[];
  overflowedIndicator: React.ReactNode;
}

export class CommonMenu extends React.Component<
  CommonMenuProps,
  CommonMenuState
> {
  state: CommonMenuState = {
    items: items1 as ItemType[],
    overflowedIndicator: undefined,
  };

  toggleChildren = () => {
    // @ts-ignore
    this.setState(({ items }) => ({
      items: items === items1 ? items2 : items1,
    }));
  };

  toggleOverflowedIndicator = () => {
    this.setState(({ overflowedIndicator }) => ({
      overflowedIndicator:
        overflowedIndicator === undefined ? customizeIndicator : undefined,
    }));
  };

  render() {
    const { triggerSubMenuAction } = this.props;
    const { items, overflowedIndicator } = this.state;
    return (
      <div>
        {this.props.updateChildrenAndOverflowedIndicator && (
          <div>
            <button type="button" onClick={this.toggleChildren}>
              toggle items
            </button>
            <button type="button" onClick={this.toggleOverflowedIndicator}>
              toggle overflowedIndicator
            </button>
          </div>
        )}
        <Menu
          onClick={handleClick}
          triggerSubMenuAction={triggerSubMenuAction}
          onOpenChange={onOpenChange}
          selectedKeys={['3']}
          overflowedIndicator={overflowedIndicator}
          {...this.props}
          items={items}
        />
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

  const verticalMenu = (
    <CommonMenu mode="vertical" defaultMotions={motionMap} />
  );

  const inlineMenu = (
    <CommonMenu mode="inline" defaultOpenKeys={['1']} motion={inlineMotion} />
  );

  return (
    <div style={{ margin: 20 }}>
      <h2>antd menu</h2>
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
