import * as React from 'react';
import CSSMotion from '@rc-component/motion';
import { getMotion } from '../utils/motionUtil';
import MenuContextProvider, { MenuContext } from '../context/MenuContext';
import SubMenuList from './SubMenuList';
import type { MenuMode } from '../interface';

export interface InlineSubMenuListProps {
  id?: string;
  open: boolean;
  keyPath: string[];
  children: React.ReactNode;
}

export default function InlineSubMenuList({ id, open, keyPath, children }: InlineSubMenuListProps) {
  const fixedMode: MenuMode = 'inline';

  const { prefixCls, forceSubMenuRender, motion, defaultMotions, mode } =
    React.useContext(MenuContext);

  // Always use latest mode check
  const sameModeRef = React.useRef(false);
  sameModeRef.current = mode === fixedMode;

  // We record `destroy` mark here since when mode change from `inline` to others.
  // The inline list should remove when motion end.
  const [destroy, setDestroy] = React.useState(!sameModeRef.current);

  const mergedOpen = sameModeRef.current ? open : false;

  // ================================= Effect =================================
  // Reset destroy state when mode change back
  React.useEffect(() => {
    if (sameModeRef.current) {
      setDestroy(false);
    }
  }, [mode]);

  // ================================= Render =================================
  const mergedMotion = { ...getMotion(fixedMode, motion, defaultMotions) };

  // No need appear since nest inlineCollapse changed
  if (keyPath.length > 1) {
    mergedMotion.motionAppear = false;
  }

  // Hide inline list when mode changed and motion end
  const originOnVisibleChanged = mergedMotion.onVisibleChanged;
  mergedMotion.onVisibleChanged = newVisible => {
    if (!sameModeRef.current && !newVisible) {
      setDestroy(true);
    }

    return originOnVisibleChanged?.(newVisible);
  };

  if (destroy) {
    return null;
  }

  return (
    <MenuContextProvider mode={fixedMode} locked={!sameModeRef.current}>
      <CSSMotion
        visible={mergedOpen}
        {...mergedMotion}
        forceRender={forceSubMenuRender}
        removeOnLeave={false}
        leavedClassName={`${prefixCls}-hidden`}
      >
        {({ className: motionClassName, style: motionStyle }) => {
          return (
            <SubMenuList id={id} className={motionClassName} style={motionStyle}>
              {children}
            </SubMenuList>
          );
        }}
      </CSSMotion>
    </MenuContextProvider>
  );
}
