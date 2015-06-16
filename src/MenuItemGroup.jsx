'use strict';

var React = require('react');
var assign = require('object-assign');
var rcUtil = require('rc-util');

class MenuItemGroup extends React.Component {
  render() {
    var props = assign({}, this.props);
    var className = props.className || '';
    var rootPrefixCls = props.rootPrefixCls;
    className += ` ${rootPrefixCls}-item-group`;

    // menuItem 在 disabled 时，是可以选中的
    // group title 是不能被选中的，不用menuItem
    console.log(props);
    var newProps = assign({}, this.props);
    delete newProps.children;
    this.newProps = newProps;

    return <li className={className}>
      <span>{props.title}</span>
      <ul>
        {rcUtil.Children.toArray(props.children).map(this.renderMenuItem, this)}
      </ul>
    </li>;
  }
  renderMenuItem(child) {
    return React.cloneElement(child, this.newProps);
  }
}

MenuItemGroup.defaultProps = {
  //disabled: true,
  title: ''
};

module.exports = MenuItemGroup;
