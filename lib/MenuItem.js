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
    } else if (type === 'mouseleave') {
      selectItem(null);
    }
  },
  handleClick: function (e) {
    if (this.props.onSelect) {
      e.preventDefault();
      e.stopPropagation();

      if (!this.props.disabled) {
        this.props.onSelect(this.props.eventKey);
      }
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
    if (!this.props.divider) {
      children = (
        <a ref={"menuItem" + util.guid()}
          onClick={this.handleClick}
          href={props.href || '#'}
          title={props.title} tabIndex="-1">
          {props.children}
        </a>
      );
    }

    return (
      <li {...props} role="presentation"
        title={null} href={null}
        onMouseEnter={this.handleHover}
        onMouseLeave={this.handleHover}
        className={joinClasses(props.className, classSet(classes))}>
        {children}
      </li>
    );
  }
});

module.exports = MenuItem;
