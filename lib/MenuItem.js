/** @jsx React.DOM */

var React = require('react');
var joinClasses = require('./utils/joinClasses');
var classSet = require('./utils/classSet');
var util = require('./utils/util');
var KeyCode = util.KeyCode;

var MenuItem = React.createClass({
  propTypes: {
    active: React.PropTypes.bool,
    selected: React.PropTypes.bool,
    disabled: React.PropTypes.bool,
    title: React.PropTypes.string,
    onSelect: React.PropTypes.func,
    onDeselect: React.PropTypes.func,
    onHover: React.PropTypes.func,
    onDestroy: React.PropTypes.func
  },

  _getActiveClassName: function () {
    return this.props.activeClassName || this.props.rootPrefixCls + '-item-active';
  },

  _getSelectedClassName: function () {
    return this.props.activeClassName || this.props.rootPrefixCls + '-item-selected';
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
    var props = this.props;
    if (props.multiple) {
      if (props.selected) {
        props.onDeselect(props.eventKey, this);
      } else {
        props.onSelect(props.eventKey, this);
      }
    } else {
      props.onSelect(props.eventKey, this);
    }
  },

  render: function () {
    var props = this.props;
    var classes = {};
    classes[this._getActiveClassName()] = !props.disabled && props.active;
    classes[this._getSelectedClassName()] = props.selected;
    classes[this._getDisabledClassName()] = props.disabled;
    classes[this._getPrefixCls()] = true;
    var attrs = {
      title: props.title,
      className: joinClasses(props.className, classSet(classes)),
      role: "menuitem",
      "aria-selected": props.selected,
      "aria-disabled": props.disabled
    };
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
        {...attrs}
        {...mouseEvent}>
      {props.children}
      </li>
    );
  },

  componentWillUnmount: function () {
    var props = this.props;
    if (props.onDestroy) {
      props.onDestroy(props.eventKey);
    }
  }
});

module.exports = MenuItem;
