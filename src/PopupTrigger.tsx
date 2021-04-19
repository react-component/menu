import * as React from 'react';
import Trigger from 'rc-trigger';
import classNames from 'classnames';
import type { CSSMotionProps } from 'rc-motion';
import { MenuContext } from './context';
import { placements, placementsRtl } from './placements';
import type { MenuMode } from './interface';
import { getMotion } from './utils/motionUtil';

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

    // Motion
    motion,
    defaultMotions,
  } = React.useContext(MenuContext);

  const placement = rtl
    ? { ...placementsRtl, ...builtinPlacements }
    : { ...placements, ...builtinPlacements };

  const popupPlacement = popupPlacementMap[mode];

  const mergedMotion: CSSMotionProps = {
    ...getMotion(mode, motion, defaultMotions),
    leavedClassName: `${prefixCls}-hidden`,
    removeOnLeave: false,
    motionAppear: true,
  };

  return (
    <Trigger
      prefixCls={prefixCls}
      popupClassName={classNames(
        `${prefixCls}-popup`,
        {
          [`${prefixCls}-rtl`]: rtl,
        },
        popupClassName,
      )}
      getPopupContainer={getPopupContainer}
      builtinPlacements={placement}
      popupPlacement={popupPlacement}
      popupVisible={visible}
      popup={popup}
      popupAlign={popupOffset && { offset: popupOffset }}
      action={disabled ? [] : [triggerSubMenuAction]}
      mouseEnterDelay={subMenuOpenDelay}
      mouseLeaveDelay={subMenuCloseDelay}
      onPopupVisibleChange={onVisibleChange}
      forceRender={forceSubMenuRender}
      popupMotion={mergedMotion}
    >
      {children}
    </Trigger>
  );
}
