import * as React from 'react';
import type { CSSMotionProps } from 'rc-motion';
import useMemo from 'rc-util/lib/hooks/useMemo';
import shallowEqual from 'shallowequal';
import type {
  BuiltinPlacements,
  MenuClickEventHandler,
  MenuMode,
  RenderIconType,
  TriggerSubMenuAction,
} from '../interface';

export interface MenuContextProps {
  prefixCls: string;
  openKeys: string[];
  rtl?: boolean;

  // Mode
  mode: MenuMode;

  // Disabled
  disabled?: boolean;
  // Used for overflow only. Prevent hidden node trigger open
  overflowDisabled?: boolean;

  // Active
  activeKey: string;
  onActive: (key: string) => void;
  onInactive: (key: string) => void;

  // Selection
  selectedKeys: string[];

  // Level
  inlineIndent: number;

  // Motion
  motion?: CSSMotionProps;
  defaultMotions?: Partial<{ [key in MenuMode | 'other']: CSSMotionProps }>;

  // Popup
  subMenuOpenDelay: number;
  subMenuCloseDelay: number;
  forceSubMenuRender?: boolean;
  builtinPlacements?: BuiltinPlacements;
  triggerSubMenuAction?: TriggerSubMenuAction;

  // Icon
  itemIcon?: RenderIconType;
  expandIcon?: RenderIconType;

  // Function
  onItemClick: MenuClickEventHandler;
  onOpenChange: (key: string, open: boolean) => void;
  getPopupContainer: (node: HTMLElement) => HTMLElement;
}

export const MenuContext = React.createContext<MenuContextProps>(null);

function mergeProps(
  origin: MenuContextProps,
  target: Partial<MenuContextProps>,
): MenuContextProps {
  const clone = { ...origin };

  Object.keys(target).forEach(key => {
    const value = target[key];
    if (value !== undefined) {
      clone[key] = value;
    }
  });

  return clone;
}

export interface InheritableContextProps extends Partial<MenuContextProps> {
  children?: React.ReactNode;
  locked?: boolean;
}

export default function InheritableContextProvider({
  children,
  locked,
  ...restProps
}: InheritableContextProps) {
  const context = React.useContext(MenuContext);

  const inheritableContext = useMemo(
    () => mergeProps(context, restProps),
    [context, restProps],
    (prev, next) =>
      !locked && (prev[0] !== next[0] || !shallowEqual(prev[1], next[1])),
  );

  return (
    <MenuContext.Provider value={inheritableContext}>
      {children}
    </MenuContext.Provider>
  );
}
