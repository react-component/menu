/* eslint-disable no-console, no-param-reassign */
import * as React from 'react';
import Menu from 'rc-menu';
import '../../assets/index.less';
import type { ItemType } from '@/interface';

const getSvgIcon = (style = {}, text?: React.ReactNode) => {
  if (text) {
    return <i style={style}>{text}</i>;
  }
  const path =
    'M869 487.8L491.2 159.9c-2.9-2.5-6.6-3.9-10.5-3.9h' +
    '-88.5c-7.4 0-10.8 9.2-5.2 14l350.2 304H152c-4.4 0-8 3.6-8 8v' +
    '60c0 4.4 3.6 8 8 8h585.1L386.9 854c-5.6 4.9-2.2 14 5.2 14h91' +
    '.5c1.9 0 3.8-0.7 5.2-2L869 536.2c14.7-12.8 14.7-35.6 0-48.4z';
  return (
    <i style={style}>
      <svg
        viewBox="0 0 1024 1024"
        width="1em"
        height="1em"
        fill="currentColor"
        style={{ verticalAlign: '-.125em' }}
      >
        <path d={path} />
      </svg>
    </i>
  );
};

function itemIcon(props) {
  return getSvgIcon({
    position: 'absolute',
    right: '1rem',
    color: props.isSelected ? 'pink' : 'inherit',
  });
}

function expandIcon(props) {
  return getSvgIcon({
    position: 'absolute',
    right: '1rem',
    color: 'lightblue',
    transform: `rotate(${props.isOpen ? 90 : 0}deg)`,
  });
}

const collapseNode = () => ({ height: 0 });
const expandNode = node => ({ height: node.scrollHeight });

const inlineMotion = {
  motionName: 'rc-menu-collapse',
  onAppearStart: collapseNode,
  onAppearActive: expandNode,
  onEnterStart: collapseNode,
  onEnterActive: expandNode,
  onLeaveStart: expandNode,
  onLeaveActive: collapseNode,
};

class Demo extends React.Component {
  onOpenChange = value => {
    console.log('onOpenChange', value);
  };

  handleClick = info => {
    console.log(`clicked ${info.key}`);
    console.log(info);
  };

  renderNestSubMenu = (props = {}) => ({
    key: '4',
    type: 'submenu',
    label: <span>offset sub menu 2</span>,
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
        label: <span>sub menu 3</span>,
        children: [
          {
            key: '4-2-0',
            type: 'submenu',
            label: 'sub 4-2-0',
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
            label: <span>sub menu 4</span>,
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
            label: 'sub 4-2-3',
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
    ...props,
  });

  renderCommonMenu = (props = {}) => {
    const items: ItemType[] = [
      {
        key: '1',
        type: 'submenu',
        label: <span>sub menu</span>,
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
      // @ts-ignore
      this.renderNestSubMenu(),
      {
        key: '2',
        label: '1',
      },
      {
        key: '3',
        label: 'outer',
      },
      {
        key: '44',
        label: 'disabled',
        disabled: true,
      },
      {
        key: '5',
        label: 'outer3',
      },
    ];

    return (
      <Menu
        onClick={this.handleClick}
        onOpenChange={this.onOpenChange}
        items={items}
        {...props}
      />
    );
  };

  render() {
    const verticalMenu = this.renderCommonMenu({
      mode: 'vertical',
      openAnimation: 'zoom',
      itemIcon,
      expandIcon,
    });

    const inlineMenu = this.renderCommonMenu({
      mode: 'inline',
      defaultOpenKeys: ['1'],
      motion: inlineMotion,
      itemIcon,
      expandIcon,
    });

    return (
      <div style={{ margin: 20 }}>
        <h2>Antd menu - Custom icon</h2>
        <div>
          <h3>vertical</h3>
          <div style={{ margin: 20, width: 200 }}>{verticalMenu}</div>
          <h3>inline</h3>
          <div style={{ margin: 20, width: 400 }}>{inlineMenu}</div>
        </div>
      </div>
    );
  }
}

export default Demo;
/* eslint-enable */
