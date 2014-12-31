/** @jsx React.DOM */

var React = require('react');
var joinClasses = require('./utils/joinClasses');
var classSet = require('./utils/classSet');

var single = require('./single');

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

  handleClick: function (e) {
    if (this.props.onSelect) {
      e.preventDefault();

      if (!this.props.disabled) {
        this.props.onSelect(this.props.eventKey, this.props.href);
      }
    }
  },

  focusEle: function () {
    if(this.props.active && this.refs.menuItem){
      this.refs.menuItem.getDOMNode().focus()
    }
  },
  componentDidMount: function () {
    if(!single.haveFoucsed){
      this.focusEle()
      single.haveFoucs = true
    }
  },
  componentDidUpdate: function () {
    //console.log( 'up...' )
    this.focusEle()
  },

  render: function () {
    //var { disabled, active, href, title, ...props } = this.props;

    var props = this.props;

    var classes = {
      'divider':  props.divider,
      'active': props.active,
      'disabled': props.disabled
    };

    var children = null;
    if (!this.props.divider) {
      children = (
        <a ref="menuItem" onClick={this.handleClick} href={props.href} title={props.title}>
          {props.children}
        </a>
      );
    }

    return (
      <li {...props} role="presentation" title={null} href={null}
        className={joinClasses(props.className, classSet(classes))}>
        {children}
      </li>
    );
  }
});

module.exports = MenuItem;
