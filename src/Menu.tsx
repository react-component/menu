import * as React from 'react';
import { useMemo } from 'react';
import classNames from 'classnames';
import toArray from 'rc-util/lib/Children/toArray';
import Overflow from 'rc-overflow';
import type { MenuMode } from './interface';
import MenuItem from './MenuItem';

export const MenuContext = React.createContext({
  prefixCls: '',
});

export interface MenuProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick' | 'onSelect'> {
  prefixCls?: string;

  mode?: MenuMode;
  children?: React.ReactNode;

  /** direction of menu */
  direction?: 'ltr' | 'rtl';

  // defaultSelectedKeys?: string[];
  // defaultActiveFirst?: boolean;
  // selectedKeys?: string[];
  // defaultOpenKeys?: string[];
  // openKeys?: string[];

  // getPopupContainer?: (node: HTMLElement) => HTMLElement;
  // onClick?: MenuClickEventHandler;
  // onSelect?: SelectEventHandler;
  // onOpenChange?: (openKeys: React.Key[]) => void;
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
  // /** Menu motion define */
  // motion?: CSSMotionProps;

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
}) => {
  const menuContext = useMemo(() => ({ prefixCls }), [prefixCls]);

  const childList: React.ReactElement[] = toArray(children);

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
    <MenuContext.Provider value={menuContext}>{container}</MenuContext.Provider>
  );
};

export default Menu;
