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
import { warnItemProp } from './utils/warnUtil';

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

  const {
    prefixCls,
    onItemClick,
    parentKeys,
    selectedKeys,
    // Path
    registerPath,
    unregisterPath,
  } = React.useContext(MenuContext);
  const itemCls = `${prefixCls}-item`;

  const legacyMenuItemRef = React.useRef<any>();

  // ============================= Key ==============================
  const connectedKeys = React.useMemo(() => [...parentKeys, eventKey], [
    parentKeys,
    eventKey,
  ]);

  // ============================= Info =============================
  const getEventInfo = (e: React.MouseEvent<HTMLElement>): MenuInfo => {
    return {
      key: eventKey,
      keyPath: connectedKeys,
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

  // ============================ Select ============================
  const selected = selectedKeys.includes(eventKey);

  // ============================ Events ============================
  const onInternalClick: React.MouseEventHandler<HTMLLIElement> = e => {
    if (disabled) {
      return;
    }

    const info = getEventInfo(e);

    onClick?.(warnItemProp(info));
    onItemClick(info);
  };

  // ============================ Effect ============================
  // Path register
  React.useEffect(() => {
    registerPath(eventKey, connectedKeys);

    return () => {
      unregisterPath(eventKey, connectedKeys);
    };
  }, [eventKey, connectedKeys]);

  // ============================ Render ============================
  return (
    <LegacyMenuItem
      ref={legacyMenuItemRef}
      {...props}
      {...activeProps}
      component="li"
      className={classNames(itemCls, className, {
        [`${itemCls}-active`]: active,
        [`${itemCls}-selected`]: selected,
        [`${itemCls}-disabled`]: disabled,
      })}
      role="menuitem"
      onClick={onInternalClick}
    >
      {children}
    </LegacyMenuItem>
  );
};

export default MenuItem;
