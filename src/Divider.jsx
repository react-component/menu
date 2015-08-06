import React from 'react';

class Divider extends React.Component {
  render() {
    const props = this.props;
    let className = props.className || '';
    const rootPrefixCls = props.rootPrefixCls;
    className += ' ' + `${rootPrefixCls}-item-divider`;
    return <li {...props} className={className}/>;
  }
}

Divider.defaultProps = {
  disabled: true,
};

export default Divider;
