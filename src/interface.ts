import React from "_@types_react@16.14.5@@types/react";

export type MenuMode =
  | 'horizontal'
  | 'vertical'
  | 'vertical-left'
  | 'vertical-right'
  | 'inline';

export interface MenuItemData {
  children?: MenuItemData[];
  disabled?: boolean;
  icon?: React.ReactNode;
  key: string | number;
  popupClassName?: string;
  popupOffset?: [number, number];
  title?: React.ReactNode;
  // TODO: fill this
  onTitleClick?: () => void;
}