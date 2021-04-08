import * as React from 'react';
import type { CSSMotionProps } from 'rc-motion';
import classNames from 'classnames';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import Overflow from 'rc-overflow';
import type { MenuClickEventHandler, MenuInfo, MenuMode } from './interface';
import MenuItem from './MenuItem';
import { parseChildren } from './utils/nodeUtil';
import MenuContextProvider from './context';
import useMemoCallback from './hooks/useMemoCallback';

// optimize for render
const EMPTY_LIST: string[] = [];

export interface MenuProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick' | 'onSelect'> {
  prefixCls?: string;

  mode?: MenuMode;
  children?: React.ReactNode;

  /** direction of menu */
  direction?: 'ltr' | 'rtl';

  // Open control
  defaultOpenKeys?: string[];
  openKeys?: string[];

  /** Menu motion define */
  motion?: CSSMotionProps;

  // >>>>> Events
  onClick?: MenuClickEventHandler;
  onOpenChange?: (openKeys: React.Key[]) => void;

  // defaultSelectedKeys?: string[];
  // defaultActiveFirst?: boolean;
  // selectedKeys?: string[];

  // getPopupContainer?: (node: HTMLElement) => HTMLElement;

  // onSelect?: SelectEventHandler;
  // onDeselect?: SelectEventHandler;
  // onDestroy?: DestroyEventHandler;
  // subMenuOpenDelay?: number;
  // subMenuCloseDelay?: number;
  // forceSubMenuRender?: boolean;
  // triggerSubMenuAction?: TriggerSubMenuAction;
  // level?: number;
  // selectable?: boolean;
  // multiple?: boolean;
  // activeKey?: string;
  // builtinPlacements?: BuiltinPlacements;
  // itemIcon?: RenderIconType;
  // expandIcon?: RenderIconType;
  // overflowedIndicator?: React.ReactNode;

  // /** Default menu motion of each mode */
  // defaultMotions?: Partial<{ [key in MenuMode | 'other']: CSSMotionProps }>;

  // /** @deprecated Please use `motion` instead */
  // openTransitionName?: string;
  // /** @deprecated Please use `motion` instead */
  // openAnimation?: OpenAnimation;

  // inlineCollapsed?: boolean;

  // /** SiderContextProps of layout in ant design */
  // siderCollapsed?: boolean;
  // collapsedWidth?: string | number;
}

const Menu: React.FC<MenuProps> = ({
  prefixCls = 'rc-menu',
  style,
  className,
  tabIndex = 0,
  mode = 'vertical',
  children,
  direction,

  // Open
  defaultOpenKeys,
  openKeys,

  // Motion
  motion,

  // Events
  onClick,
  onOpenChange,
}) => {
  // ========================= Open =========================
  const [mergedOpenKeys, setMergedOpenKeys] = useMergedState(
    defaultOpenKeys || [],
    {
      value: openKeys,
    },
  );

  // ======================== Events ========================
  const onInternalClick = useMemoCallback((info: MenuInfo) => {
    onClick?.(info);
  });

  const onInternalSubMenuClick = useMemoCallback((key: string) => {
    const newOpenKeys = mergedOpenKeys.includes(key)
      ? mergedOpenKeys.filter(k => k !== key)
      : [...mergedOpenKeys, key];

    setMergedOpenKeys(newOpenKeys);
    onOpenChange?.(newOpenKeys);
  });

  // ======================== Render ========================
  const childList: React.ReactElement[] = parseChildren(children);

  const container = (
    <Overflow
      component="ul"
      itemComponent={MenuItem}
      className={classNames(
        prefixCls,
        `${prefixCls}-root`,
        `${prefixCls}-${mode}`,
        className,
        {
          [`${prefixCls}-rlt`]: direction === 'rtl',
        },
      )}
      style={style}
      role="menu"
      tabIndex={tabIndex}
      data={childList}
      renderRawItem={node => node}
    />
  );

  // return (
  //   <ul
  //     className={classNames(prefixCls, className)}
  //     style={style}
  //     role="menu"
  //     tabIndex={tabIndex}
  //   ></ul>
  // );

  return (
    <MenuContextProvider
      prefixCls={prefixCls}
      mode={mode}
      openKeys={mergedOpenKeys}
      motion={motion}
      parentKeys={EMPTY_LIST}
      onItemClick={onInternalClick}
      onSubMenuClick={onInternalSubMenuClick}
    >
      {container}
    </MenuContextProvider>
  );
};

export default Menu;
