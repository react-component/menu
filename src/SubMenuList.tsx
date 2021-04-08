import * as React from 'react';
import classNames from 'classnames';
import { MenuContext } from './context';

export interface SubMenuListProps
  extends React.HTMLAttributes<HTMLUListElement> {
  children?: React.ReactNode;
}

export default function SubMenuList({
  className,
  children,
  ...restProps
}: SubMenuListProps) {
  const { prefixCls } = React.useContext(MenuContext);

  // TODO: props
  return (
    <ul
      className={classNames(
        `${prefixCls}-sub`,
        {
          // TODO: Do we need keep this?
          // [`${prefixCls}-inline`]: mode === 'inline',
        },
        className,
      )}
      {...restProps}
    >
      {children}
    </ul>
  );
}
