import * as React from 'react';
import classNames from 'classnames';
import { parseChildren } from './utils/nodeUtil';
import { MenuContext } from './context';

export interface MenuItemGroupProps {
  className?: string;
  title?: React.ReactNode;
  children?: React.ReactNode;

  // disabled?: boolean;
  // renderMenuItem?: (
  //   item: React.ReactElement,
  //   index: number,
  //   key: string,
  // ) => React.ReactElement;
  // index?: number;
  // subMenuKey?: string;
  // rootPrefixCls?: string;
  // onClick?: MenuClickEventHandler;
  // direction?: 'ltr' | 'rtl';
}

export default function MenuItemGroup({
  className,
  title,
  children,
  ...restProps
}: MenuItemGroupProps) {
  const { prefixCls } = React.useContext(MenuContext);

  const groupPrefixCls = `${prefixCls}-item-group`;

  const childList: React.ReactElement[] = parseChildren(children);

  return (
    <li
      {...restProps}
      onClick={e => e.stopPropagation()}
      className={classNames(groupPrefixCls, className)}
    >
      <div
        className={`${groupPrefixCls}-title`}
        title={typeof title === 'string' ? title : undefined}
      >
        {title}
      </div>
      <ul className={`${groupPrefixCls}-list`}>{childList}</ul>
    </li>
  );
}
