'use strict';

var React = require('react');

class MenuItemGroup extends React.Component {
  render() {
    var props = this.props;
    var className = props.className || '';
    var rootPrefixCls = props.rootPrefixCls;
    className += ` ${rootPrefixCls}-item-group`;
    var titleClassName = `${rootPrefixCls}-item-group-title`;
    var listClassName = `${rootPrefixCls}-item-group-list`;
    return <li className={className}>
      <div className={titleClassName}>{props.title}</div>
      <ul className={listClassName}>
        {React.Children.map(props.children, props.renderMenuItem)}
      </ul>
    </li>;
  }
}

MenuItemGroup.defaultProps = {
  // skip key down loop
  disabled: true
};
module.exports = MenuItemGroup;
