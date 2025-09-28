import { clsx } from 'clsx';
import type { CSSMotionProps } from '@rc-component/motion';
import Overflow from 'rc-overflow';
import useControlledState from '@rc-component/util/lib/hooks/useControlledState';
import useId from '@rc-component/util/lib/hooks/useId';
import isEqual from '@rc-component/util/lib/isEqual';
import warning from '@rc-component/util/lib/warning';
import * as React from 'react';
import { useImperativeHandle } from 'react';
import { flushSync } from 'react-dom';
import { IdContext } from './context/IdContext';
import MenuContextProvider from './context/MenuContext';
import { PathRegisterContext, PathUserContext } from './context/PathContext';
import PrivateContext from './context/PrivateContext';
import { getFocusableElements, refreshElements, useAccessibility } from './hooks/useAccessibility';
import useKeyRecords, { OVERFLOW_KEY } from './hooks/useKeyRecords';
import useMemoCallback from './hooks/useMemoCallback';
import type {
  BuiltinPlacements,
  Components,
  ItemType,
  MenuClickEventHandler,
  MenuInfo,
  MenuMode,
  MenuRef,
  RenderIconType,
  SelectEventHandler,
  SelectInfo,
  TriggerSubMenuAction,
  PopupRender,
} from './interface';
import MenuItem from './MenuItem';
import SubMenu, { SemanticName } from './SubMenu';
import { parseItems } from './utils/nodeUtil';
import { warnItemProp } from './utils/warnUtil';

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
  extends Omit<React.HTMLAttributes<HTMLUListElement>, 'onClick' | 'onSelect' | 'dir'> {
  prefixCls?: string;
  rootClassName?: string;
  classNames?: Partial<Record<SemanticName, string>>;
  styles?: Partial<Record<SemanticName, React.CSSProperties>>;
  items?: ItemType[];

  /** @deprecated Please use `items` instead */
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  onOpenChange?: (openKeys: string[]) => void;

  // >>>>> Internal
  /***
   * @private Only used for `pro-layout`. Do not use in your prod directly
   * and we do not promise any compatibility for this.
   */
  _internalRenderMenuItem?: (
    originNode: React.ReactElement,
    menuItemProps: any,
    stateProps: {
      selected: boolean;
    },
  ) => React.ReactElement;
  /***
   * @private Only used for `pro-layout`. Do not use in your prod directly
   * and we do not promise any compatibility for this.
   */
  _internalRenderSubMenuItem?: (
    originNode: React.ReactElement,
    subMenuItemProps: any,
    stateProps: {
      selected: boolean;
      open: boolean;
      active: boolean;
      disabled: boolean;
    },
  ) => React.ReactElement;

  /**
   * @private NEVER! EVER! USE IN PRODUCTION!!!
   * This is a hack API for `antd` to fix `findDOMNode` issue.
   * Not use it! Not accept any PR try to make it as normal API.
   * By zombieJ
   */
  _internalComponents?: Components;

  popupRender?: PopupRender;
}

interface LegacyMenuProps extends MenuProps {
  openTransitionName?: string;
  openAnimation?: string;
}

const Menu = React.forwardRef<MenuRef, MenuProps>((props, ref) => {
  const {
    prefixCls = 'rc-menu',
    rootClassName,
    style,
    className,
    styles,
    classNames: menuClassNames,
    tabIndex = 0,
    items,
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

    // Internal
    _internalRenderMenuItem,
    _internalRenderSubMenuItem,

    _internalComponents,

    popupRender,
    ...restProps
  } = props as LegacyMenuProps;

  const [childList, measureChildList]: [
    visibleChildList: React.ReactElement[],
    measureChildList: React.ReactElement[],
  ] = React.useMemo(
    () => [
      parseItems(children, items, EMPTY_LIST, _internalComponents, prefixCls),
      parseItems(children, items, EMPTY_LIST, {}, prefixCls),
    ],
    [children, items, _internalComponents],
  );

  const [mounted, setMounted] = React.useState(false);

  const containerRef = React.useRef<HTMLUListElement>();

  const uuid = useId(id ? `rc-menu-uuid-${id}` : 'rc-menu-uuid');

  const isRtl = direction === 'rtl';

  // ========================= Warn =========================
  if (process.env.NODE_ENV !== 'production') {
    warning(
      !openAnimation && !openTransitionName,
      '`openAnimation` and `openTransitionName` is removed. Please use `motion` or `defaultMotion` instead.',
    );
  }

  // ========================= Open =========================
  const [innerOpenKeys, setMergedOpenKeys] = useControlledState(defaultOpenKeys, openKeys);
  const mergedOpenKeys = innerOpenKeys || EMPTY_LIST;

  // React 18 will merge mouse event which means we open key will not sync
  // ref: https://github.com/ant-design/ant-design/issues/38818
  const triggerOpenKeys = (keys: string[], forceFlush = false) => {
    function doUpdate() {
      setMergedOpenKeys(keys);
      onOpenChange?.(keys);
    }

    if (forceFlush) {
      flushSync(doUpdate);
    } else {
      doUpdate();
    }
  };

  // >>>>> Cache & Reset open keys when inlineCollapsed changed
  const [inlineCacheOpenKeys, setInlineCacheOpenKeys] = React.useState(mergedOpenKeys);

  const mountRef = React.useRef(false);

  // ========================= Mode =========================
  const [mergedMode, mergedInlineCollapsed] = React.useMemo<[MenuMode, boolean]>(() => {
    if ((mode === 'inline' || mode === 'vertical') && inlineCollapsed) {
      return ['vertical', inlineCollapsed];
    }
    return [mode, false];
  }, [mode, inlineCollapsed]);

  const isInlineMode = mergedMode === 'inline';

  const [internalMode, setInternalMode] = React.useState(mergedMode);
  const [internalInlineCollapsed, setInternalInlineCollapsed] =
    React.useState(mergedInlineCollapsed);

  React.useEffect(() => {
    setInternalMode(mergedMode);
    setInternalInlineCollapsed(mergedInlineCollapsed);

    if (!mountRef.current) {
      return;
    }
    // Synchronously update MergedOpenKeys
    if (isInlineMode) {
      setMergedOpenKeys(inlineCacheOpenKeys);
    } else {
      // Trigger open event in case its in control
      triggerOpenKeys(EMPTY_LIST);
    }
  }, [mergedMode, mergedInlineCollapsed]);

  // ====================== Responsive ======================
  const [lastVisibleIndex, setLastVisibleIndex] = React.useState(0);
  const allVisible =
    lastVisibleIndex >= childList.length - 1 || internalMode !== 'horizontal' || disabledOverflow;

  // Cache
  React.useEffect(() => {
    if (isInlineMode) {
      setInlineCacheOpenKeys(mergedOpenKeys);
    }
  }, [mergedOpenKeys]);

  React.useEffect(() => {
    mountRef.current = true;

    return () => {
      mountRef.current = false;
    };
  }, []);

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

  const pathUserContext = React.useMemo(() => ({ isSubPathKey }), [isSubPathKey]);

  React.useEffect(() => {
    refreshOverflowKeys(
      allVisible
        ? EMPTY_LIST
        : childList.slice(lastVisibleIndex + 1).map(child => child.key as string),
    );
  }, [lastVisibleIndex, allVisible]);

  // ======================== Active ========================
  const [mergedActiveKey, setMergedActiveKey] = useControlledState(
    activeKey || ((defaultActiveFirst && childList[0]?.key) as string),
    activeKey,
  );

  const onActive = useMemoCallback((key: string) => {
    setMergedActiveKey(key);
  });

  const onInactive = useMemoCallback(() => {
    setMergedActiveKey(undefined);
  });

  useImperativeHandle(ref, () => {
    return {
      list: containerRef.current,
      focus: options => {
        const keys = getKeys();
        const { elements, key2element, element2key } = refreshElements(keys, uuid);
        const focusableElements = getFocusableElements(containerRef.current, elements);

        let shouldFocusKey: string;
        if (mergedActiveKey && keys.includes(mergedActiveKey)) {
          shouldFocusKey = mergedActiveKey;
        } else {
          shouldFocusKey = focusableElements[0]
            ? element2key.get(focusableElements[0])
            : childList.find(node => !node.props.disabled)?.key;
        }
        const elementToFocus = key2element.get(shouldFocusKey);

        if (shouldFocusKey && elementToFocus) {
          elementToFocus?.focus?.(options);
        }
      },
      findItem: ({ key: itemKey }) => {
        const keys = getKeys();
        const { key2element } = refreshElements(keys, uuid);
        return key2element.get(itemKey) || null;
      },
    };
  });

  // ======================== Select ========================
  // >>>>> Select keys
  const [internalSelectKeys, setMergedSelectKeys] = useControlledState(
    defaultSelectedKeys || [],
    selectedKeys,
  );
  const mergedSelectKeys = React.useMemo(() => {
    if (Array.isArray(internalSelectKeys)) {
      return internalSelectKeys;
    }

    if (internalSelectKeys === null || internalSelectKeys === undefined) {
      return EMPTY_LIST;
    }

    return [internalSelectKeys];
  }, [internalSelectKeys]);

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
    if (!multiple && mergedOpenKeys.length && internalMode !== 'inline') {
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
    } else if (internalMode !== 'inline') {
      // We need find all related popup to close
      const subPathKeys = getSubPathKeys(key);
      newOpenKeys = newOpenKeys.filter(k => !subPathKeys.has(k));
    }

    if (!isEqual(mergedOpenKeys, newOpenKeys, true)) {
      triggerOpenKeys(newOpenKeys, true);
    }
  });

  // ==================== Accessibility =====================
  const triggerAccessibilityOpen = (key: string, open?: boolean) => {
    const nextOpen = open ?? !mergedOpenKeys.includes(key);

    onInternalOpenChange(key, nextOpen);
  };

  const onInternalKeyDown = useAccessibility(
    internalMode,
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

  // ======================= Context ========================
  const privateContext = React.useMemo(
    () => ({
      _internalRenderMenuItem,
      _internalRenderSubMenuItem,
    }),
    [_internalRenderMenuItem, _internalRenderSubMenuItem],
  );

  // ======================== Render ========================

  // >>>>> Children
  const wrappedChildList =
    internalMode !== 'horizontal' || disabledOverflow
      ? childList
      : // Need wrap for overflow dropdown that do not response for open
        childList.map((child, index) => (
          // Always wrap provider to avoid sub node re-mount
          <MenuContextProvider
            key={child.key}
            overflowDisabled={index > lastVisibleIndex}
            classNames={menuClassNames}
            styles={styles}
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
      className={clsx(
        prefixCls,
        `${prefixCls}-root`,
        `${prefixCls}-${internalMode}`,
        className,
        {
          [`${prefixCls}-inline-collapsed`]: internalInlineCollapsed,
          [`${prefixCls}-rtl`]: isRtl,
        },
        rootClassName,
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
        internalMode !== 'horizontal' || disabledOverflow
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
    <PrivateContext.Provider value={privateContext}>
      <IdContext.Provider value={uuid}>
        <MenuContextProvider
          prefixCls={prefixCls}
          rootClassName={rootClassName}
          classNames={menuClassNames}
          styles={styles}
          mode={internalMode}
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
          getPopupContainer={getPopupContainer}
          // Icon
          itemIcon={itemIcon}
          expandIcon={expandIcon}
          // Events
          onItemClick={onInternalClick}
          onOpenChange={onInternalOpenChange}
          popupRender={popupRender}
        >
          <PathUserContext.Provider value={pathUserContext}>{container}</PathUserContext.Provider>

          {/* Measure menu keys. Add `display: none` to avoid some developer miss use the Menu */}
          <div style={{ display: 'none' }} aria-hidden>
            <PathRegisterContext.Provider value={registerPathContext}>
              {measureChildList}
            </PathRegisterContext.Provider>
          </div>
        </MenuContextProvider>
      </IdContext.Provider>
    </PrivateContext.Provider>
  );
});

export default Menu;
