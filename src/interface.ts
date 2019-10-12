export type RenderIconType =
  | React.ReactNode
  | ((props: any) => React.ReactNode);

export interface SelectInfo {
  key: string;
  keyPath: string[];
  item: React.ReactInstance;
  domEvent: React.MouseEvent<HTMLElement>;
  selectedKeys: string[];
}
