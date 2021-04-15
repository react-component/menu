import * as React from 'react';
import type { RenderIconType } from './interface';
import type { SubMenuProps } from './SubMenu';

export interface IconProps {
  icon?: RenderIconType;
  props: SubMenuProps & { isSubMenu: boolean };
  /** Fallback of icon if provided */
  children?: React.ReactElement;
}

export default function Icon({ icon, props, children }: IconProps) {
  let iconNode: React.ReactElement;

  if (typeof icon === 'function') {
    iconNode = React.createElement(this.props.expandIcon as any, {
      ...props,
    });
  } else {
    // Compatible for origin definition
    iconNode = icon as React.ReactElement;
  }

  return iconNode || children;
}
