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
    onHover: React.PropTypes.func
  },

  _getActiveClassName: function () {
    return this.props.activeClassName || this.props.rootPrefixCls + '-item-active';
  },

  _getPrefixCls: function () {
    return this.props.rootPrefixCls + '-item';
  },

  _getDisabledClassName: function () {
    return this.props.disabledClassName || this.props.rootPrefixCls + '-item-disabled';
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
      this.handleClick(e);
      return true;
    }
  },

  handleMouseLeave: function () {
    this.props.onHover(null);
  },

  handleMouseEnter: function () {
    var props = this.props;
    props.onHover(props.eventKey);
  },

  handleClick: function () {
    this.props.onSelect(this.props.eventKey);
  },

  render: function () {
    var props = this.props;
    var classes = {};
    classes[this._getActiveClassName()] = props.active;
    classes[this._getDisabledClassName()] = props.disabled;
    classes[this._getPrefixCls()] = true;
    var mouseEvent = {};
    if (!props.disabled) {
      mouseEvent = {
        onClick: this.handleClick,
        onMouseLeave: this.handleMouseLeave,
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
