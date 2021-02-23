import warning from 'rc-util/lib/warning';
import type { CSSMotionProps } from 'rc-motion';
import type { OpenAnimation, MenuMode } from '../interface';

interface GetMotionProps {
  motion?: CSSMotionProps;
  defaultMotions?: Partial<{ [key in MenuMode | 'other']: CSSMotionProps }>;
  openAnimation?: OpenAnimation;
  openTransitionName?: string;
  prefixCls?: string;
}

interface GetMotionState {
  switchingModeFromInline: boolean;
}

export function getMotion(
  {
    prefixCls,
    motion,
    defaultMotions = {},
    openAnimation,
    openTransitionName,
  }: GetMotionProps,
  { switchingModeFromInline }: GetMotionState,
  menuMode: MenuMode,
): CSSMotionProps {
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
  // Default logic
  const defaultMotion = defaultMotions[menuMode];

  if (defaultMotion) {
    return defaultMotion;
  }

  // When mode switch from inline
  // submenu should hide without animation
  return switchingModeFromInline ? null : defaultMotions.other;
}
