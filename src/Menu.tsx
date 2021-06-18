import * as React from 'react';
import type { CSSMotionProps } from 'rc-motion';
import classNames from 'classnames';
import shallowEqual from 'shallowequal';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import warning from 'rc-util/lib/warning';
import Overflow from 'rc-overflow';
import type {
  BuiltinPlacements,
  MenuClickEventHandler,
  MenuInfo,
  MenuMode,
  SelectEventHandler,
  TriggerSubMenuAction,
  SelectInfo,
  RenderIconType,
} from './interface';
import MenuItem from './MenuItem';
import { parseChildren } from './utils/nodeUtil';
import MenuContextProvider from './context/MenuContext';
import useMemoCallback from './hooks/useMemoCallback';
import { warnItemProp } from './utils/warnUtil';
import SubMenu from './SubMenu';
import useAccessibility from './hooks/useAccessibility';
import useUUID from './hooks/useUUID';
import { PathRegisterContext, PathUserContext } from './context/PathContext';
import useKeyRecords, { OVERFLOW_KEY } from './hooks/useKeyRecords';
import { IdContext } from './context/IdContext';

/**
 * Menu modify after refactor:
 * ## Add
 * - disabled
 *
 * ## Remove
 * - openTransitionName
 * - openAnimation
 * - onDestroy
 * - siderCollapsed: Seems antd do not use this prop (Need test in antd)
 * - collapsedWidth: Seems this logic should be handle by antd Layout.Sider
 */

// optimize for render
const EMPTY_LIST: string[] = [];

export interface MenuProps
  extends Omit<
    React.HTMLAttributes<HTMLUListElement>,
    'onClick' | 'onSelect' | 'dir'
  > {
  prefixCls?: string;

  children?: React.ReactNode;

  disabled?: boolean;
  /** @private Disable auto overflow. Pls note the prop name may refactor since we do not final decided. */
  disabledOverflow?: boolean;

  /** direction of menu */
  direction?: 'ltr' | 'rtl';

  // Mode
  mode?: MenuMode;
  inlineCollapsed?: boolean;

  // Open control
  defaultOpenKeys?: string[];
  openKeys?: string[];

  // Active control
  activeKey?: string;
  defaultActiveFirst?: boolean;

  // Selection
  selectable?: boolean;
  multiple?: boolean;

  defaultSelectedKeys?: string[];
  selectedKeys?: string[];

  onSelect?: SelectEventHandler;
  onDeselect?: SelectEventHandler;

  // Level
  inlineIndent?: number;

  // Motion
  /** Menu motion define. Use `defaultMotions` if you need config motion of each mode */
  motion?: CSSMotionProps;
  /** Default menu motion of each mode */
  defaultMotions?: Partial<{ [key in MenuMode | 'other']: CSSMotionProps }>;

  // Popup
  subMenuOpenDelay?: number;
  subMenuCloseDelay?: number;
  forceSubMenuRender?: boolean;
  triggerSubMenuAction?: TriggerSubMenuAction;
  builtinPlacements?: BuiltinPlacements;

  // Icon
  itemIcon?: RenderIconType;
  expandIcon?: RenderIconType;
  overflowedIndicator?: React.ReactNode;
  /** @private Internal usage. Do not use in your production. */
  overflowedIndicatorPopupClassName?: string;

  // >>>>> Function
  getPopupContainer?: (node: HTMLElement) => HTMLElement;

  // >>>>> Events
  onClick?: MenuClickEventHandler;
  onOpenChange?: (openKeys: React.Key[]) => void;
}

interface LegacyMenuProps extends MenuProps {
  openTransitionName?: string;
  openAnimation?: string;
}

const Menu: React.FC<MenuProps> = props => {
  const {
    prefixCls = 'rc-menu',
    style,
    className,
    tabIndex = 0,
    children,
    direction,

    id,

    // Mode
    mode = 'vertical',
    inlineCollapsed,

    // Disabled
    disabled,
    disabledOverflow,

    // Open
    subMenuOpenDelay = 0.1,
    subMenuCloseDelay = 0.1,
    forceSubMenuRender,
    defaultOpenKeys,
    openKeys,

    // Active
    activeKey,
    defaultActiveFirst,

    // Selection
    selectable = true,
    multiple = false,
    defaultSelectedKeys,
    selectedKeys,
    onSelect,
    onDeselect,

    // Level
    inlineIndent = 24,

    // Motion
    motion,
    defaultMotions,

    // Popup
    triggerSubMenuAction = 'hover',
    builtinPlacements,

    // Icon
    itemIcon,
    expandIcon,
    overflowedIndicator = '...',
    overflowedIndicatorPopupClassName,

    // Function
    getPopupContainer,

    // Events
    onClick,
    onOpenChange,
    onKeyDown,

    // Deprecated
    openAnimation,
    openTransitionName,

    ...restProps
  } = props as LegacyMenuProps;

  const childList: React.ReactElement[] = parseChildren(children, EMPTY_LIST);
  const [mounted, setMounted] = React.useState(false);

  const containerRef = React.useRef<HTMLUListElement>();

  const uuid = useUUID(id);

  const isRtl = direction === 'rtl';

  // ========================= Warn =========================
  if (process.env.NODE_ENV !== 'production') {
    warning(
      !openAnimation && !openTransitionName,
      '`openAnimation` and `openTransitionName` is removed. Please use `motion` or `defaultMotion` instead.',
    );
  }

  // ========================= Mode =========================
  const [mergedMode, mergedInlineCollapsed] = React.useMemo<
    [MenuMode, boolean]
  >(() => {
    if ((mode === 'inline' || mode === 'vertical') && inlineCollapsed) {
      return ['vertical', inlineCollapsed];
    }
    return [mode, false];
  }, [mode, inlineCollapsed]);

  // ====================== Responsive ======================
  const [lastVisibleIndex, setLastVisibleIndex] = React.useState(0);
  const allVisible =
    lastVisibleIndex >= childList.length - 1 ||
    mergedMode !== 'horizontal' ||
    disabledOverflow;

  // ========================= Open =========================
  const [mergedOpenKeys, setMergedOpenKeys] = useMergedState(defaultOpenKeys, {
    value: openKeys,
    postState: keys => keys || EMPTY_LIST,
  });

  const triggerOpenKeys = (keys: string[]) => {
    setMergedOpenKeys(keys);
    onOpenChange?.(keys);
  };

  // >>>>> Cache & Reset open keys when inlineCollapsed changed
  const [inlineCacheOpenKeys, setInlineCacheOpenKeys] =
    React.useState(mergedOpenKeys);

  const isInlineMode = mergedMode === 'inline';

  const mountRef = React.useRef(false);

  // Cache
  React.useEffect(() => {
    if (isInlineMode) {
      setInlineCacheOpenKeys(mergedOpenKeys);
    }
  }, [mergedOpenKeys]);

  // Restore
  React.useEffect(() => {
    if (!mountRef.current) {
      mountRef.current = true;
      return;
    }

    if (isInlineMode) {
      setMergedOpenKeys(inlineCacheOpenKeys);
    } else {
      // Trigger open event in case its in control
      triggerOpenKeys(EMPTY_LIST);
    }
  }, [isInlineMode]);

  // ========================= Path =========================
  const {
    registerPath,
    unregisterPath,
    refreshOverflowKeys,

    isSubPathKey,
    getKeyPath,
    getKeys,
    getSubPathKeys,
  } = useKeyRecords();

  const registerPathContext = React.useMemo(
    () => ({ registerPath, unregisterPath }),
    [registerPath, unregisterPath],
  );

  const pathUserContext = React.useMemo(
    () => ({ isSubPathKey }),
    [isSubPathKey],
  );

  React.useEffect(() => {
    refreshOverflowKeys(
      allVisible
        ? EMPTY_LIST
        : childList
            .slice(lastVisibleIndex + 1)
            .map(child => child.key as string),
    );
  }, [lastVisibleIndex, allVisible]);

  // ======================== Active ========================
  const [mergedActiveKey, setMergedActiveKey] = useMergedState(
    activeKey || ((defaultActiveFirst && childList[0]?.key) as string),
    {
      value: activeKey,
    },
  );

  const onActive = useMemoCallback((key: string) => {
    setMergedActiveKey(key);
  });

  const onInactive = useMemoCallback(() => {
    setMergedActiveKey(undefined);
  });

  // ======================== Select ========================
  // >>>>> Select keys
  const [mergedSelectKeys, setMergedSelectKeys] = useMergedState(
    defaultSelectedKeys || [],
    {
      value: selectedKeys,

      // Legacy convert key to array
      postState: keys => {
        if (Array.isArray(keys)) {
          return keys;
        }

        if (keys === null || keys === undefined) {
          return EMPTY_LIST;
        }

        return [keys];
      },
    },
  );

  // >>>>> Trigger select
  const triggerSelection = (info: MenuInfo) => {
    if (selectable) {
      // Insert or Remove
      const { key: targetKey } = info;
      const exist = mergedSelectKeys.includes(targetKey);
      let newSelectKeys: string[];

      if (multiple) {
        if (exist) {
          newSelectKeys = mergedSelectKeys.filter(key => key !== targetKey);
        } else {
          newSelectKeys = [...mergedSelectKeys, targetKey];
        }
      } else {
        newSelectKeys = [targetKey];
      }

      setMergedSelectKeys(newSelectKeys);

      // Trigger event
      const selectInfo: SelectInfo = {
        ...info,
        selectedKeys: newSelectKeys,
      };

      if (exist) {
        onDeselect?.(selectInfo);
      } else {
        onSelect?.(selectInfo);
      }
    }

    // Whatever selectable, always close it
    if (!multiple && mergedOpenKeys.length && mergedMode !== 'inline') {
      triggerOpenKeys(EMPTY_LIST);
    }
  };

  // ========================= Open =========================
  /**
   * Click for item. SubMenu do not have selection status
   */
  const onInternalClick = useMemoCallback((info: MenuInfo) => {
    onClick?.(warnItemProp(info));
    triggerSelection(info);
  });

  const onInternalOpenChange = useMemoCallback((key: string, open: boolean) => {
    let newOpenKeys = mergedOpenKeys.filter(k => k !== key);

    if (open) {
      newOpenKeys.push(key);
    } else if (mergedMode !== 'inline') {
      // We need find all related popup to close
      const subPathKeys = getSubPathKeys(key);
      newOpenKeys = newOpenKeys.filter(k => !subPathKeys.has(k));
    }

    if (!shallowEqual(mergedOpenKeys, newOpenKeys)) {
      triggerOpenKeys(newOpenKeys);
    }
  });

  const getInternalPopupContainer = useMemoCallback(getPopupContainer);

  // ==================== Accessibility =====================
  const triggerAccessibilityOpen = (key: string, open?: boolean) => {
    const nextOpen = open ?? !mergedOpenKeys.includes(key);

    onInternalOpenChange(key, nextOpen);
  };

  const onInternalKeyDown = useAccessibility(
    mergedMode,
    mergedActiveKey,
    isRtl,
    uuid,

    containerRef,
    getKeys,
    getKeyPath,

    setMergedActiveKey,
    triggerAccessibilityOpen,

    onKeyDown,
  );

  // ======================== Effect ========================
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // ======================== Render ========================

  // >>>>> Children
  const wrappedChildList =
    mergedMode !== 'horizontal' || disabledOverflow
      ? childList
      : // Need wrap for overflow dropdown that do not response for open
        childList.map((child, index) => (
          // Always wrap provider to avoid sub node re-mount
          <MenuContextProvider
            key={child.key}
            overflowDisabled={index > lastVisibleIndex}
          >
            {child}
          </MenuContextProvider>
        ));

  // >>>>> Container
  const container = (
    <Overflow
      id={id}
      ref={containerRef as any}
      prefixCls={`${prefixCls}-overflow`}
      component="ul"
      itemComponent={MenuItem}
      className={classNames(
        prefixCls,
        `${prefixCls}-root`,
        `${prefixCls}-${mergedMode}`,
        className,
        {
          [`${prefixCls}-inline-collapsed`]: mergedInlineCollapsed,
          [`${prefixCls}-rtl`]: isRtl,
        },
      )}
      dir={direction}
      style={style}
      role="menu"
      tabIndex={tabIndex}
      data={wrappedChildList}
      renderRawItem={node => node}
      renderRawRest={omitItems => {
        // We use origin list since wrapped list use context to prevent open
        const len = omitItems.length;

        const originOmitItems = len ? childList.slice(-len) : null;

        return (
          <SubMenu
            eventKey={OVERFLOW_KEY}
            title={overflowedIndicator}
            disabled={allVisible}
            internalPopupClose={len === 0}
            popupClassName={overflowedIndicatorPopupClassName}
          >
            {originOmitItems}
          </SubMenu>
        );
      }}
      maxCount={
        mergedMode !== 'horizontal' || disabledOverflow
          ? Overflow.INVALIDATE
          : Overflow.RESPONSIVE
      }
      ssr="full"
      data-menu-list
      onVisibleChange={newLastIndex => {
        setLastVisibleIndex(newLastIndex);
      }}
      onKeyDown={onInternalKeyDown}
      {...restProps}
    />
  );

  // >>>>> Render
  return (
    <IdContext.Provider value={uuid}>
      <MenuContextProvider
        prefixCls={prefixCls}
        mode={mergedMode}
        openKeys={mergedOpenKeys}
        rtl={isRtl}
        // Disabled
        disabled={disabled}
        // Motion
        motion={mounted ? motion : null}
        defaultMotions={mounted ? defaultMotions : null}
        // Active
        activeKey={mergedActiveKey}
        onActive={onActive}
        onInactive={onInactive}
        // Selection
        selectedKeys={mergedSelectKeys}
        // Level
        inlineIndent={inlineIndent}
        // Popup
        subMenuOpenDelay={subMenuOpenDelay}
        subMenuCloseDelay={subMenuCloseDelay}
        forceSubMenuRender={forceSubMenuRender}
        builtinPlacements={builtinPlacements}
        triggerSubMenuAction={triggerSubMenuAction}
        getPopupContainer={getInternalPopupContainer}
        // Icon
        itemIcon={itemIcon}
        expandIcon={expandIcon}
        // Events
        onItemClick={onInternalClick}
        onOpenChange={onInternalOpenChange}
      >
        <PathUserContext.Provider value={pathUserContext}>
          {container}
        </PathUserContext.Provider>

        {/* Measure menu keys. Add `display: none` to avoid some developer miss use the Menu */}
        <div style={{ display: 'none' }} aria-hidden>
          <PathRegisterContext.Provider value={registerPathContext}>
            {childList}
          </PathRegisterContext.Provider>
        </div>
      </MenuContextProvider>
    </IdContext.Provider>
  );
};

export default Menu;
