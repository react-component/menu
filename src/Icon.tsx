import * as React from 'react';
import type { RenderIconInfo, RenderIconType } from './interface';

export interface IconProps {
  icon?: RenderIconType;
  props: RenderIconInfo;
  /** Fallback of icon if provided */
  children?: React.ReactElement;
}

export default function Icon({ icon, props, children }: IconProps) {
  let iconNode: React.ReactElement;

  if (icon === null || icon === false) {
    return null;
  }

  if (typeof icon === 'function') {
    iconNode = React.createElement(icon as any, {
      ...props,
    });
  } else if (typeof icon !== "boolean") {
    // Compatible for origin definition
    iconNode = icon as React.ReactElement;
  }

  return iconNode || children || null;
}
