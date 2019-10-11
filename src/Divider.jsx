import React from 'react';
import PropTypes from 'prop-types';

const Divider = ({ className, rootPrefixCls, style }) => (
  <li className={`${className} ${rootPrefixCls}-item-divider`} style={style} />
);

Divider.propTypes = {
  className: PropTypes.string,
  rootPrefixCls: PropTypes.string,
  style: PropTypes.object,
  // eslint-disable-next-line react/no-unused-prop-types
  disabled: PropTypes.bool,
};

Divider.defaultProps = {
  // To fix keyboard UX.
  disabled: true,
  className: '',
  style: {},
};

export default Divider;
