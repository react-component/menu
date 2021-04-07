import * as React from 'react';
import classNames from 'classnames';
import Overflow from 'rc-overflow';
import { MenuContext } from './Menu';
import SubMenuList from './SubMenuList';

export interface SubMenuProps {
  title?: React.ReactNode;
  children?: React.ReactNode;

  // parentMenu?: React.ReactElement & {
  //   isRootMenu: boolean;
  //   subMenuInstance: React.ReactInstance;
  // };

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

export default function SubMenu({ title, children }: SubMenuProps) {
  const { prefixCls, mode } = React.useContext(MenuContext);
  const subMenuPrefixCls = `${prefixCls}-submenu`;

  // =============================== Render ===============================
  const subListNode = <SubMenuList>{children}</SubMenuList>;

  return (
    <Overflow.Item
      component="li"
      className={classNames(subMenuPrefixCls, `${subMenuPrefixCls}-${mode}`)}
      role="menuitem"
    >
      <div
        className={`${subMenuPrefixCls}-title`}
        role="button"
        aria-expanded
        aria-haspopup
      >
        {title}
      </div>
      {mode === 'inline' && subListNode}
    </Overflow.Item>
  );
}
