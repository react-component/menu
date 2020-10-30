export type RenderIconType =
  | React.ReactNode
  | ((props: any) => React.ReactNode);

export interface MenuInfo {
  key: React.Key;
  keyPath: React.Key[];
  item: React.ReactInstance;
  domEvent: React.MouseEvent<HTMLElement>;
}
export interface SelectInfo extends MenuInfo {
  selectedKeys?: React.Key[];
}

export type SelectEventHandler = (info: SelectInfo) => void;

export type HoverEventHandler = (info: {
  key: React.Key;
  hover: boolean;
}) => void;

export type MenuHoverEventHandler = (info: {
  key: React.Key;
  domEvent: React.MouseEvent<HTMLElement>;
}) => void;

export type MenuClickEventHandler = (info: MenuInfo) => void;

export type DestroyEventHandler = (key: React.Key) => void;

export type OpenEventHandler = (
  keys:
    | React.Key[]
    | {
        key: React.Key;
        item: React.ReactInstance;
        trigger: string;
        open: boolean;
      },
) => void;

export type MenuMode =
  | 'horizontal'
  | 'vertical'
  | 'vertical-left'
  | 'vertical-right'
  | 'inline';

export type OpenAnimation = string | Record<string, any>;

export interface MiniStore {
  getState: () => any;
  setState: (state: any) => void;
  subscribe: (listener: () => void) => () => void;
}

export type LegacyFunctionRef = (node: React.ReactInstance) => void;

export type BuiltinPlacements = Record<string, any>;

export type TriggerSubMenuAction = 'click' | 'hover';
