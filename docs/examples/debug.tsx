/* eslint no-console:0 */

import React, { useRef } from 'react';
import type { CSSMotionProps } from 'rc-motion';
import Menu from 'rc-menu';
import type { MenuProps } from 'rc-menu';
import '../../assets/index.less';
import '../../assets/menu.less';
import type { MenuInfo, MenuRef } from '@/interface';

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

export default () => {
  const [mode, setMode] = React.useState<MenuProps['mode']>('horizontal');
  const [narrow, setNarrow] = React.useState(false);
  const [inlineCollapsed, setInlineCollapsed] = React.useState(false);
  const [forceRender, setForceRender] = React.useState(false);
  const [openKeys, setOpenKeys] = React.useState<string[]>([]);
  const menuRef = useRef<MenuRef>();

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
        <Menu ref={menuRef} items={[{ key: 'light', label: 'Light' }]} />
        <button onClick={() => menuRef.current.focus()}>focus</button>
        <select value={mode} onChange={e => setMode(e.target.value as any)}>
          <option value="inline">Inline</option>
          <option value="vertical">Vertical</option>
          <option value="horizontal">Horizontal</option>
        </select>

        {/* Narrow */}
        <button
          onClick={() => {
            setNarrow(!narrow);
          }}
        >
          Narrow: {String(narrow)}
        </button>

        {/* InlineCollapsed */}
        <button
          onClick={() => {
            setInlineCollapsed(!inlineCollapsed);
          }}
        >
          Inline Collapsed: {String(inlineCollapsed)}
        </button>

        {/* forceRender */}
        <button
          onClick={() => {
            setForceRender(!forceRender);
          }}
        >
          Force Render: {String(forceRender)}
        </button>
      </div>

      <div style={{ width: narrow ? 350 : undefined }}>
        <Menu
          defaultOpenKeys={['sub', 'nest']}
          forceSubMenuRender={forceRender}
          mode={mode}
          style={{ width: mode === 'horizontal' ? undefined : 256 }}
          onClick={onRootClick}
          defaultMotions={motionMap}
          inlineCollapsed={inlineCollapsed}
          openKeys={openKeys}
          onOpenChange={newOpenKeys => setOpenKeys(newOpenKeys)}
          items={[
            {
              key: 'mail',
              label: <a href="http://www.taobao.com">Navigation One</a>,
            },
            {
              key: 'next',
              label: 'Next Item',
              onClick: onClick,
            },
            {
              key: 'sub',
              label: 'Sub Menu',
              type: 'submenu',
              onClick: onSubMenuClick,
              children: [
                {
                  key: 'sub1',
                  label: 'Sub Item 1',
                  onClick: onClick,
                },
                {
                  key: 'sub2',
                  label: 'Sub Item 2',
                },
                {
                  key: 'nest',
                  label: 'Nest Menu',
                  type: 'submenu',
                  children: [
                    {
                      key: 'grp1',
                      type: 'group',
                      label: 'group 1',
                      children: [
                        {
                          key: '21',
                          label: '2',
                        },
                        {
                          key: '22',
                          label: '3',
                        },
                      ],
                    },
                    {
                      key: 'grp2',
                      type: 'group',
                      label: 'group 2',
                      children: [
                        {
                          key: '31',
                          label: '4',
                        },
                        {
                          key: '32',
                          label: '5',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              key: 'disabled',
              label: 'Disabled Item',
              disabled: true,
            },
            {
              key: 'disabled-sub',
              label: 'Disabled Sub Menu',
              type: 'submenu',
              onClick: onSubMenuClick,
              disabled: true,
              children: [
                {
                  key: 'dis-sub1',
                  label: 'Disabled Sub Item 1',
                  onClick: onClick,
                },
              ],
            },
          ]}
        />
      </div>
    </>
  );
};
