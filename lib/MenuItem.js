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
    divider: React.PropTypes.bool,
    href: React.PropTypes.string,
    title: React.PropTypes.string,
    onSelect: React.PropTypes.func,
    eventKey: React.PropTypes.any
  },

  handleKeyDown: function (e) {
    var keyCode = e.keyCode;
    if (keyCode === KeyCode.ENTER){
      this.handleClick(e);
    }
  },
  handleHover: function (e) {
    var type = e.type;
    var selectItem = this.props.selectItem;
    if (!selectItem) {
      return;
    }
    if (type === 'mouseenter') {
      selectItem(this);
    } else {
      selectItem(null);
    }
  },
  handleClick: function () {
    if (this.props.onSelect && !this.props.disabled) {
      this.props.onSelect(this.props.eventKey);
    }
  },

  render: function () {
    //var { disabled, active, href, title, ...props } = this.props;

    var props = this.props;

    var classes = {
      divider: props.divider,
      active: props.active,
      disabled: props.disabled
    };

    var children = null;
    var aProps = props.href ? {href: props.href} : {};
    if (!this.props.divider) {
      children = (
        <a
          //ref={"menuItem" + util.guid()}
          ref="_anchor"
          onClick={this.handleClick}
          //href={props.href || ''}
          {...aProps}
          title={props.title} tabIndex="-1">
          {props.children}
        </a>
      );
    }

    return (
      <li {...props}
        ref="_menuItem"
        title={null} href={null}
        onMouseEnter={this.handleHover}
        onMouseLeave={this.handleHover}
        className={joinClasses(props.className, classSet(classes))}
        role="menuitem"
        aria-disabled={props.disabled}>
        {children}
      </li>
    );
  }
});

module.exports = MenuItem;
