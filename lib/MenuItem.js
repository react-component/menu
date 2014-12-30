/** @jsx React.DOM */

var React = require('react');
var joinClasses = require('./utils/joinClasses');
var classSet = require('./utils/classSet');

var MenuItem = React.createClass({
  propTypes: {
    active: React.PropTypes.bool,
    disabled: React.PropTypes.bool,
    divider:   React.PropTypes.bool,
    href:      React.PropTypes.string,
    title:     React.PropTypes.string,
    onSelect:  React.PropTypes.func,
    eventKey: React.PropTypes.any
  },

  getDefaultProps: function () {
    return {
      href: '#'
    };
  },

  getInitialState: function () {
    return {
      active: this.props.active || false
    };
  },

  focusEle: function () {
    console.log( this.refs.menuItem );
  },

  handleClick: function (e) {
    if (this.props.onSelect) {
      e.preventDefault();

      if (!this.props.disabled) {
        this.props.onSelect(this.props.eventKey, this.props.href);
      }
    }
  },

  render: function () {
    /*
    var {
        disabled,
        active,
        href,
        title,
        ...props } = this.props;
    */
    var props = this.props;

    var classes = {
        'divider':  props.divider,
        //'active': active,
        'active': props.active,
        'disabled': props.disabled
      };

    var children = null;
    if (!this.props.divider) {
      children = (
        //<a onClick={this.handleClick} href={href} title={title} tabIndex="-1">
        <a onClick={this.handleClick} href={props.href} title={props.title}>
          {props.children}
        </a>
      );
    }

    return (
      <li {...props} role="presentation" title={null} href={null}
        ref="menuItem"
        className={joinClasses(props.className, classSet(classes))}>
        {children}
      </li>
    );
  }
});

module.exports = MenuItem;
