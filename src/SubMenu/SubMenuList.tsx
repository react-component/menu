import * as React from 'react';
import { clsx } from 'clsx';
import { MenuContext } from '../context/MenuContext';

export interface SubMenuListProps extends React.HTMLAttributes<HTMLUListElement> {
  children?: React.ReactNode;
}

const InternalSubMenuList = (
  { className, children, ...restProps }: SubMenuListProps,
  ref: React.Ref<HTMLUListElement>,
) => {
  const { prefixCls, mode, rtl } = React.useContext(MenuContext);

  return (
    <ul
      className={clsx(
        prefixCls,
        rtl && `${prefixCls}-rtl`,
        `${prefixCls}-sub`,
        `${prefixCls}-${mode === 'inline' ? 'inline' : 'vertical'}`,
        className,
      )}
      role="menu"
      {...restProps}
      data-menu-list
      ref={ref}
    >
      {children}
    </ul>
  );
};

const SubMenuList = React.forwardRef(InternalSubMenuList);

if (process.env.NODE_ENV !== 'production') {
  SubMenuList.displayName = 'SubMenuList';
}

export default SubMenuList;
