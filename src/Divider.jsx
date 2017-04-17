import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';

const Divider = createReactClass({
  displayName: 'Divider',

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
