import * as React from 'react';
import classNames from 'classnames';
import { MenuContext } from '../context';

export interface SubMenuListProps
  extends React.HTMLAttributes<HTMLUListElement> {
  children?: React.ReactNode;
}

export default function SubMenuList({
  className,
  children,
  ...restProps
}: SubMenuListProps) {
  const { prefixCls, mode } = React.useContext(MenuContext);

  // TODO: props
  return (
    <ul
      className={classNames(
        prefixCls,
        `${prefixCls}-sub`,
        `${prefixCls}-${mode === 'inline' ? 'inline' : 'vertical'}`,
        className,
      )}
      {...restProps}
    >
      {children}
    </ul>
  );
}
