import warning from 'rc-util/lib/warning';
import { MotionType, TransitionNameType, OpenAnimation } from '../interface';

interface GetMotionProps {
  motion?: MotionType;
  defaultMotion?: MotionType;
  openAnimation?: OpenAnimation;
  openTransitionName?: TransitionNameType;
  prefixCls?: string;
}

interface GetMotionState {
  switchingModeFromInline: boolean;
}

export function getMotion(
  {
    prefixCls,
    motion,
    defaultMotion,
    openAnimation,
    openTransitionName,
  }: GetMotionProps,
  { switchingModeFromInline }: GetMotionState,
): MotionType {
  if (motion) {
    return motion;
  }

  if (typeof openAnimation === 'object' && openAnimation) {
    warning(
      false,
      'Object type of `openAnimation` is removed. Please use `motion` instead.',
    );
  } else if (typeof openAnimation === 'string') {
    return {
      motionName: `${prefixCls}-open-${openAnimation}`,
    };
  }

  if (openTransitionName) {
    return {
      motionName: openTransitionName,
    };
  }

  // When mode switch from inline
  // submenu should hide without animation
  return switchingModeFromInline ? null : defaultMotion;
}
