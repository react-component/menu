import * as React from 'react';
import classNames from 'classnames';
import { MenuContext } from './context/MenuContext';
import { useMeasure } from './context/PathContext';
import type { MenuDividerType } from './interface';

export type DividerProps = Omit<MenuDividerType, 'type'>;

export default function Divider({ className, style, itemRender }: DividerProps) {
  const { prefixCls } = React.useContext(MenuContext);
  const measure = useMeasure();

  if (measure) {
    return null;
  }

  const renderNode = (
    <li
      role="separator"
      className={classNames(`${prefixCls}-item-divider`, className)}
      style={style}
    />
  );

  if (typeof itemRender === 'function') {
    return itemRender(renderNode);
  }

  return renderNode;
}
