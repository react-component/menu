import SubPopupMenu from './SubPopupMenu';
import React from 'react';
import {KeyCode, guid} from 'rc-util';
import classnames from 'classnames';
import assign from 'object-assign';

const SubMenu = React.createClass({
  propTypes: {
    title: React.PropTypes.node,
    onClick: React.PropTypes.func,
    onOpenChange: React.PropTypes.func,
    rootPrefixCls: React.PropTypes.string,
    eventKey: React.PropTypes.string,
    multiple: React.PropTypes.bool,
    active: React.PropTypes.bool,
    open: React.PropTypes.bool,
    onSelect: React.PropTypes.func,
    closeSubMenuOnMouseLeave: React.PropTypes.bool,
    openSubMenuOnMouseEnter: React.PropTypes.bool,
    onDeselect: React.PropTypes.func,
    onDestroy: React.PropTypes.func,
    onItemHover: React.PropTypes.func,
  },

  mixins: [require('./SubMenuStateMixin')],

  getDefaultProps() {
    return {
      onMouseEnter() {
      },
      title: '',
    };
  },

  getInitialState() {
    this.isSubMenu = 1;
    return {
      defaultActiveFirst: false,
    };
  },

  componentWillUnmount() {
    const props = this.props;
    if (props.onDestroy) {
      props.onDestroy(props.eventKey);
    }
  },

  onDestroy(key) {
    this.props.onDestroy(key);
  },

  onKeyDown(e) {
    const keyCode = e.keyCode;
    const menu = this.menuInstance;

    if (keyCode === KeyCode.ENTER) {
      this.onClick(e);
      this.setState({
        defaultActiveFirst: true,
      });
      return true;
    }

    if (keyCode === KeyCode.RIGHT) {
      if (this.props.open) {
        menu.onKeyDown(e);
      } else {
        this.triggerOpenChange(true);
        this.setState({
          defaultActiveFirst: true,
        });
      }
      return true;
    }
    if (keyCode === KeyCode.LEFT) {
      let handled;
      if (this.props.open) {
        handled = menu.onKeyDown(e);
      } else {
        return undefined;
      }
      if (!handled) {
        this.triggerOpenChange(false);
        handled = true;
      }
      return handled;
    }

    if (this.props.open && (keyCode === KeyCode.UP || keyCode === KeyCode.DOWN)) {
      return menu.onKeyDown(e);
    }
  },

  onSubTreeMouseEnter() {
    if (this.leaveTimer) {
      clearTimeout(this.leaveTimer);
      this.leaveTimer = null;
    }
  },

  onOpenChange(e) {
    this.props.onOpenChange(e);
  },

  onMouseEnter() {
    if (this.leaveTimer) {
      clearTimeout(this.leaveTimer);
      this.leaveTimer = null;
    }
    const props = this.props;
    props.onItemHover({
      key: this.props.eventKey,
      item: this,
      hover: true,
      trigger: 'mouseenter',
    });
    if (props.openSubMenuOnMouseEnter) {
      this.triggerOpenChange(true);
    }
    this.setState({
      defaultActiveFirst: false,
    });
  },

  onMouseLeave() {
    // prevent popup menu and submenu gap
    this.leaveTimer = setTimeout(()=> {
      // leave whole sub tree
      // still active
      if (this.isMounted() && this.props.active) {
        this.props.onItemHover({
          key: this.props.eventKey,
          item: this,
          hover: false,
          trigger: 'mouseleave',
        });
      }
      if (this.isMounted() && this.props.open) {
        if (this.props.closeSubMenuOnMouseLeave) {
          this.triggerOpenChange(false);
        }
      }
    }, 100);
  },

  onClick() {
    if (this.props.openSubMenuOnMouseEnter) {
      return;
    }
    this.triggerOpenChange(!this.props.open, 'click');
    this.setState({
      defaultActiveFirst: false,
    });
  },

  onSubMenuClick(info) {
    this.props.onClick(this.addKeyPath(info));
  },

  onSelect(info) {
    this.props.onSelect(info);
  },

  onDeselect(info) {
    this.props.onDeselect(info);
  },

  getPrefixCls() {
    return this.props.rootPrefixCls + '-submenu';
  },

  getActiveClassName() {
    return this.getPrefixCls() + '-active';
  },

  getDisabledClassName() {
    return this.getPrefixCls() + '-disabled';
  },

  getOpenClassName() {
    return this.props.rootPrefixCls + '-submenu-open';
  },

  saveMenuInstance(c) {
    this.menuInstance = c;
  },

  addKeyPath(info) {
    return assign({}, info, {
      keyPath: info.keyPath.concat(this.props.eventKey),
    });
  },

  triggerOpenChange(open, type) {
    const key = this.props.eventKey;
    this.onOpenChange({
      key: key,
      item: this,
      trigger: type,
      open: open,
    });
  },

  renderChildren(children) {
    const props = this.props;
    const baseProps = {
      mode: props.mode === 'horizontal' ? 'vertical' : props.mode,
      visible: props.open,
      level: props.level + 1,
      inlineIndent: props.inlineIndent,
      focusable: false,
      onClick: this.onSubMenuClick,
      onSelect: this.onSelect,
      onDeselect: this.onDeselect,
      onDestroy: this.onDestroy,
      selectedKeys: props.selectedKeys,
      eventKey: props.eventKey + '-menu-',
      openKeys: props.openKeys,
      openTransitionName: props.openTransitionName,
      openAnimation: props.openAnimation,
      onOpenChange: this.onOpenChange,
      closeSubMenuOnMouseLeave: props.closeSubMenuOnMouseLeave,
      defaultActiveFirst: this.state.defaultActiveFirst,
      multiple: props.multiple,
      prefixCls: props.rootPrefixCls,
      id: this._menuId,
      ref: this.saveMenuInstance,
    };
    return <SubPopupMenu {...baseProps}>{children}</SubPopupMenu>;
  },

  render() {
    this.haveOpen = this.haveOpen || this.props.open;
    const props = this.props;
    const prefixCls = this.getPrefixCls();
    const classes = {
      [props.className]: !!props.className,
      [`${prefixCls}-${props.mode}`]: 1,
    };

    classes[this.getOpenClassName()] = this.props.open;
    classes[this.getActiveClassName()] = props.active;
    classes[this.getDisabledClassName()] = props.disabled;
    this._menuId = this._menuId || guid();
    classes[prefixCls] = true;
    classes[prefixCls + '-' + props.mode] = 1;
    let clickEvents = {};
    let mouseEvents = {};
    let titleMouseEvents = {};
    if (!props.disabled) {
      clickEvents = {
        onClick: this.onClick,
      };
      mouseEvents = {
        onMouseLeave: this.onMouseLeave,
        onMouseEnter: this.onSubTreeMouseEnter,
      };
      // only works in title, not outer li
      titleMouseEvents = {
        onMouseEnter: this.onMouseEnter,
      };
    }
    const style = {};
    if (props.mode === 'inline') {
      style.paddingLeft = props.inlineIndent * props.level;
    }
    return (
      <li className={classnames(classes)} {...mouseEvents}>
        <div
          style={style}
          className={prefixCls + '-title'}
          {...titleMouseEvents}
          {...clickEvents}
          aria-open={props.open}
          aria-owns={this._menuId}
          aria-haspopup="true"
          >
          {props.title}
        </div>
        {this.renderChildren(props.children)}
      </li>
    );
  },
});

export default SubMenu;
