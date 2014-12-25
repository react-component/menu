/** @jsx React.DOM */

/**
*menu
*/

var React = require('react');
var joinClasses = require('./utils/joinClasses');
var classSet = require('./utils/classSet');
var ValidComponentChildren = require('./utils/ValidComponentChildren');

var cloneWithProps = require('./utils/cloneWithProps');
var createChainedFunction = require('./utils/createChainedFunction');


var Menu = React.createClass({
  propTypes: {
    onSelect: React.PropTypes.func,
    eventKey: React.PropTypes.any
  },
  getDefaultProps: function () {
    return {
      bsClass: 'nav'
    };
  },
  render: function () {
    var classes = {};
    classes[this.props.bsClass] = true;
    //classes['open'] = this.props.open;

    return (
      <ul {...this.props} className={joinClasses(this.props.className, classSet(classes))} ref="ul">
        {ValidComponentChildren.map(this.props.children, this.renderNavItem)}
      </ul>
    );
  },
  getChildActiveProp: function (child) {
    if (child.props.active) {
      return true;
    }
    if (this.props.activeKey != null) {
      if (child.props.eventKey == this.props.activeKey) {
        return true;
      }
    }
    if (this.props.activeHref != null) {
      if (child.props.href === this.props.activeHref) {
        return true;
      }
    }

    return child.props.active;
  },
  renderNavItem: function (child, index) {
    return cloneWithProps(
      child,
      {
        active: this.getChildActiveProp(child),
        activeKey: this.props.activeKey,
        activeHref: this.props.activeHref,
        onSelect: createChainedFunction(child.props.onSelect, this.props.onSelect),
        ref: child.ref,
        key: child.key ? child.key : index,
        navItem: true
      }
    );
  }
})

module.exports = Menu;
