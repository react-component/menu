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
}

export type LegacyFunctionRef = (node: React.ReactInstance) => void;

export type BuiltinPlacements = Record<string, any>;

export type TriggerSubMenuAction = 'click' | 'hover';

// =================================== Motion ===================================
export type AnimationType = string | Record<string, any>;

export type TransitionNameType = string;

/**
 * Follow Motion definition is copied from `rc-trigger@latest`.
 * These code can be removed when `rc-trigger` updated.
 */
// TODO: Use define by `rc-trigger@latest`
type MotionStatus = 'none' | 'appear' | 'enter' | 'leave';

type MotionActiveStatus = 'appear-active' | 'enter-active' | 'leave-active';

type MotionNameObject = {
  [key in MotionStatus | MotionActiveStatus]?: string;
};

type MotionEventHandler = (
  element: HTMLElement,
  event:
    | React.TransitionEvent<HTMLElement>
    | React.AnimationEvent<HTMLElement>
    | undefined,
) => React.CSSProperties | false | null | undefined | void;
export interface MotionType {
  motionName?: string | MotionNameObject;
  motionAppear?: boolean;
  motionEnter?: boolean;
  motionLeave?: boolean;
  motionLeaveImmediately?: boolean; // Trigger leave motion immediately
  removeOnLeave?: boolean;
  leavedClassName?: string;
  onAppearStart?: MotionEventHandler;
  onAppearActive?: MotionEventHandler;
  onAppearEnd?: MotionEventHandler;
  onEnterStart?: MotionEventHandler;
  onEnterActive?: MotionEventHandler;
  onEnterEnd?: MotionEventHandler;
  onLeaveStart?: MotionEventHandler;
  onLeaveActive?: MotionEventHandler;
  onLeaveEnd?: MotionEventHandler;
}
