/** @jsx React.DOM */

var React = require('react');
var rcUtil = require('rc-util');
var joinClasses = rcUtil.joinClasses;
var classSet = rcUtil.classSet;
var guid = rcUtil.guid;
var KeyCode = rcUtil.KeyCode;
var Menu = require('./Menu');
var createChainedFunction = rcUtil.createChainedFunction;

var SubMenu = React.createClass({
  propTypes: {
    openOnHover: React.PropTypes.bool,
    title: React.PropTypes.node,
    onClick: React.PropTypes.func
  },

  mixins: [require('./SubMenuStateMixin')],

  getInitialState() {
    return {
      activeFirst: false
    };
  },

  saveMenuInstance(c) {
    this.menuInstance = c;
  },

  _getPrefixCls() {
    return this.props.rootPrefixCls + '-submenu';
  },

  _getActiveClassName() {
    return this.props.activeClassName || this.props.rootPrefixCls + '-submenu-active';
  },

  _getDisabledClassName() {
    return this.props.disabledClassName || this.props.rootPrefixCls + '-submenu-disabled';
  },

  componentWillReceiveProps(nextProps) {
    if (!nextProps.active) {
      this.setOpenState(false);
    }
  },

  getDefaultProps() {
    return {
      openOnHover: true,
      onMouseEnter() {
      },
      title: ''
    };
  },

  handleKeyDown(e) {
    var keyCode = e.keyCode;
    var menu = this.menuInstance;

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

  handleMouseEnter() {
    var props = this.props;
    props.onHover(props.eventKey);
    if (props.openOnHover) {
      this.setOpenState(true);
      this.setState({
        activeFirst: false
      });
    }
  },

  handleMouseLeave() {
    if (!this.state.open) {
      this.props.onHover(null);
    }
  },

  handleClick() {
    this.setOpenState(true);
    this.setState({
      activeFirst: false
    });
  },

  handleSelect(childKey, child, e) {
    this.props.onSelect(childKey, child, e);
  },

  handleDeselect(childKey, child, e) {
    this.props.onDeselect(childKey, child, e);
  },

  render() {
    var props = this.props;
    var classes = {};
    var prefixCls = this._getPrefixCls();
    classes[this._getOpenClassName()] = this.state.open;
    classes[this._getActiveClassName()] = props.active;
    classes[this._getDisabledClassName()] = props.disabled;
    this._menuId = this._menuId || guid();
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
  renderChildren(children) {
    if (!this.state.open) {
      // prevent destroy
      return this._cacheMenu || null;
    }
    var childrenCount = React.Children.count(children);
    var baseProps = {
      sub: true,
      focusable: false,
      onSelect: this.handleSelect,
      onDeselect: this.handleDeselect,
      activeFirst: this.state.activeFirst,
      multiple: this.props.multiple,
      id: this._menuId,
      ref: this.saveMenuInstance
    };
    if (this.menuInstance) {
      baseProps.selectedKeys = this.menuInstance.state.selectedKeys;
    }
    if (childrenCount === 1 && children.type === Menu) {
      var menu = children;
      baseProps.ref = createChainedFunction(menu.ref, this.saveMenuInstance);
      this._cacheMenu = React.cloneElement(menu, baseProps);
    } else {
      this._cacheMenu = <Menu {...baseProps}>{children}</Menu>;
    }
    return this._cacheMenu;
  }
});

module.exports = SubMenu;
