import * as React from 'react';
import type { CSSMotionProps } from 'rc-motion';
import classNames from 'classnames';
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
import MenuContextProvider from './context';
import useMemoCallback from './hooks/useMemoCallback';
import usePathData from './hooks/usePathData';
import { warnItemProp } from './utils/warnUtil';
import SubMenu from './SubMenu';
import useAccessibility from './hooks/useAccessibility';
import useUUID from './hooks/useUUID';

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
  extends Omit<React.HTMLAttributes<HTMLUListElement>, 'onClick' | 'onSelect'> {
  prefixCls?: string;

  children?: React.ReactNode;

  disabled?: boolean;
  /** Disable auto overflow */
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
    if (mode === 'inline' && inlineCollapsed) {
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
  const [mergedOpenKeys, setMergedOpenKeys] = useMergedState(
    defaultOpenKeys || [],
    {
      value: openKeys,
    },
  );

  // >>>>> Cache & Reset open keys when inlineCollapsed changed
  const [inlineCacheOpenKeys, setInlineCacheOpenKeys] = React.useState(
    mergedOpenKeys,
  );

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
      const empty = [];
      setMergedOpenKeys(empty);

      // Trigger open event in case its in control
      onOpenChange?.(empty);
    }
  }, [isInlineMode]);

  // ========================= Path =========================
  const {
    elementsRef,
    getInfoByElement,
    getElementByKey,
    ...pathData
  } = usePathData();

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
          return [];
        }

        return [keys];
      },
    },
  );

  // >>>>> Trigger select
  const triggerSelection = (info: MenuInfo) => {
    if (!selectable) {
      return;
    }

    // Insert or Remove
    const { key: targetKey } = info;
    const exist = mergedSelectKeys.includes(targetKey);
    let newSelectKeys: string[];

    if (exist) {
      newSelectKeys = mergedSelectKeys.filter(key => key !== targetKey);
    } else if (multiple) {
      newSelectKeys = [...mergedSelectKeys, targetKey];
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
    const newOpenKeys = mergedOpenKeys.filter(k => k !== key);

    if (open) {
      newOpenKeys.push(key);
    }

    setMergedOpenKeys(newOpenKeys);
    onOpenChange?.(newOpenKeys);
  });

  const getInternalPopupContainer = useMemoCallback(getPopupContainer);

  // ======================== Focus =========================
  const activeByElement = (element: HTMLElement) => {
    const [key] = getInfoByElement(element);
    setMergedActiveKey(key);
  };

  const triggerElement = (element: HTMLElement, open: boolean) => {
    const [key] = getInfoByElement(element);

    onInternalOpenChange(key, open);
  };

  const onInternalKeyDown = useAccessibility(
    mergedMode,

    containerRef,
    elementsRef,

    getInfoByElement,
    getElementByKey,
    activeByElement,
    triggerElement,

    onKeyDown,
  );

  // ======================== Effect ========================
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // ======================== Render ========================

  // >>>>> Children
  const wrappedChildList =
    mergedMode !== 'horizontal'
      ? childList
      : // Need wrap for overflow dropdown that do not response for open
        childList.map((child, index) => {
          if (index < lastVisibleIndex) {
            return child;
          }

          return (
            <MenuContextProvider key={child.key} openDisabled>
              {child}
            </MenuContextProvider>
          );
        });

  // >>>>> Container
  const container = (
    <Overflow
      id={uuid}
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
          [`${prefixCls}-rtl`]: direction === 'rtl',
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
        const originOmitItems = childList.slice(-len);

        return (
          <SubMenu
            eventKey="rc-menu-more"
            title={overflowedIndicator}
            disabled={allVisible}
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
    <MenuContextProvider
      id={uuid}
      prefixCls={prefixCls}
      mode={mergedMode}
      openKeys={mergedOpenKeys}
      parentKeys={EMPTY_LIST}
      rtl={direction === 'rtl'}
      // Disabled
      disabled={disabled}
      // Motion
      motion={mounted ? motion : null}
      defaultMotions={mounted ? defaultMotions : null}
      // Path
      {...pathData}
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
      {container}
    </MenuContextProvider>
  );
};

export default Menu;
