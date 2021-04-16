import * as React from 'react';
import classNames from 'classnames';
import { parseChildren } from './utils/nodeUtil';
import { MenuContext } from './context';

export interface MenuItemGroupProps {
  className?: string;
  title?: React.ReactNode;
  children?: React.ReactNode;

  /** @private Internal filled key. Do not set it directly */
  eventKey?: string;
}

export default function MenuItemGroup({
  className,
  title,
  eventKey,
  children,
  ...restProps
}: MenuItemGroupProps) {
  const { prefixCls, parentKeys } = React.useContext(MenuContext);

  const groupPrefixCls = `${prefixCls}-item-group`;

  const childList: React.ReactElement[] = parseChildren(children, [
    ...parentKeys,
    eventKey,
  ]);

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
