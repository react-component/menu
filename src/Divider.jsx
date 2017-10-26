import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';

const Divider = createReactClass({
  displayName: 'Divider',

  propTypes: {
    className: PropTypes.string,
    rootPrefixCls: PropTypes.string,
  },

  getDefaultProps() {
    // To fix keyboard UX.
    return { disabled: true };
  },

  render() {
    const { className = '', rootPrefixCls } = this.props;
    return <li className={`${className} ${rootPrefixCls}-item-divider`}/>;
  },
});

export default Divider;
