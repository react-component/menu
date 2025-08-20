import * as React from 'react';
import { clsx } from 'clsx';
import { MenuContext } from './context/MenuContext';
import { useMeasure } from './context/PathContext';
import type { MenuDividerType } from './interface';
import { useFullPath } from './context/PathContext';

export type DividerProps = Omit<MenuDividerType, 'type'>;

export default function Divider(props: DividerProps) {
  const { className, style, itemRender: propItemRender } = props;
  const { prefixCls, itemRender: contextItemRender } = React.useContext(MenuContext);
  const measure = useMeasure();
  const connectedKeyPath = useFullPath();

  if (measure) {
    return null;
  }

  const renderNode = (
    <li
      role="separator"
      className={clsx(`${prefixCls}-item-divider`, className)}
      style={style}
    />
  );

  const mergedItemRender = propItemRender || contextItemRender;

  if (typeof mergedItemRender === 'function') {
    return mergedItemRender(renderNode, {
      item: { type: 'divider', ...props },
      keys: connectedKeyPath,
    });
  }

  return renderNode;
}
