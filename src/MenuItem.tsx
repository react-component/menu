import * as React from 'react';
import classNames from 'classnames';
import Overflow from 'rc-overflow';
import warning from 'rc-util/lib/warning';
import KeyCode from 'rc-util/lib/KeyCode';
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

  // >>>>>>>>>>>>>> Next round
  // onDestroy?: DestroyEventHandler;
}

// Since Menu event provide the `info.item` which point to the MenuItem node instance.
// We have to use class component here.
// This should be removed from doc & api in future.
class LegacyMenuItem extends React.Component<any> {
  render() {
    const { title, attribute, elementRef, ...restProps } = this.props;

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
        ref={elementRef}
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
    onKeyDown,

    ...restProps
  } = props;

  const {
    prefixCls,
    onItemClick,
    parentKeys,

    disabled: contextDisabled,

    // Icon
    itemIcon: contextItemIcon,

    // Select
    selectedKeys,

    // Path
    registerPath,
    unregisterPath,
  } = React.useContext(MenuContext);
  const itemCls = `${prefixCls}-item`;

  const legacyMenuItemRef = React.useRef<any>();
  const elementRef = React.useRef<HTMLLIElement>();
  const mergedDisabled = contextDisabled || disabled;

  // ============================= Key ==============================
  const connectedKeys = React.useMemo(() => [...parentKeys, eventKey], [
    parentKeys,
    eventKey,
  ]);

  // ============================= Info =============================
  const getEventInfo = (
    e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
  ): MenuInfo => {
    return {
      key: eventKey,
      keyPath: connectedKeys,
      item: legacyMenuItemRef.current,
      domEvent: e,
    };
  };

  // ============================= Icon =============================
  const mergedItemIcon = itemIcon || contextItemIcon;

  // ============================ Active ============================
  const { active, ...activeProps } = useActive(
    eventKey,
    mergedDisabled,
    onMouseEnter,
    onMouseLeave,
  );

  // ============================ Select ============================
  const selected = selectedKeys.includes(eventKey);

  // ======================== DirectionStyle ========================
  const directionStyle = useDirectionStyle(connectedKeys);

  // ============================ Events ============================
  const onInternalClick: React.MouseEventHandler<HTMLLIElement> = e => {
    if (mergedDisabled) {
      return;
    }

    const info = getEventInfo(e);

    onClick?.(warnItemProp(info));
    onItemClick(info);
  };

  const onInternalKeyDown: React.KeyboardEventHandler<HTMLLIElement> = e => {
    onKeyDown?.(e);

    if ([KeyCode.ENTER, KeyCode.SPACE].includes(e.which)) {
      onItemClick(warnItemProp(getEventInfo(e)));
    }
  };

  // ============================ Effect ============================
  // Path register
  React.useEffect(() => {
    const element = elementRef.current;
    registerPath(eventKey, connectedKeys, element);

    return () => {
      unregisterPath(eventKey, connectedKeys, element);
    };
  }, [eventKey, connectedKeys]);

  // ============================ Render ============================
  const optionRoleProps: React.HTMLAttributes<HTMLDivElement> = {};

  if (props.role === 'option') {
    optionRoleProps['aria-selected'] = selected;
  }

  return (
    <LegacyMenuItem
      ref={legacyMenuItemRef}
      elementRef={elementRef}
      role="menuitem"
      tabIndex={disabled ? null : -1}
      {...restProps}
      {...activeProps}
      {...optionRoleProps}
      component="li"
      aria-disabled={disabled}
      style={{
        ...directionStyle,
        ...style,
      }}
      className={classNames(
        itemCls,
        {
          [`${itemCls}-active`]: active,
          [`${itemCls}-selected`]: selected,
          [`${itemCls}-disabled`]: mergedDisabled,
        },
        className,
      )}
      onClick={onInternalClick}
      onKeyDown={onInternalKeyDown}
    >
      {children}
      <Icon
        props={{
          ...props,
          isSelected: selected,
        }}
        icon={mergedItemIcon}
      />
    </LegacyMenuItem>
  );
};

export default MenuItem;
