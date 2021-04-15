import * as React from 'react';
import classNames from 'classnames';
import Overflow from 'rc-overflow';
import omit from 'rc-util/lib/omit';
import type {
  MenuClickEventHandler,
  MenuInfo,
  MenuHoverEventHandler,
} from './interface';
import { MenuContext } from './context';
import useActive from './hooks/useActive';

export interface MenuItemProps
  extends Omit<
    React.HTMLAttributes<HTMLLIElement>,
    'onClick' | 'onMouseEnter' | 'onMouseLeave' | 'onSelect'
  > {
  children?: React.ReactNode;

  /** @private Internal filled key. Do not set it directly */
  eventKey?: string;

  disabled?: boolean;

  // >>>>> Active
  onMouseEnter?: MenuHoverEventHandler;
  onMouseLeave?: MenuHoverEventHandler;

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
class LegacyMenuItem extends React.Component<any> {
  render() {
    const passedProps = omit(this.props, ['eventKey']);
    return <Overflow.Item {...passedProps} />;
  }
}

/**
 * Real Menu Item component
 */
const MenuItem = (props: MenuItemProps) => {
  const {
    children,
    className,
    eventKey,
    disabled,
    // >>>>> Active
    onMouseEnter,
    onMouseLeave,

    onClick,
  } = props;
  const { prefixCls, onItemClick, parentKeys } = React.useContext(MenuContext);
  const itemCls = `${prefixCls}-item`;

  const legacyMenuItemRef = React.useRef<any>();

  // ============================= Misc =============================
  const getEventInfo = (e: React.MouseEvent<HTMLElement>): MenuInfo => {
    return {
      key: eventKey,
      keyPath: [...parentKeys, eventKey],
      item: legacyMenuItemRef.current,
      domEvent: e,
    };
  };

  // ============================ Active ============================
  const { active, ...activeProps } = useActive(
    eventKey,
    disabled,
    onMouseEnter,
    onMouseLeave,
  );

  // ============================ Events ============================
  const onInternalClick: React.MouseEventHandler<HTMLLIElement> = e => {
    const info = getEventInfo(e);

    onClick?.(info);
    onItemClick(info);
  };

  // ============================ Render ============================
  return (
    <LegacyMenuItem
      ref={legacyMenuItemRef}
      {...props}
      {...activeProps}
      component="li"
      className={classNames(itemCls, className, {
        [`${itemCls}-active`]: active,
      })}
      role="menuitem"
      onClick={onInternalClick}
    >
      {children}
    </LegacyMenuItem>
  );
};

export default MenuItem;
