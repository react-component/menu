/** @jsx React.DOM */

var React = require('react');
var joinClasses = require('./utils/joinClasses');
var classSet = require('./utils/classSet');
var util = require('./utils/util');
var KeyCode = util.KeyCode;

var MenuItem = React.createClass({
  propTypes: {
    active: React.PropTypes.bool,
    disabled: React.PropTypes.bool,
    title: React.PropTypes.string,
    onSelect: React.PropTypes.func,
    onMouseEnter: React.PropTypes.func
  },

  getInitialState: function () {
    return {
      prefixCls: this.props.rootPrefixCls + '-item',
      activeClassName: this.props.activeClassName || this.props.rootPrefixCls + '-item-active',
      disabledClassName: this.props.disabledClassName || this.props.rootPrefixCls + '-item-disabled'
    };
  },

  getDefaultProps: function () {
    return {
      onSelect: function () {
      },
      onMouseEnter: function () {
      }
    };
  },

  handleKeyDown: function (e) {
    var keyCode = e.keyCode;
    if (keyCode === KeyCode.ENTER) {
      return this.handleClick(e);
    }
  },

  handleMouseEnter: function () {
    var props = this.props;
    props.onMouseEnter(props.eventKey);
  },

  handleClick: function () {
    this.props.onSelect(this.props.eventKey);
    return true;
  },

  render: function () {
    var props = this.props;
    var classes = {
    };
    classes[this.state.activeClassName]=props.active;
    classes[this.state.disabledClassName]=props.disabled;
    classes[this.state.prefixCls] = true;
    var mouseEvent = {};
    if (!props.disabled) {
      mouseEvent = {
        onClick: this.handleClick,
        onMouseEnter: this.handleMouseEnter
      };
    }
    return (
      <li
        title={props.title}
        {...mouseEvent}
        className={joinClasses(props.className, classSet(classes))}
        role="menuitem"
        aria-disabled={props.disabled}>
      {props.children}
      </li>
    );
  }
});

module.exports = MenuItem;
