import React, { PropTypes } from 'react';

const Divider = React.createClass({
  propTypes: {
    disabled: PropTypes.bool,
    className: PropTypes.string,
    rootPrefixCls: PropTypes.string,
  },

  getDefaultProps() {
    return {
      disabled: true,
    };
  },

  render() {
    const { className = '', rootPrefixCls } = this.props;
    return <li className={`${className} ${rootPrefixCls}-item-divider`}/>;
  },
});

export default Divider;
