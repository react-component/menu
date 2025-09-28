import * as React from 'react';
import Trigger from '@rc-component/trigger';
import { clsx } from 'clsx';
import raf from '@rc-component/util/lib/raf';
import type { CSSMotionProps } from '@rc-component/motion';
import { MenuContext } from '../context/MenuContext';
import { placements, placementsRtl } from '../placements';
import type { MenuMode } from '../interface';
import { getMotion } from '../utils/motionUtil';

const popupPlacementMap = {
  horizontal: 'bottomLeft',
  vertical: 'rightTop',
  'vertical-left': 'rightTop',
  'vertical-right': 'leftTop',
};

export interface PopupTriggerProps {
  prefixCls: string;
  mode: MenuMode;
  visible: boolean;
  children: React.ReactElement;
  popup: React.ReactNode;
  popupStyle?: React.CSSProperties;
  popupClassName?: string;
  popupOffset?: number[];
  disabled: boolean;
  onVisibleChange: (visible: boolean) => void;
}

export default function PopupTrigger({
  prefixCls,
  visible,
  children,
  popup,
  popupStyle,
  popupClassName,
  popupOffset,
  disabled,
  mode,
  onVisibleChange,
}: PopupTriggerProps) {
  const {
    getPopupContainer,
    rtl,
    subMenuOpenDelay,
    subMenuCloseDelay,
    builtinPlacements,
    triggerSubMenuAction,
    forceSubMenuRender,
    rootClassName,

    // Motion
    motion,
    defaultMotions,
  } = React.useContext(MenuContext);

  const [innerVisible, setInnerVisible] = React.useState(false);

  const placement = rtl
    ? { ...placementsRtl, ...builtinPlacements }
    : { ...placements, ...builtinPlacements };

  const popupPlacement = popupPlacementMap[mode];

  const targetMotion = getMotion(mode, motion, defaultMotions);
  const targetMotionRef = React.useRef(targetMotion);

  if (mode !== 'inline') {
    /**
     * PopupTrigger is only used for vertical and horizontal types.
     * When collapsed is unfolded, the inline animation will destroy the vertical animation.
     */
    targetMotionRef.current = targetMotion;
  }

  const mergedMotion: CSSMotionProps = {
    ...targetMotionRef.current,
    leavedClassName: `${prefixCls}-hidden`,
    removeOnLeave: false,
    motionAppear: true,
  };

  // Delay to change visible
  const visibleRef = React.useRef<number>();
  React.useEffect(() => {
    visibleRef.current = raf(() => {
      setInnerVisible(visible);
    });

    return () => {
      raf.cancel(visibleRef.current);
    };
  }, [visible]);

  return (
    <Trigger
      prefixCls={prefixCls}
      popupClassName={clsx(
        `${prefixCls}-popup`,
        { [`${prefixCls}-rtl`]: rtl },
        popupClassName,
        rootClassName,
      )}
      stretch={mode === 'horizontal' ? 'minWidth' : null}
      getPopupContainer={getPopupContainer}
      builtinPlacements={placement}
      popupPlacement={popupPlacement}
      popupVisible={innerVisible}
      popup={popup}
      popupStyle={popupStyle}
      popupAlign={popupOffset && { offset: popupOffset }}
      action={disabled ? [] : [triggerSubMenuAction]}
      mouseEnterDelay={subMenuOpenDelay}
      mouseLeaveDelay={subMenuCloseDelay}
      onPopupVisibleChange={onVisibleChange}
      forceRender={forceSubMenuRender}
      popupMotion={mergedMotion}
      fresh
    >
      {children}
    </Trigger>
  );
}
