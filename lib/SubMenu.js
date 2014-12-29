/** @jsx React.DOM */

/**
 *  SubMenu使用了bootstrap的dropdown的结构和样式
 * */

var React = require('react');
var joinClasses = require('./utils/joinClasses');
var classSet = require('./utils/classSet');
var cloneWithProps = require('./utils/cloneWithProps');
var createChainedFunction = require('./utils/createChainedFunction');
var ValidComponentChildren = require('./utils/ValidComponentChildren');

var DropdownStateMixin = require('./SubMenuStateMixin');
var Menu = require('./Menu');

var SubMenu = React.createClass({
  mixins: [DropdownStateMixin],

  propTypes: {
    hover: React.PropTypes.bool,
    posRight: React.PropTypes.bool,
    posLeft: React.PropTypes.bool,
    pullRight: React.PropTypes.bool,
    dropup:    React.PropTypes.bool,
    title:     React.PropTypes.node,
    href:      React.PropTypes.string,
    onClick:   React.PropTypes.func,
    onSelect:  React.PropTypes.func
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
        {...this.props}
        title={null}
        pullRight={null}
        dropup={null}
        href={this.props.href || '#'}
        ref="dropdownButton"
        className={className}
        onClick={this.handleDropdownClick}
        onKeyDown={this.handleKeyDown}
        data-toggle="dropdown" role="button" aria-expanded="false">
      {this.props.title}
      </a>,
      <Menu
        //{...this.props}
        ref="menu"
        aria-labelledby={this.props.id}
        className={classSet(classes)}
        role="menu">
          {ValidComponentChildren.map(this.props.children, this.renderMenuItem)}
        </Menu>
    ]);
  },

  renderNavItem: function (children) {
    var classes = {
        'open': this.state.open
      };

    if(this.props.posRight) {
      classes['dropdown-submenu'] = true
    } else if(this.props.posLeft){
      classes['dropdown-submenu'] = true
      classes['pull-left'] = true
    } else {
      classes['dropdown'] = true
      classes['dropup'] = this.props.dropup
    }

    return (
      //<li className={classSet(classes)}>
      <li
        onMouseEnter={this.handleHover}
        onMouseLeave={this.handleHover}
        className={joinClasses(this.props.className, classSet(classes))}>
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
  //keydown event
  handleKeyDown: function (e) {

    this.refs.menu.handleKeyDown(e)

  },

  //mouse events
  handleHover: function (e) {
    if(this.props.hover){
      this.handleDropdownClick(e)
    }
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

module.exports = SubMenu;
