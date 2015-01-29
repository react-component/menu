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
      activeFirst: false
    };
  },

  _getPrefixCls: function () {
    return this.props.rootPrefixCls + '-submenu';
  },

  _getActiveClassName: function () {
    return this.props.activeClassName || this.props.rootPrefixCls + '-submenu-active';
  },

  _getDisabledClassName: function () {
    return this.props.disabledClassName || this.props.rootPrefixCls + '-submenu-disabled';
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
    var self = this;

    if (keyCode === KeyCode.ENTER) {
      this.handleClick(e);
      this.setState({
        activeFirst: true
      });
      return true;
    }

    if (keyCode === KeyCode.RIGHT) {
      if (this.state.open) {
        menu.handleKeyDown(e);
      } else {
        this.setOpenState(true);
        this.setState({
          activeFirst: true
        });
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
    props.onHover(props.eventKey);
    if (props.openOnHover) {
      this.setOpenState(true);
      this.setState({
        activeFirst: false
      });
    }
  },

  handleMouseLeave: function () {
    if (!this.state.open) {
      this.props.onHover(null);
    }
  },

  handleClick: function () {
    this.setOpenState(true);
    this.setState({
      activeFirst: false
    });
  },

  handleSelect: function (childKey, child) {
    this.props.onSelect(childKey, child);
  },

  handleDeselect: function (childKey, child) {
    this.props.onDeselect(childKey, child);
  },

  render: function () {
    var props = this.props;
    var classes = {};
    var prefixCls = this._getPrefixCls();
    classes[this._getOpenClassName()] = this.state.open;
    classes[this._getActiveClassName()] = props.active;
    classes[this._getDisabledClassName()] = props.disabled;
    this._menuId = this._menuId || util.guid();
    classes[prefixCls] = true;
    var clickEvents = {};
    var mouseEvents = {};
    var titleMouseEvents = {};
    if (!props.disabled) {
      clickEvents = {
        onClick: this.handleClick
      };
      mouseEvents = {
        onMouseLeave: this.handleMouseLeave
      };
      // only works in title, not outer li
      titleMouseEvents = {
        onMouseEnter: this.handleMouseEnter
      };
    }
    return (
      <li className={joinClasses(props.className, classSet(classes))}  {...mouseEvents}>
        <div
          className={prefixCls + '-title'}
          {...titleMouseEvents}
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
    if (!this.state.open) {
      // prevent destroy
      return this._cacheMenu || null;
    }
    var childrenCount = React.Children.count(children);
    this.nameRef = this.nameRef || util.guid();
    var baseProps = {
      sub: true,
      focusable: false,
      onSelect: this.handleSelect,
      onDeselect: this.handleDeselect,
      activeFirst: this.state.activeFirst,
      multiple: this.props.multiple,
      id: this._menuId,
      ref: this.nameRef
    };
    if (this._cacheMenu) {
      baseProps.selectedKeys = this.refs[this.nameRef].state.selectedKeys;
    }
    if (childrenCount == 1 && children.type === Menu.type) {
      var menu = children;
      this.nameRef = menu.ref || this.nameRef;
      baseProps.nameRef = this.nameRef;
      this._cacheMenu = cloneWithProps(menu, baseProps);
    } else {
      this._cacheMenu = <Menu {...baseProps}>{children}</Menu>;
    }
    return this._cacheMenu;
  }
});

module.exports = SubMenu;
