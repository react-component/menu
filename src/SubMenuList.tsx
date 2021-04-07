import * as React from 'react';
import classNames from 'classnames';
import { MenuContext } from './Menu';

export interface SubMenuListProps {
  children?: React.ReactNode;
}

export default function SubMenuList({ children }: SubMenuListProps) {
  const { prefixCls } = React.useContext(MenuContext);

  // TODO: props
  return (
    <ul
      className={classNames(`${prefixCls}-sub`, {
        // TODO: Do we need keep this?
        // [`${prefixCls}-inline`]: mode === 'inline',
      })}
    >
      {children}
    </ul>
  );
}
