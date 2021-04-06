import * as React from 'react';
import Overflow from 'rc-overflow';
import { MenuContext } from './Menu';

export interface SubMenuProps {
  children?: React.ReactNode;

  // parentMenu?: React.ReactElement & {
  //   isRootMenu: boolean;
  //   subMenuInstance: React.ReactInstance;
  // };
  // title?: React.ReactNode;

  // selectedKeys?: string[];
  // openKeys?: string[];
  // onClick?: MenuClickEventHandler;
  // onOpenChange?: OpenEventHandler;
  // rootPrefixCls?: string;
  // eventKey?: string;
  // multiple?: boolean;
  // active?: boolean; // TODO: remove
  // onItemHover?: HoverEventHandler;
  // onSelect?: SelectEventHandler;
  // triggerSubMenuAction?: TriggerSubMenuAction;
  // onDeselect?: SelectEventHandler;
  // onDestroy?: DestroyEventHandler;
  // onMouseEnter?: MenuHoverEventHandler;
  // onMouseLeave?: MenuHoverEventHandler;
  // onTitleMouseEnter?: MenuHoverEventHandler;
  // onTitleMouseLeave?: MenuHoverEventHandler;
  // onTitleClick?: (info: {
  //   key: React.Key;
  //   domEvent: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>;
  // }) => void;
  // popupOffset?: number[];
  // isOpen?: boolean;
  // store?: MiniStore;
  // mode?: MenuMode;
  // manualRef?: LegacyFunctionRef;
  // itemIcon?: RenderIconType;
  // expandIcon?: RenderIconType;
  // inlineIndent?: number;
  // level?: number;
  // subMenuOpenDelay?: number;
  // subMenuCloseDelay?: number;
  // forceSubMenuRender?: boolean;
  // builtinPlacements?: BuiltinPlacements;
  // disabled?: boolean;
  // className?: string;
  // popupClassName?: string;
  // motion?: CSSMotionProps;
  // direction?: 'ltr' | 'rtl';
}

export default function SubMenu({ children }: SubMenuProps) {
  const { prefixCls } = React.useContext(MenuContext);
  const itemCls = `${prefixCls}-submenu`;

  return (
    <Overflow.Item component="li" className={itemCls} role="menuitem">
      {children}
    </Overflow.Item>
  );
}
