import * as React from 'react';
import CSSMotion from 'rc-motion';
import { getMotion } from '../utils/motionUtil';
import MenuContextProvider, { MenuContext } from '../context';
import SubMenuList from './SubMenuList';
import type { MenuMode } from '../interface';

export interface InlineSubMenuListProps {
  open: boolean;
  children: React.ReactNode;
}

export default function InlineSubMenuList({
  open,
  children,
}: InlineSubMenuListProps) {
  const fixedMode: MenuMode = 'inline';

  const {
    prefixCls,
    forceSubMenuRender,
    motion,
    defaultMotions,
    parentKeys,
    mode,
  } = React.useContext(MenuContext);

  const [destroy, setDestroy] = React.useState(false);

  // Always use latest mode check
  const sameModeRef = React.useRef(false);
  sameModeRef.current = mode === fixedMode;

  // ================================= Effect =================================
  React.useEffect(() => {
    if (sameModeRef.current) {
      setDestroy(false);
    }
  }, [mode]);

  // ================================= Render =================================
  const mergedMotion = { ...getMotion(fixedMode, motion, defaultMotions) };

  // No need appear since nest inlineCollapse changed
  if (parentKeys.length > 1) {
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
        visible={open}
        {...mergedMotion}
        forceRender={forceSubMenuRender}
        removeOnLeave={false}
        leavedClassName={`${prefixCls}-hidden`}
      >
        {({ className: motionClassName, style: motionStyle }) => {
          return (
            <SubMenuList className={motionClassName} style={motionStyle}>
              {children}
            </SubMenuList>
          );
        }}
      </CSSMotion>
    </MenuContextProvider>
  );
}
