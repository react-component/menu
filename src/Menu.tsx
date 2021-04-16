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
} from './interface';
import MenuItem from './MenuItem';
import { parseChildren } from './utils/nodeUtil';
import MenuContextProvider from './context';
import useMemoCallback from './hooks/useMemoCallback';
import usePathData from './hooks/usePathData';
import { warnItemProp } from './utils/warnUtil';

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

  // Motion
  /** Menu motion define */
  motion?: CSSMotionProps;

  // Popup
  subMenuOpenDelay?: number;
  subMenuCloseDelay?: number;
  forceSubMenuRender?: boolean;
  triggerSubMenuAction?: TriggerSubMenuAction;
  builtinPlacements?: BuiltinPlacements;

  // >>>>> Function
  getPopupContainer?: (node: HTMLElement) => HTMLElement;

  // >>>>> Events
  onClick?: MenuClickEventHandler;
  onOpenChange?: (openKeys: React.Key[]) => void;

  // onDestroy?: DestroyEventHandler;

  // level?: number;

  // itemIcon?: RenderIconType;
  // expandIcon?: RenderIconType;
  // overflowedIndicator?: React.ReactNode;

  // /** Default menu motion of each mode */
  // defaultMotions?: Partial<{ [key in MenuMode | 'other']: CSSMotionProps }>;

  // /** @deprecated Please use `motion` instead */
  // openTransitionName?: string;
  // /** @deprecated Please use `motion` instead */
  // openAnimation?: OpenAnimation;

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

  // Motion
  motion,

  // Popup
  triggerSubMenuAction = 'hover',
  builtinPlacements,

  // Function
  getPopupContainer,

  // Events
  onClick,
  onOpenChange,
}) => {
  const childList: React.ReactElement[] = parseChildren(children);

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

  // >>>>> events
  const onInternalSelect: SelectEventHandler = useMemoCallback(selectInfo => {
    setMergedSelectKeys(selectInfo.selectedKeys);
    onSelect?.(warnItemProp(selectInfo));
  });

  const onInternalDeselect: SelectEventHandler = useMemoCallback(selectInfo => {
    setMergedSelectKeys(selectInfo.selectedKeys);
    onDeselect?.(warnItemProp(selectInfo));
  });

  // ======================== Events ========================
  /**
   * Click for item. SubMenu do not have selection status
   */
  const onInternalClick = useMemoCallback((info: MenuInfo) => {
    onClick?.(warnItemProp(info));
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
      motion={motion}
      parentKeys={EMPTY_LIST}
      rtl={direction === 'rtl'}
      // Path
      {...pathData}
      // Active
      activeKey={mergedActiveKey}
      onActive={onActive}
      onInactive={onInactive}
      // Selection
      selectable={selectable}
      multiple={multiple}
      selectedKeys={mergedSelectKeys}
      onItemSelect={onInternalSelect}
      onItemDeselect={onInternalDeselect}
      // Click
      onItemClick={onInternalClick}
      // Popup
      subMenuOpenDelay={subMenuOpenDelay}
      subMenuCloseDelay={subMenuCloseDelay}
      forceSubMenuRender={forceSubMenuRender}
      builtinPlacements={builtinPlacements}
      triggerSubMenuAction={triggerSubMenuAction}
      onOpenChange={onInternalOpenChange}
      getPopupContainer={getInternalPopupContainer}
    >
      {container}
    </MenuContextProvider>
  );
};

export default Menu;
