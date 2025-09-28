import * as React from 'react';
import { clsx } from 'clsx';
import { MenuContext } from './context/MenuContext';
import { useMeasure } from './context/PathContext';
import type { MenuDividerType } from './interface';

export type DividerProps = Omit<MenuDividerType, 'type'>;

export default function Divider({ className, style }: DividerProps) {
  const { prefixCls } = React.useContext(MenuContext);
  const measure = useMeasure();

  if (measure) {
    return null;
  }

  return (
    <li role="separator" className={clsx(`${prefixCls}-item-divider`, className)} style={style} />
  );
}
