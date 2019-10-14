import warning from 'rc-util/lib/warning';
import { MotionType, AnimationType, TransitionNameType } from '../interface';

interface GetMotionProps {
  motion?: MotionType;
  openAnimation?: AnimationType;
  openTransitionName?: TransitionNameType;
  prefixCls?: string;
}

export function getMotion({
  prefixCls,
  motion,
  openAnimation,
  openTransitionName,
}: GetMotionProps): MotionType {
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

  return null;
}
