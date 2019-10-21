import * as React from 'react';

export interface DividerProps {
  className?: string;
  rootPrefixCls?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
}

const Divider: React.FC<DividerProps> = ({
  className,
  rootPrefixCls,
  style,
}) => (
  <li className={`${className} ${rootPrefixCls}-item-divider`} style={style} />
);

Divider.defaultProps = {
  // To fix keyboard UX.
  disabled: true,
  className: '',
  style: {},
};

export default Divider;
