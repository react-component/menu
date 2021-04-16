import * as React from 'react';
import type { CSSMotionProps } from 'rc-motion';
import useMemo from 'rc-util/lib/hooks/useMemo';
import shallowEqual from 'shallowequal';
import type {
  BuiltinPlacements,
  MenuClickEventHandler,
  MenuMode,
  TriggerSubMenuAction,
} from './interface';
import type { PathHookRet } from './hooks/usePathData';

export interface MenuContextProps extends PathHookRet {
  prefixCls: string;
  mode: MenuMode;
  openKeys: string[];
  parentKeys: string[];
  rtl?: boolean;

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

  // Popup
  subMenuOpenDelay: number;
  subMenuCloseDelay: number;
  forceSubMenuRender?: boolean;
  builtinPlacements?: BuiltinPlacements;
  triggerSubMenuAction?: TriggerSubMenuAction;

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
}

export default function InheritableContextProvider({
  children,
  ...restProps
}: InheritableContextProps) {
  const context = React.useContext(MenuContext);

  const inheritableContext = useMemo(
    () => mergeProps(context, restProps),
    [context, restProps],
    (prev, next) => prev[0] !== next[0] || !shallowEqual(prev[1], next[1]),
  );

  return (
    <MenuContext.Provider value={inheritableContext}>
      {children}
    </MenuContext.Provider>
  );
}
