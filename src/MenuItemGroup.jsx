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
    //console.log(props);

    this.newChildren = rcUtil.Children.toArray(props.children).map(this.renderMenuItem, this);
    this.props.parent.newChildren = this.props.parent.newChildren.concat(this.newChildren);
    return <li className={className}>
      <span>{props.title}</span>
      <ul>
        {this.newChildren}
      </ul>
    </li>;
  }
  renderMenuItem(child) {
    return this.props.parent.renderMenuItem(child);
  }
}

MenuItemGroup.defaultProps = {
  disabled: true,
  title: ''
};

module.exports = MenuItemGroup;
