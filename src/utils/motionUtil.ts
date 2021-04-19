import type { CSSMotionProps } from 'rc-motion';

export function getMotion(
  mode: string,
  motion?: CSSMotionProps,
  defaultMotions: Record<string, CSSMotionProps> = {},
) {
  if (motion) {
    return motion;
  }

  return defaultMotions[mode] || defaultMotions.other || undefined;
}
