import * as React from 'react';
import classNames from 'classnames';
import { parseChildren } from './utils/nodeUtil';
import { MenuContext } from './context/MenuContext';
import { useKeyPath, useMeasure } from './context/PathContext';

export interface MenuItemGroupProps {
  className?: string;
  title?: React.ReactNode;
  children?: React.ReactNode;

  /** @private Internal filled key. Do not set it directly */
  eventKey?: string;
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
      <ul className={`${groupPrefixCls}-list`}>{children}</ul>
    </li>
  );
};

export default function MenuItemGroup({
  children,
  ...props
}: MenuItemGroupProps): React.ReactElement {
  const connectedKeyPath = useKeyPath(props.eventKey);
  const childList: React.ReactElement[] = parseChildren(
    children,
    connectedKeyPath,
  );

  const measure = useMeasure();
  if (measure) {
    return (childList as any) as React.ReactElement;
  }

  return <InternalMenuItemGroup {...props}>{childList}</InternalMenuItemGroup>;
}
