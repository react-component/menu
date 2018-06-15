import React from 'react';
import PropTypes from 'prop-types';

class Divider extends React.Component {
  render() {
    const { className = '', rootPrefixCls } = this.props;
    return <li className={`${className} ${rootPrefixCls}-item-divider`}/>;
  }
}

Divider.propTypes = {
  className: PropTypes.string,
  rootPrefixCls: PropTypes.string,
};

Divider.defaultProps = {
  disabled: true,
};

export default Divider;
