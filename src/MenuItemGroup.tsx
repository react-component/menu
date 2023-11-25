import classNames from 'classnames';
import omit from 'rc-util/lib/omit';
import * as React from 'react';
import { MenuContext } from './context/MenuContext';
import { useFullPath, useMeasure } from './context/PathContext';
import type { MenuItemGroupType } from './interface';
import { parseChildren } from './utils/commonUtil';

export interface MenuItemGroupProps
  extends Omit<MenuItemGroupType, 'type' | 'children' | 'label'> {
  title?: React.ReactNode;

  children?: React.ReactNode;

  /** @private Internal filled key. Do not set it directly */
  eventKey?: string;

  /** @private Do not use. Private warning empty usage */
  warnKey?: boolean;
}

const InternalMenuItemGroup = ({
  className,
  title,
  eventKey,
  children,
  ...restProps
}: MenuItemGroupProps) => {
  const { prefixCls } = React.useContext(MenuContext);

  const groupPrefixCls = `${prefixCls}-item-group`;

  return (
    <li
      role="presentation"
      {...restProps}
      onClick={e => e.stopPropagation()}
      className={classNames(groupPrefixCls, className)}
    >
      <div
        role="presentation"
        className={`${groupPrefixCls}-title`}
        title={typeof title === 'string' ? title : undefined}
      >
        {title}
      </div>
      <ul role="group" className={`${groupPrefixCls}-list`}>
        {children}
      </ul>
    </li>
  );
};

export default function MenuItemGroup({
  children,
  ...props
}: MenuItemGroupProps): React.ReactElement {
  const connectedKeyPath = useFullPath(props.eventKey);
  const childList: React.ReactElement[] = parseChildren(
    children,
    connectedKeyPath,
  );

  const measure = useMeasure();
  if (measure) {
    return (childList as any) as React.ReactElement;
  }

  return (
    <InternalMenuItemGroup {...omit(props, ['warnKey'])}>
      {childList}
    </InternalMenuItemGroup>
  );
}
