import React from 'react';
import PropTypes from 'prop-types';

export default class Divider extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    rootPrefixCls: PropTypes.string,
    style: PropTypes.object,
  };

  static defaultProps = {
    // To fix keyboard UX.
    disabled: true,
    className: '',
    style: {},
  };

  render() {
    const { className, rootPrefixCls, style } = this.props;
    return (
      <li
        className={`${className} ${rootPrefixCls}-item-divider`}
        style={style}
      />
    );
  }
}
