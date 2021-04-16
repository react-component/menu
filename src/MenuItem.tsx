import * as React from 'react';
import classNames from 'classnames';
import Overflow from 'rc-overflow';
import warning from 'rc-util/lib/warning';
import omit from 'rc-util/lib/omit';
import type {
  MenuClickEventHandler,
  MenuInfo,
  MenuHoverEventHandler,
  RenderIconType,
} from './interface';
import { MenuContext } from './context';
import useActive from './hooks/useActive';
import { warnItemProp } from './utils/warnUtil';
import Icon from './Icon';
import useDirectionStyle from './hooks/useDirectionStyle';

export interface MenuItemProps
  extends Omit<
    React.HTMLAttributes<HTMLLIElement>,
    'onClick' | 'onMouseEnter' | 'onMouseLeave' | 'onSelect'
  > {
  children?: React.ReactNode;

  /** @private Internal filled key. Do not set it directly */
  eventKey?: string;

  disabled?: boolean;

  itemIcon?: RenderIconType;

  /** @deprecated No place to use this. Should remove */
  attribute?: Record<string, string>;

  // >>>>> Active
  onMouseEnter?: MenuHoverEventHandler;
  onMouseLeave?: MenuHoverEventHandler;

  // >>>>> Events
  onClick?: MenuClickEventHandler;

  // manualRef?: LegacyFunctionRef;

  // direction?: 'ltr' | 'rtl';

  // No need anymore
  // mode?: MenuMode;

  // >>>>>>>>>>>>>> Next round
  // onDestroy?: DestroyEventHandler;

  // >>>>>>>>>>>>>> Useless props
  // rootPrefixCls?: string;
  // active?: boolean;
  // selectedKeys?: string[];
}

// Since Menu event provide the `info.item` which point to the MenuItem node instance.
// We have to use class component here.
// This should be removed from doc & api in future.
class LegacyMenuItem extends React.Component<any> {
  render() {
    const { title, attribute, ...restProps } = this.props;

    const passedProps = omit(restProps, ['eventKey']);
    warning(
      !attribute,
      '`attribute` of Menu.Item is deprecated. Please pass attribute directly.',
    );

    return (
      <Overflow.Item
        {...attribute}
        title={typeof title === 'string' ? title : undefined}
        {...passedProps}
      />
    );
  }
}

/**
 * Real Menu Item component
 */
const MenuItem = (props: MenuItemProps) => {
  const {
    style,
    className,

    eventKey,
    disabled,
    itemIcon,
    children,

    // Active
    onMouseEnter,
    onMouseLeave,

    onClick,
  } = props;

  const {
    prefixCls,
    onItemClick,
    parentKeys,

    // Select
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

  // ======================== DirectionStyle ========================
  const directionStyle = useDirectionStyle(connectedKeys);

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
      role="menuitem"
      {...props}
      {...activeProps}
      component="li"
      style={{
        ...directionStyle,
        ...style,
      }}
      className={classNames(itemCls, className, {
        [`${itemCls}-active`]: active,
        [`${itemCls}-selected`]: selected,
        [`${itemCls}-disabled`]: disabled,
      })}
      onClick={onInternalClick}
    >
      {children}
      <Icon props={props} icon={itemIcon} />
    </LegacyMenuItem>
  );
};

export default MenuItem;
