/** @jsx React.DOM */

var React = require('react');
var joinClasses = require('./utils/joinClasses');
var classSet = require('./utils/classSet');
var cloneWithProps = require('./utils/cloneWithProps');

var createChainedFunction = require('./utils/createChainedFunction');
var DropdownStateMixin = require('./DropdownStateMixin');
var ValidComponentChildren = require('./utils/ValidComponentChildren');


var Dropdown = React.createClass({
  mixins: [DropdownStateMixin],

  propTypes: {
    pullRight: React.PropTypes.bool,
    dropup:    React.PropTypes.bool,
    title:     React.PropTypes.node,
    href:      React.PropTypes.string,
    onClick:   React.PropTypes.func,
    onSelect:  React.PropTypes.func,
    navItem:   React.PropTypes.bool
  },
  getDefaultProps: function () {
    return {
      title: <span>Dropdown <span class="caret"></span></span>
    };
  },
  render: function () {
    var className = 'dropdown-toggle';
    var classes = {
        'dropdown-menu': true,
        'dropdown-menu-right': this.props.pullRight
      };

    return this.renderNavItem([
      <a
        href={this.props.href}
        ref="dropdownButton"
        //className={joinClasses(this.props.className, className)}
        className={className}
        onClick={this.handleDropdownClick}
        data-toggle="dropdown" role="button" aria-expanded="false">
      {this.props.title}
      </a>,
      <ul
        {...this.props}
        aria-labelledby={this.props.id}
        className={classSet(classes)}
        role="menu">
          {ValidComponentChildren.map(this.props.children, this.renderMenuItem)}
        </ul>
    ]);
  },

  renderNavItem: function (children) {
    var classes = {
        'dropdown': true,
        'open': this.state.open,
        'dropup': this.props.dropup
      };

    return (
      //<li className={classSet(classes)}>
      <li className={joinClasses(this.props.className, classSet(classes))}>
        {children}
      </li>
    );
  },

  renderMenuItem: function (child, index) {
    // Only handle the option selection if an onSelect prop has been set on the
    // component or it's child, this allows a user not to pass an onSelect
    // handler and have the browser preform the default action.
    var handleOptionSelect = this.props.onSelect || child.props.onSelect ?
      this.handleOptionSelect : null;

    return cloneWithProps(
      child,
      {
        // Capture onSelect events
        onSelect: createChainedFunction(child.props.onSelect, handleOptionSelect),

        // Force special props to be transferred
        key: child.key ? child.key : index,
        ref: child.ref
      }
    );
  },

  handleDropdownClick: function (e) {
    e.preventDefault();

    this.setDropdownState(!this.state.open);
  },

  handleOptionSelect: function (key) {
    if (this.props.onSelect) {
      this.props.onSelect(key);
    }

    this.setDropdownState(false);
  }
});

module.exports = Dropdown;
