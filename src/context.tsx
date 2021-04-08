import * as React from 'react';
import type { CSSMotionProps } from 'rc-motion';
import useMemo from 'rc-util/lib/hooks/useMemo';
import shallowEqual from 'shallowequal';
import type { MenuClickEventHandler, MenuMode } from './interface';

export interface MenuContextProps {
  prefixCls: string;
  mode: MenuMode;
  openKeys: string[];
  motion?: CSSMotionProps;
  parentKeys: string[];

  // Events
  onItemClick: MenuClickEventHandler;
  onSubMenuClick: (key: string) => void;
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
