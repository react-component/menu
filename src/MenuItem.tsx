import * as React from 'react';
import { MenuContext } from './Menu';

export interface MenuItemProps
  extends Omit<
    React.HTMLAttributes<HTMLLIElement>,
    'onClick' | 'onMouseEnter' | 'onMouseLeave' | 'onSelect'
  > {
  children?: React.ReactNode;

  /** @deprecated No place to use this. Should remove */
  // attribute?: Record<string, string>;
  // rootPrefixCls?: string;
  // eventKey?: React.Key;
  // className?: string;
  // style?: React.CSSProperties;
  // active?: boolean;
  // selectedKeys?: string[];
  // disabled?: boolean;
  // title?: string;
  // onItemHover?: HoverEventHandler;
  // onSelect?: SelectEventHandler;
  // onClick?: MenuClickEventHandler;
  // onDeselect?: SelectEventHandler;
  // parentMenu?: React.ReactInstance;
  // onDestroy?: DestroyEventHandler;
  // onMouseEnter?: MenuHoverEventHandler;
  // onMouseLeave?: MenuHoverEventHandler;
  // multiple?: boolean;
  // isSelected?: boolean;
  // manualRef?: LegacyFunctionRef;
  // itemIcon?: RenderIconType;
  // role?: string;
  // mode?: MenuMode;
  // inlineIndent?: number;
  // level?: number;
  // direction?: 'ltr' | 'rtl';
}

const MenuItem: React.FC<MenuItemProps> = ({ children }) => {
  const { prefixCls } = React.useContext(MenuContext);
  const itemCls = `${prefixCls}-item`;

  return (
    <li className={itemCls} role="menuitem">
      {children}
    </li>
  );
};

export default MenuItem;
