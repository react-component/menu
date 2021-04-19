import * as React from 'react';
import type { CSSMotionProps } from 'rc-motion';
import classNames from 'classnames';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
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

/**
 * Menu modify after refactor:
 * ## Remove
 * - openTransitionName
 * - openAnimation
 * - onDestroy
 */

// optimize for render
const EMPTY_LIST: string[] = [];

export interface MenuProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick' | 'onSelect'> {
  prefixCls?: string;

  mode?: MenuMode;
  children?: React.ReactNode;

  /** direction of menu */
  direction?: 'ltr' | 'rtl';

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

  // >>>>> Function
  getPopupContainer?: (node: HTMLElement) => HTMLElement;

  // >>>>> Events
  onClick?: MenuClickEventHandler;
  onOpenChange?: (openKeys: React.Key[]) => void;

  // overflowedIndicator?: React.ReactNode;

  // inlineCollapsed?: boolean;

  // /** SiderContextProps of layout in ant design */
  // siderCollapsed?: boolean;
  // collapsedWidth?: string | number;
}

const Menu: React.FC<MenuProps> = ({
  prefixCls = 'rc-menu',
  style,
  className,
  tabIndex = 0,
  mode = 'vertical',
  children,
  direction,

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

  // Function
  getPopupContainer,

  // Events
  onClick,
  onOpenChange,
}) => {
  const childList: React.ReactElement[] = parseChildren(children, EMPTY_LIST);

  // ========================= Open =========================
  const [mergedOpenKeys, setMergedOpenKeys] = useMergedState(
    defaultOpenKeys || [],
    {
      value: openKeys,
    },
  );

  // ========================= Path =========================
  const pathData = usePathData();

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

  // ======================== Events ========================
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

  // ======================== Render ========================

  const container = (
    <Overflow
      component="ul"
      itemComponent={MenuItem}
      className={classNames(
        prefixCls,
        `${prefixCls}-root`,
        `${prefixCls}-${mode}`,
        className,
        {
          [`${prefixCls}-rlt`]: direction === 'rtl',
        },
      )}
      style={style}
      role="menu"
      tabIndex={tabIndex}
      data={childList}
      renderRawItem={node => node}
    />
  );

  return (
    <MenuContextProvider
      prefixCls={prefixCls}
      mode={mode}
      openKeys={mergedOpenKeys}
      parentKeys={EMPTY_LIST}
      rtl={direction === 'rtl'}
      // Motion
      motion={motion}
      defaultMotions={defaultMotions}
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
