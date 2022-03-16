import type * as React from 'react';

// ========================= Options =========================
interface OptionShareProps {
  style?: React.CSSProperties;
  className?: string;
}

export interface SubMenuOption extends OptionShareProps {
  // Option is `label` instead of `title`
  label?: React.ReactNode;
  children?: React.ReactNode;

  disabled?: boolean;

  key: string;

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

export interface MenuItemOption extends OptionShareProps {
  // Option is `label` instead of `children`
  label?: React.ReactNode;

  disabled?: boolean;

  itemIcon?: RenderIconType;

  key: string;

  // >>>>> Active
  onMouseEnter?: MenuHoverEventHandler;
  onMouseLeave?: MenuHoverEventHandler;

  // >>>>> Events
  onClick?: MenuClickEventHandler;
}

export interface MenuItemGroupOption extends OptionShareProps {
  // Origin `title`
  label?: React.ReactNode;

  // Origin `children`
  options?: MenuItemOption[];
}

export type MenuDividerOption = OptionShareProps;

export type Option =
  | SubMenuOption
  | MenuItemOption
  | MenuItemGroupOption
  | MenuDividerOption;

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
