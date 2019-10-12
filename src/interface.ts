export type RenderIconType =
  | React.ReactNode
  | ((props: any) => React.ReactNode);

export interface MenuInfo {
  key: string;
  keyPath: string[];
  item: React.ReactInstance;
  domEvent: React.MouseEvent<HTMLElement>;
}
export interface SelectInfo extends MenuInfo {
  selectedKeys?: string[];
}

export type SelectEventHandler = (info: SelectInfo) => void;

export type HoverEventHandler = (info: { key: string; hover: boolean }) => void;

export type MenuHoverEventHandler = (info: {
  key: string;
  domEvent: React.MouseEvent<HTMLElement>;
}) => void;

export type MenuClickEventHandler = (info: MenuInfo) => void;

export type DestroyEventHandler = (key: string) => void;

export type MenuMode =
  | 'horizontal'
  | 'vertical'
  | 'vertical-left'
  | 'vertical-right'
  | 'inline';
