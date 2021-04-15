import type * as React from 'react';

export type MenuMode = 'horizontal' | 'vertical' | 'inline';

export type RenderIconType =
  | React.ReactNode
  | ((props: any) => React.ReactNode);

export interface MenuInfo {
  key: string;
  keyPath: string[];
  /** @deprecated This will not support in future. You should avoid to use this */
  item: React.ReactInstance;
  domEvent: React.MouseEvent<HTMLElement>;
}

export type MenuHoverEventHandler = (info: {
  key: React.Key;
  domEvent: React.MouseEvent<HTMLElement>;
}) => void;

export interface MenuTitleInfo {
  key: string;
  domEvent: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>;
}

export type MenuClickEventHandler = (info: MenuInfo) => void;

export type BuiltinPlacements = Record<string, any>;

export type TriggerSubMenuAction = 'click' | 'hover';
