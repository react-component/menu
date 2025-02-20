/* eslint-disable no-console, react/require-default-props, no-param-reassign */

import React from 'react';
import type { CSSMotionProps } from 'rc-motion';
import Menu, { type MenuProps } from 'rc-menu';
import '../../assets/index.less';
import type { ItemType } from '@/interface';

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

const nestSubMenu = {
  key: '4',
  label: <span className="submenu-title-wrapper">offset sub menu 2</span>,
  type: 'submenu',
  popupOffset: [-10, 15],
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
      label: <span className="submenu-title-wrapper">sub menu 1</span>,
      type: 'submenu',
      children: [
        {
          key: '4-2-0',
          label: <span className="submenu-title-wrapper">sub 4-2-0</span>,
          type: 'submenu',
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
          label: <span className="submenu-title-wrapper">sub menu 4</span>,
          type: 'submenu',
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
          label: <span className="submenu-title-wrapper">sub menu 3</span>,
          type: 'submenu',
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

const items1 = [
  {
    key: '1',
    label: <span className="submenu-title-wrapper">sub menu</span>,
    type: 'submenu',
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
    key: '1',
    label: <span className="submenu-title-wrapper">sub menu</span>,
    type: 'submenu',
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

interface CommonMenuState {
  items: ItemType[];
  overflowedIndicator?: React.ReactNode;
}

class CommonMenu extends React.Component<any, CommonMenuState> {
  state = {
    items: items1,
    overflowedIndicator: undefined,
  } as CommonMenuState;

  toggleItems = () => {
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
    const { updateChildrenAndOverflowedIndicator, ...restProps } = this.props;
    const { items, overflowedIndicator } = this.state;
    return (
      <div>
        {updateChildrenAndOverflowedIndicator && (
          <div>
            <button type="button" onClick={this.toggleItems}>
              toggle items
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
