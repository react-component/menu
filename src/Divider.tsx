import * as React from 'react';
import classNames from 'classnames';
import { MenuContext } from './context';

export interface DividerProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function Divider({ className, style }: DividerProps) {
  const { prefixCls } = React.useContext(MenuContext);

  return (
    <li
      className={classNames(`${prefixCls}-item-divider`, className)}
      style={style}
    />
  );
}
