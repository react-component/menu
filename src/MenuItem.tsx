import * as React from 'react';
import classNames from 'classnames';
import Overflow from 'rc-overflow';
import type { MenuClickEventHandler, MenuInfo } from './interface';
import type { MenuContextProps } from './context';
import { MenuContext } from './context';

export interface MenuItemProps
  extends Omit<
    React.HTMLAttributes<HTMLLIElement>,
    'onClick' | 'onMouseEnter' | 'onMouseLeave' | 'onSelect'
  > {
  children?: React.ReactNode;

  /** @private Internal filled key. Do not set it directly */
  eventKey?: string;

  disabled?: boolean;

  // >>>>> Events
  onClick?: MenuClickEventHandler;

  /** @deprecated No place to use this. Should remove */
  // attribute?: Record<string, string>;
  // rootPrefixCls?: string;
  // active?: boolean;
  // selectedKeys?: string[];
  // title?: string;
  // onItemHover?: HoverEventHandler;
  // onSelect?: SelectEventHandler;

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
  // inlineIndent?: number;
  // level?: number;
  // direction?: 'ltr' | 'rtl';

  // No need anymore
  // mode?: MenuMode;
}

// Since Menu event provide the `info.item` which point to the MenuItem node instance.
// We have to use class component here.
// This should be removed from doc & api in future.
export default class MenuItem extends React.Component<MenuItemProps> {
  context: MenuContextProps;
  static contextType = MenuContext;

  getEventInfo = (e: React.MouseEvent<HTMLElement>): MenuInfo => {
    const { parentKeys } = this.context;
    //   key: React.Key;
    // keyPath: React.Key[];
    // /** @deprecated This will not support in future. You should avoid to use this */
    // item: React.ReactInstance;
    // domEvent: React.MouseEvent<HTMLElement>;
    const { eventKey } = this.props;
    return {
      key: eventKey,
      keyPath: [...parentKeys, eventKey],
      item: this,
      domEvent: e,
    };
  };

  onClick: React.MouseEventHandler<HTMLLIElement> = e => {
    const { onClick } = this.props;
    const { onItemClick } = this.context;

    const info = this.getEventInfo(e);

    onClick?.(info);
    onItemClick(info);
  };

  render() {
    const { children, className, eventKey, ...restProps } = this.props;
    const { prefixCls } = this.context;
    const itemCls = `${prefixCls}-item`;

    return (
      <Overflow.Item
        {...restProps}
        component="li"
        className={classNames(itemCls, className)}
        role="menuitem"
        onClick={this.onClick}
      >
        {children}
      </Overflow.Item>
    );
  }
}
