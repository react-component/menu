'use strict';

var React = require('react');

class Divider extends React.Component {
  render() {
    var props = this.props;
    var className = props.className || '';
    var rootPrefixCls = props.rootPrefixCls;
    className += ' ' + `${rootPrefixCls}-item-divider`;
    return <li {...props} className={className}/>;
  }
}

Divider.defaultProps = {
  disabled: true
};

module.exports = Divider;
