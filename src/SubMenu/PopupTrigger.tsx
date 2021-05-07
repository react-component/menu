import * as React from 'react';
import Trigger from 'rc-trigger';
import classNames from 'classnames';
import raf from 'rc-util/lib/raf';
import type { CSSMotionProps } from 'rc-motion';
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

  const [innerVisible, setInnerVisible] = React.useState(false);

  const placement = rtl
    ? { ...placementsRtl, ...builtinPlacements }
    : { ...placements, ...builtinPlacements };

  const popupPlacement = popupPlacementMap[mode];

  const targetMotion = getMotion(mode, motion, defaultMotions);

  const mergedMotion: CSSMotionProps = {
    ...targetMotion,
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
      popupClassName={classNames(
        `${prefixCls}-popup`,
        {
          [`${prefixCls}-rtl`]: rtl,
        },
        popupClassName,
      )}
      stretch={mode === 'horizontal' ? 'minWidth' : null}
      getPopupContainer={getPopupContainer}
      builtinPlacements={placement}
      popupPlacement={popupPlacement}
      popupVisible={innerVisible}
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
