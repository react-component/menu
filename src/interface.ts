import type * as React from 'react';

// ========================= Options =========================
interface ItemSharedProps {
  style?: React.CSSProperties;
  className?: string;
}

export interface SubMenuType extends ItemSharedProps {
  label?: React.ReactNode;

  children: ItemType[];

  disabled?: boolean;

  key: string;

  rootClassName?: string;

  // >>>>> Icon
  itemIcon?: RenderIconType;
  expandIcon?: RenderIconType;

  // >>>>> Active
  onMouseEnter?: MenuHoverEventHandler;
  onMouseLeave?: MenuHoverEventHandler;

  // >>>>> Popup
  popupClassName?: string;
  popupOffset?: number[];

  // >>>>> Events
  onClick?: MenuClickEventHandler;
  onTitleClick?: (info: MenuTitleInfo) => void;
  onTitleMouseEnter?: MenuHoverEventHandler;
  onTitleMouseLeave?: MenuHoverEventHandler;
}

export interface MenuItemType extends ItemSharedProps {
  label?: React.ReactNode;

  disabled?: boolean;

  itemIcon?: RenderIconType;

  key: React.Key;

  // >>>>> Active
  onMouseEnter?: MenuHoverEventHandler;
  onMouseLeave?: MenuHoverEventHandler;

  // >>>>> Events
  onClick?: MenuClickEventHandler;
}

export interface MenuItemGroupType extends ItemSharedProps {
  type: 'group';

  label?: React.ReactNode;

  children?: ItemType[];
}

export interface MenuDividerType extends ItemSharedProps {
  type: 'divider';
}

export type ItemType =
  | SubMenuType
  | MenuItemType
  | MenuItemGroupType
  | MenuDividerType
  | null;

// ========================== Basic ==========================
export type MenuMode = 'horizontal' | 'vertical' | 'inline';

export type BuiltinPlacements = Record<string, any>;

export type TriggerSubMenuAction = 'click' | 'hover';

export interface RenderIconInfo {
  isSelected?: boolean;
  isOpen?: boolean;
  isSubMenu?: boolean;
  disabled?: boolean;
}

export type RenderIconType =
  | React.ReactNode
  | ((props: RenderIconInfo) => React.ReactNode);

export interface MenuInfo {
  key: string;
  keyPath: string[];
  /** @deprecated This will not support in future. You should avoid to use this */
  item: React.ReactInstance;
  domEvent: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>;
}

export interface MenuTitleInfo {
  key: string;
  domEvent: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>;
}

// ========================== Hover ==========================
export type MenuHoverEventHandler = (info: {
  key: string;
  domEvent: React.MouseEvent<HTMLElement>;
}) => void;

// ======================== Selection ========================
export interface SelectInfo extends MenuInfo {
  selectedKeys: string[];
}

export type SelectEventHandler = (info: SelectInfo) => void;

// ========================== Click ==========================
export type MenuClickEventHandler = (info: MenuInfo) => void;

export type MenuRef = {
  focus: (options?: FocusOptions) => void;
  list: HTMLUListElement;
};
