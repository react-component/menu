import * as React from 'react';
import { clsx } from 'clsx';
import Overflow from 'rc-overflow';
import warning from '@rc-component/util/lib/warning';
import SubMenuList from './SubMenuList';
import { parseChildren } from '../utils/commonUtil';
import type { MenuInfo, SubMenuType, PopupRender } from '../interface';
import MenuContextProvider, { MenuContext } from '../context/MenuContext';
import useMemoCallback from '../hooks/useMemoCallback';
import PopupTrigger from './PopupTrigger';
import Icon from '../Icon';
import useActive from '../hooks/useActive';
import { warnItemProp } from '../utils/warnUtil';
import useDirectionStyle from '../hooks/useDirectionStyle';
import InlineSubMenuList from './InlineSubMenuList';
import {
  PathTrackerContext,
  PathUserContext,
  useFullPath,
  useMeasure,
} from '../context/PathContext';
import { useMenuId } from '../context/IdContext';
import PrivateContext from '../context/PrivateContext';

export type SemanticName = 'list' | 'listTitle';
export interface SubMenuProps extends Omit<SubMenuType, 'key' | 'children' | 'label'> {
  classNames?: Partial<Record<SemanticName, string>>;
  styles?: Partial<Record<SemanticName, React.CSSProperties>>;
  title?: React.ReactNode;

  children?: React.ReactNode;

  /** @private Used for rest popup. Do not use in your prod */
  internalPopupClose?: boolean;

  /** @private Internal filled key. Do not set it directly */
  eventKey?: string;

  /** @private Do not use. Private warning empty usage */
  warnKey?: boolean;
  popupRender?: PopupRender;
  // >>>>>>>>>>>>>>>>>>>>> Next  Round <<<<<<<<<<<<<<<<<<<<<<<
  // onDestroy?: DestroyEventHandler;
}

const InternalSubMenu = React.forwardRef<HTMLLIElement, SubMenuProps>((props, ref) => {
  const {
    style,
    className,

    styles,
    classNames: menuClassNames,

    title,
    eventKey,
    warnKey,

    disabled,
    internalPopupClose,

    children,

    // Icons
    itemIcon,
    expandIcon,

    // Popup
    popupClassName,
    popupOffset,
    popupStyle,

    // Events
    onClick,
    onMouseEnter,
    onMouseLeave,
    onTitleClick,
    onTitleMouseEnter,
    onTitleMouseLeave,
    popupRender: propsPopupRender,
    ...restProps
  } = props;

  const domDataId = useMenuId(eventKey);

  const {
    prefixCls,
    mode,
    openKeys,

    // Disabled
    disabled: contextDisabled,
    overflowDisabled,

    // ActiveKey
    activeKey,

    // SelectKey
    selectedKeys,

    // Icon
    itemIcon: contextItemIcon,
    expandIcon: contextExpandIcon,

    // Events
    onItemClick,
    onOpenChange,

    onActive,
    popupRender: contextPopupRender,
  } = React.useContext(MenuContext);

  const { _internalRenderSubMenuItem } = React.useContext(PrivateContext);

  const { isSubPathKey } = React.useContext(PathUserContext);
  const connectedPath = useFullPath();

  const subMenuPrefixCls = `${prefixCls}-submenu`;
  const mergedDisabled = contextDisabled || disabled;
  const elementRef = React.useRef<HTMLDivElement>();
  const popupRef = React.useRef<HTMLUListElement>();

  // ================================ Warn ================================
  if (process.env.NODE_ENV !== 'production' && warnKey) {
    warning(false, 'SubMenu should not leave undefined `key`.');
  }

  // ================================ Icon ================================
  const mergedItemIcon = itemIcon ?? contextItemIcon;
  const mergedExpandIcon = expandIcon ?? contextExpandIcon;

  // ================================ Open ================================
  const originOpen = openKeys.includes(eventKey);
  const open = !overflowDisabled && originOpen;

  // =============================== Select ===============================
  const childrenSelected = isSubPathKey(selectedKeys, eventKey);

  // =============================== Active ===============================
  const { active, ...activeProps } = useActive(
    eventKey,
    mergedDisabled,
    onTitleMouseEnter,
    onTitleMouseLeave,
  );

  // Fallback of active check to avoid hover on menu title or disabled item
  const [childrenActive, setChildrenActive] = React.useState(false);

  const triggerChildrenActive = (newActive: boolean) => {
    if (!mergedDisabled) {
      setChildrenActive(newActive);
    }
  };

  const onInternalMouseEnter: React.MouseEventHandler<HTMLLIElement> = domEvent => {
    triggerChildrenActive(true);

    onMouseEnter?.({
      key: eventKey,
      domEvent,
    });
  };

  const onInternalMouseLeave: React.MouseEventHandler<HTMLLIElement> = domEvent => {
    triggerChildrenActive(false);

    onMouseLeave?.({
      key: eventKey,
      domEvent,
    });
  };

  const mergedActive = React.useMemo(() => {
    if (active) {
      return active;
    }

    if (mode !== 'inline') {
      return childrenActive || isSubPathKey([activeKey], eventKey);
    }

    return false;
  }, [mode, active, activeKey, childrenActive, eventKey, isSubPathKey]);

  // ========================== DirectionStyle ==========================
  const directionStyle = useDirectionStyle(connectedPath.length);

  // =============================== Events ===============================
  // >>>> Title click
  const onInternalTitleClick: React.MouseEventHandler<HTMLElement> = e => {
    // Skip if disabled
    if (mergedDisabled) {
      return;
    }

    onTitleClick?.({
      key: eventKey,
      domEvent: e,
    });

    // Trigger open by click when mode is `inline`
    if (mode === 'inline') {
      onOpenChange(eventKey, !originOpen);
    }
  };

  // >>>> Context for children click
  const onMergedItemClick = useMemoCallback((info: MenuInfo) => {
    onClick?.(warnItemProp(info));
    onItemClick(info);
  });

  // >>>>> Visible change
  const onPopupVisibleChange = (newVisible: boolean) => {
    if (mode !== 'inline') {
      onOpenChange(eventKey, newVisible);
    }
  };

  /**
   * Used for accessibility. Helper will focus element without key board.
   * We should manually trigger an active
   */
  const onInternalFocus: React.FocusEventHandler<HTMLDivElement> = () => {
    onActive(eventKey);
  };

  // =============================== Render ===============================
  const popupId = domDataId && `${domDataId}-popup`;

  const expandIconNode = React.useMemo(
    () => (
      <Icon
        icon={mode !== 'horizontal' ? mergedExpandIcon : undefined}
        props={{
          ...props,
          isOpen: open,
          // [Legacy] Not sure why need this mark
          isSubMenu: true,
        }}
      >
        <i className={`${subMenuPrefixCls}-arrow`} />
      </Icon>
    ),
    [mode, mergedExpandIcon, props, open, subMenuPrefixCls],
  );

  // >>>>> Title
  let titleNode: React.ReactElement = (
    <div
      role="menuitem"
      style={directionStyle}
      className={`${subMenuPrefixCls}-title`}
      tabIndex={mergedDisabled ? null : -1}
      ref={elementRef}
      title={typeof title === 'string' ? title : null}
      data-menu-id={overflowDisabled && domDataId ? null : domDataId}
      aria-expanded={open}
      aria-haspopup
      aria-controls={popupId}
      aria-disabled={mergedDisabled}
      onClick={onInternalTitleClick}
      onFocus={onInternalFocus}
      {...activeProps}
    >
      {title}

      {/* Only non-horizontal mode shows the icon */}
      {expandIconNode}
    </div>
  );

  // Cache mode if it change to `inline` which do not have popup motion
  const triggerModeRef = React.useRef(mode);
  if (mode !== 'inline' && connectedPath.length > 1) {
    triggerModeRef.current = 'vertical';
  } else {
    triggerModeRef.current = mode;
  }
  const popupContentTriggerMode = triggerModeRef.current;
  const renderPopupContent = React.useMemo(() => {
    const originNode = (
      <MenuContextProvider
        classNames={menuClassNames}
        styles={styles}
        mode={popupContentTriggerMode === 'horizontal' ? 'vertical' : popupContentTriggerMode}
      >
        <SubMenuList id={popupId} ref={popupRef}>
          {children}
        </SubMenuList>
      </MenuContextProvider>
    );
    const mergedPopupRender = propsPopupRender || contextPopupRender;
    if (mergedPopupRender) {
      const node = mergedPopupRender(originNode, {
        item: props,
        keys: connectedPath,
      });
      return node;
    }
    return originNode;
  }, [
    propsPopupRender,
    contextPopupRender,
    connectedPath,
    popupId,
    children,
    props,
    popupContentTriggerMode,
  ]);

  if (!overflowDisabled) {
    const triggerMode = triggerModeRef.current;

    // Still wrap with Trigger here since we need avoid react re-mount dom node
    // Which makes motion failed
    titleNode = (
      <PopupTrigger
        mode={triggerMode}
        prefixCls={subMenuPrefixCls}
        visible={!internalPopupClose && open && mode !== 'inline'}
        popupClassName={popupClassName}
        popupOffset={popupOffset}
        popupStyle={popupStyle}
        popup={renderPopupContent}
        disabled={mergedDisabled}
        onVisibleChange={onPopupVisibleChange}
      >
        {titleNode}
      </PopupTrigger>
    );
  }

  // >>>>> List node
  let listNode = (
    <Overflow.Item
      ref={ref}
      role="none"
      {...restProps}
      component="li"
      style={style}
      className={clsx(subMenuPrefixCls, `${subMenuPrefixCls}-${mode}`, className, {
        [`${subMenuPrefixCls}-open`]: open,
        [`${subMenuPrefixCls}-active`]: mergedActive,
        [`${subMenuPrefixCls}-selected`]: childrenSelected,
        [`${subMenuPrefixCls}-disabled`]: mergedDisabled,
      })}
      onMouseEnter={onInternalMouseEnter}
      onMouseLeave={onInternalMouseLeave}
    >
      {titleNode}

      {/* Inline mode */}
      {!overflowDisabled && (
        <InlineSubMenuList id={popupId} open={open} keyPath={connectedPath}>
          {children}
        </InlineSubMenuList>
      )}
    </Overflow.Item>
  );

  if (_internalRenderSubMenuItem) {
    listNode = _internalRenderSubMenuItem(listNode, props, {
      selected: childrenSelected,
      active: mergedActive,
      open,
      disabled: mergedDisabled,
    });
  }

  // >>>>> Render
  return (
    <MenuContextProvider
      classNames={menuClassNames}
      styles={styles}
      onItemClick={onMergedItemClick}
      mode={mode === 'horizontal' ? 'vertical' : mode}
      itemIcon={mergedItemIcon}
      expandIcon={mergedExpandIcon}
    >
      {listNode}
    </MenuContextProvider>
  );
});

const SubMenu = React.forwardRef<HTMLLIElement, SubMenuProps>((props, ref) => {
  const { eventKey, children } = props;

  const connectedKeyPath = useFullPath(eventKey);
  const childList: React.ReactElement[] = parseChildren(children, connectedKeyPath);

  // ==================== Record KeyPath ====================
  const measure = useMeasure();

  // eslint-disable-next-line consistent-return
  React.useEffect(() => {
    if (measure) {
      measure.registerPath(eventKey, connectedKeyPath);

      return () => {
        measure.unregisterPath(eventKey, connectedKeyPath);
      };
    }
  }, [connectedKeyPath]);

  let renderNode: React.ReactNode;

  // ======================== Render ========================
  if (measure) {
    renderNode = childList;
  } else {
    renderNode = (
      <InternalSubMenu ref={ref} {...props}>
        {childList}
      </InternalSubMenu>
    );
  }

  return (
    <PathTrackerContext.Provider value={connectedKeyPath}>{renderNode}</PathTrackerContext.Provider>
  );
});

if (process.env.NODE_ENV !== 'production') {
  SubMenu.displayName = 'SubMenu';
}

export default SubMenu;
