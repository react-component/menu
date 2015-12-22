import React from 'react';

const Divider = React.createClass({
  getDefaultProps() {
    return {
      disabled: true,
    };
  },

  render() {
    const props = this.props;
    let className = props.className || '';
    const rootPrefixCls = props.rootPrefixCls;
    className += ' ' + `${rootPrefixCls}-item-divider`;
    return <li {...props} className={className}/>;
  },
});

export default Divider;
