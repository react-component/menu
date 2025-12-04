import { clsx } from 'clsx';
import Overflow from 'rc-overflow';
import KeyCode from '@rc-component/util/lib/KeyCode';
import omit from '@rc-component/util/lib/omit';
import { useComposeRef } from '@rc-component/util/lib/ref';
import warning from '@rc-component/util/lib/warning';
import * as React from 'react';
import { useMenuId } from './context/IdContext';
import { MenuContext } from './context/MenuContext';
import { useFullPath, useMeasure } from './context/PathContext';
import PrivateContext from './context/PrivateContext';
import useActive from './hooks/useActive';
import useDirectionStyle from './hooks/useDirectionStyle';
import Icon from './Icon';
import type { MenuInfo, MenuItemType } from './interface';
import { warnItemProp } from './utils/warnUtil';

export interface MenuItemProps
  extends Omit<MenuItemType, 'label' | 'key' | 'ref'>,
    Omit<
      React.HTMLAttributes<HTMLLIElement>,
      'onClick' | 'onMouseEnter' | 'onMouseLeave' | 'onSelect'
    > {
  children?: React.ReactNode;

  /** @private Internal filled key. Do not set it directly */
  eventKey?: string;

  /** @private Do not use. Private warning empty usage */
  warnKey?: boolean;

  /** @deprecated No place to use this. Should remove */
  attribute?: Record<string, string>;
}

// Since Menu event provide the `info.item` which point to the MenuItem node instance.
// We have to use class component here.
// This should be removed from doc & api in future.
class LegacyMenuItem extends React.Component<any> {
  render() {
    const { title, attribute, elementRef, ...restProps } = this.props;

    // Here the props are eventually passed to the DOM element.
    // React does not recognize non-standard attributes.
    // Therefore, remove the props that is not used here.
    // ref: https://github.com/ant-design/ant-design/issues/41395
    const passedProps = omit(restProps, [
      'eventKey',
      'popupClassName',
      'popupOffset',
      'onTitleClick',
    ]);
    warning(!attribute, '`attribute` of Menu.Item is deprecated. Please pass attribute directly.');

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
const InternalMenuItem = React.forwardRef((props: MenuItemProps, ref: React.Ref<HTMLElement>) => {
  const {
    style,
    className,

    eventKey,
    warnKey,
    disabled,
    itemIcon,
    children,

    // Aria
    role,

    // Active
    onMouseEnter,
    onMouseLeave,

    onClick,
    onKeyDown,

    onFocus,

    ...restProps
  } = props;

  const domDataId = useMenuId(eventKey);

  const {
    prefixCls,
    onItemClick,

    disabled: contextDisabled,
    overflowDisabled,

    // Icon
    itemIcon: contextItemIcon,

    // Select
    selectedKeys,

    // Active
    onActive,
  } = React.useContext(MenuContext);

  const { _internalRenderMenuItem } = React.useContext(PrivateContext);

  const itemCls = `${prefixCls}-item`;

  const legacyMenuItemRef = React.useRef<any>();
  const elementRef = React.useRef<HTMLLIElement>();
  const mergedDisabled = contextDisabled || disabled;

  const mergedEleRef = useComposeRef(ref, elementRef);

  const connectedKeys = useFullPath(eventKey);

  // ================================ Warn ================================
  if (process.env.NODE_ENV !== 'production' && warnKey) {
    warning(false, 'MenuItem should not leave undefined `key`.');
  }

  // ============================= Info =============================
  const getEventInfo = (
    e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
  ): MenuInfo => {
    return {
      key: eventKey,
      // Note: For legacy code is reversed which not like other antd component
      keyPath: [...connectedKeys].reverse(),
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
  const directionStyle = useDirectionStyle(connectedKeys.length);

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

    if (e.which === KeyCode.ENTER) {
      const info = getEventInfo(e);

      // Legacy. Key will also trigger click event
      onClick?.(warnItemProp(info));
      onItemClick(info);
    }
  };

  /**
   * Used for accessibility. Helper will focus element without key board.
   * We should manually trigger an active
   */
  const onInternalFocus: React.FocusEventHandler<HTMLLIElement> = e => {
    onActive(eventKey);
    onFocus?.(e);
  };

  // ============================ Render ============================
  const optionRoleProps: React.HTMLAttributes<HTMLDivElement> = {};

  if (props.role === 'option') {
    optionRoleProps['aria-selected'] = selected;
  }

  let renderNode = (
    <LegacyMenuItem
      ref={legacyMenuItemRef}
      elementRef={mergedEleRef}
      role={role === null ? 'none' : role || 'menuitem'}
      tabIndex={disabled ? null : -1}
      data-menu-id={overflowDisabled && domDataId ? null : domDataId}
      {...omit(restProps, ['extra'])}
      {...activeProps}
      {...optionRoleProps}
      component="li"
      aria-disabled={disabled}
      style={{
        ...directionStyle,
        ...style,
      }}
      className={clsx(
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
      onFocus={onInternalFocus}
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

  if (_internalRenderMenuItem) {
    renderNode = _internalRenderMenuItem(renderNode, props, { selected });
  }

  return renderNode;
});

function MenuItem(props: MenuItemProps, ref: React.Ref<HTMLElement>): React.ReactElement {
  const { eventKey } = props;

  // ==================== Record KeyPath ====================
  const measure = useMeasure();
  const connectedKeyPath = useFullPath(eventKey);

  // eslint-disable-next-line consistent-return
  React.useEffect(() => {
    if (measure) {
      measure.registerPath(eventKey, connectedKeyPath);

      return () => {
        measure.unregisterPath(eventKey, connectedKeyPath);
      };
    }
  }, [connectedKeyPath]);

  if (measure) {
    return null;
  }

  // ======================== Render ========================
  return <InternalMenuItem {...props} ref={ref} />;
}

export default React.forwardRef(MenuItem);
