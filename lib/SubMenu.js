/** @jsx React.DOM */

var React = require('react');
var joinClasses = require('./utils/joinClasses');
var classSet = require('./utils/classSet');
var cloneWithProps = require('./utils/cloneWithProps');
var util = require('./utils/util');
var KeyCode = util.KeyCode;
var Menu = require('./Menu');

var SubMenu = React.createClass({
  propTypes: {
    openOnHover: React.PropTypes.bool,
    title: React.PropTypes.node,
    onClick: React.PropTypes.func
  },

  mixins: [require('./SubMenuStateMixin')],

  getInitialState: function () {
    return {
      prefixCls: this.props.rootPrefixCls + '-submenu',
      openClassName: this.props.openClassName || this.props.rootPrefixCls + '-submenu-open',
      activeClassName: this.props.activeClassName || this.props.rootPrefixCls + '-submenu-active',
      disabledClassName: this.props.disabledClassName || this.props.rootPrefixCls + '-submenu-disabled'
    };
  },

  componentWillReceiveProps: function (nextProps) {
    if (!nextProps.active) {
      this.setOpenState(false);
    }
  },

  getDefaultProps: function () {
    return {
      openOnHover: true,
      onMouseEnter: function () {
      },
      title: ''
    };
  },

  handleKeyDown: function (e) {
    var keyCode = e.keyCode;
    var menu = this.refs[this.nameRef];

    if (keyCode === KeyCode.ENTER) {
      this.handleClick(e);
      return true;
    }

    if (keyCode === KeyCode.RIGHT) {
      if (this.state.open) {
        menu.handleKeyDown(e);
      } else {
        this.setOpenState(true);
      }
      return true;
    }
    if (keyCode === KeyCode.LEFT) {
      var handled;
      if (this.state.open) {
        handled = menu.handleKeyDown(e);
      } else {
        return;
      }
      if (!handled) {
        this.setOpenState(false);
        handled = true;
      }
      return handled;
    }

    if (this.state.open && (keyCode === KeyCode.UP || keyCode === KeyCode.DOWN)) {
      return menu.handleKeyDown(e);
    }
  },

  handleMouseEnter: function () {
    var props = this.props;
    props.onMouseEnter(props.eventKey);
    if (props.openOnHover) {
      this.setOpenState(true);
    }
  },

  handleClick: function () {
    this.setOpenState(true);
  },

  onSelect: function (childKey) {
    this.props.onSelect(childKey);
  },

  render: function () {
    var props = this.props;
    var classes = {};
    classes[this.state.openClassName] = this.state.open;
    classes[this.state.activeClassName] = props.active;
    classes[this.state.disabledClassName] = props.disabled;
    this._menuId = this._menuId || util.guid();
    classes[this.state.prefixCls] = true;
    var clickEvents = {};
    var mouseEvents = {};
    if (!props.disabled) {
      clickEvents = {
        onClick: this.handleClick
      };
      mouseEvents = {
        onMouseEnter: this.handleMouseEnter
      };
    }
    return (
      <li
        {...mouseEvents}
        className={joinClasses(props.className, classSet(classes))}>
        <div
          {...clickEvents}
          aria-expanded={props.active}
          aria-owns={this._menuId}
          aria-haspopup="true"
        >
        {props.title}
        </div>
          {this.renderChildren(props.children)}
      </li>
    );
  },
  renderChildren: function (children) {
    var childrenCount = React.Children.count(children);
    this.nameRef = this.nameRef || util.guid();
    if (childrenCount == 1 && children.type === Menu.type) {
      var menu = children;
      this.nameRef = menu.ref || this.nameRef;
      return cloneWithProps(menu, {
        focusable: false,
        onSelect: this.onSelect,
        id: this._menuId,
        ref: this.nameRef
      });
    }
    return <Menu focusable={false} ref={this.nameRef} onSelect={this.onSelect} id={this._menuId}>{children}</Menu>
  }
});

module.exports = SubMenu;
