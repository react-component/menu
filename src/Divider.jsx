'use strict';

var React = require('react');
var assign = require('object-assign');

class Divider extends React.Component {
  render() {
    var props = assign({}, this.props);
    var className = props.className || '';
    var rootPrefixCls = props.rootPrefixCls;
    className += ' ' + `${rootPrefixCls}-item-divider`;
    props.className = className;
    return <li {...props} />;
  }
}

Divider.defaultProps = {
  disabled: true
};

module.exports = Divider;
