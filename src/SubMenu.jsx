import SubPopupMenu from './SubPopupMenu';
import React, { PropTypes } from 'react';
import KeyCode from 'rc-util/lib/KeyCode';
import guid from 'rc-util/lib/guid';
import classnames from 'classnames';
import { noop } from './util';

/* eslint react/no-is-mounted:0 */

const SubMenu = React.createClass({
  propTypes: {
    parentMenu: PropTypes.object,
    title: PropTypes.node,
    onClick: PropTypes.func,
    onOpenChange: PropTypes.func,
    rootPrefixCls: PropTypes.string,
    eventKey: PropTypes.string,
    multiple: PropTypes.bool,
    active: PropTypes.bool,
    open: PropTypes.bool,
    onSelect: PropTypes.func,
    closeSubMenuOnMouseLeave: PropTypes.bool,
    openSubMenuOnMouseEnter: PropTypes.bool,
    onDeselect: PropTypes.func,
    onDestroy: PropTypes.func,
    onItemHover: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    onTitleMouseEnter: PropTypes.func,
    onTitleMouseLeave: PropTypes.func,
    onTitleClick: PropTypes.func,
  },

  mixins: [require('./SubMenuStateMixin')],

  getDefaultProps() {
    return {
      onMouseEnter: noop,
      onMouseLeave: noop,
      onTitleMouseEnter: noop,
      onTitleMouseLeave: noop,
      onTitleClick: noop,
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
    if (props.parentMenu.subMenuInstance === this) {
      this.clearSubMenuTimers();
    }
  },

  onDestroy(key) {
    this.props.onDestroy(key);
  },

  onKeyDown(e) {
    const keyCode = e.keyCode;
    const menu = this.menuInstance;

    if (keyCode === KeyCode.ENTER) {
      this.onTitleClick(e);
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

  onOpenChange(e) {
    this.props.onOpenChange(this.addKeyPath(e));
  },

  onMouseEnter(e) {
    const props = this.props;
    this.clearSubMenuLeaveTimer(props.parentMenu.subMenuInstance !== this);
    props.onMouseEnter({
      key: props.eventKey,
      domEvent: e,
    });
  },

  onTitleMouseEnter(e) {
    const props = this.props;
    const parentMenu = props.parentMenu;
    this.clearSubMenuTitleLeaveTimer(parentMenu.subMenuInstance !== this);
    if (parentMenu.menuItemInstance) {
      parentMenu.menuItemInstance.clearMenuItemMouseLeaveTimer(true);
    }
    props.onItemHover({
      key: props.eventKey,
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
    props.onTitleMouseEnter({
      key: props.eventKey,
      domEvent: e,
    });
  },

  onTitleMouseLeave(e) {
    const { props } = this;
    const parentMenu = props.parentMenu;
    parentMenu.subMenuInstance = this;
    parentMenu.subMenuTitleLeaveFn = () => {
      const eventKey = props.eventKey;
      if (this.isMounted()) {
        // leave whole sub tree
        // still active
        if (props.mode === 'inline' && props.active) {
          props.onItemHover({
            key: eventKey,
            item: this,
            hover: false,
            trigger: 'mouseleave',
          });
        }
        props.onTitleMouseLeave({
          key: props.eventKey,
          domEvent: e,
        });
      }
    };
    parentMenu.subMenuTitleLeaveTimer = setTimeout(parentMenu.subMenuTitleLeaveFn, 100);
  },

  onMouseLeave(e) {
    const { props } = this;
    const parentMenu = props.parentMenu;
    parentMenu.subMenuInstance = this;
    parentMenu.subMenuLeaveFn = () => {
      const eventKey = props.eventKey;
      if (this.isMounted()) {
        // leave whole sub tree
        // still active
        if (props.mode !== 'inline') {
          if (props.active) {
            props.onItemHover({
              key: eventKey,
              item: this,
              hover: false,
              trigger: 'mouseleave',
            });
          }
          if (props.open) {
            if (props.closeSubMenuOnMouseLeave) {
              this.triggerOpenChange(false);
            }
          }
        }
        // trigger mouseleave
        props.onMouseLeave({
          key: eventKey,
          domEvent: e,
        });
      }
    };
    // prevent popup menu and submenu gap
    parentMenu.subMenuLeaveTimer = setTimeout(parentMenu.subMenuLeaveFn, 100);
  },

  onTitleClick(e) {
    const { props } = this;
    props.onTitleClick({
      key: props.eventKey,
      domEvent: e,
    });
    if (props.openSubMenuOnMouseEnter) {
      return;
    }
    this.triggerOpenChange(!props.open, 'click');
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
    return `${this.props.rootPrefixCls}-submenu`;
  },

  getActiveClassName() {
    return `${this.getPrefixCls()}-active`;
  },

  getDisabledClassName() {
    return `${this.getPrefixCls()}-disabled`;
  },

  getSelectedClassName() {
    return `${this.getPrefixCls()}-selected`;
  },

  getOpenClassName() {
    return `${this.props.rootPrefixCls}-submenu-open`;
  },

  saveMenuInstance(c) {
    this.menuInstance = c;
  },

  addKeyPath(info) {
    return {
      ...info,
      keyPath: (info.keyPath || []).concat(this.props.eventKey),
    };
  },

  triggerOpenChange(open, type) {
    const key = this.props.eventKey;
    this.onOpenChange({
      key,
      item: this,
      trigger: type,
      open,
    });
  },

  clearSubMenuTimers(callFn) {
    this.clearSubMenuLeaveTimer(callFn);
    this.clearSubMenuTitleLeaveTimer(callFn);
  },

  clearSubMenuTitleLeaveTimer(callFn) {
    const parentMenu = this.props.parentMenu;
    if (parentMenu.subMenuTitleLeaveTimer) {
      clearTimeout(parentMenu.subMenuTitleLeaveTimer);
      parentMenu.subMenuTitleLeaveTimer = null;
      if (callFn && parentMenu.subMenuTitleLeaveFn) {
        parentMenu.subMenuTitleLeaveFn();
      }
      parentMenu.subMenuTitleLeaveFn = null;
    }
  },

  clearSubMenuLeaveTimer(callFn) {
    const parentMenu = this.props.parentMenu;
    if (parentMenu.subMenuLeaveTimer) {
      clearTimeout(parentMenu.subMenuLeaveTimer);
      parentMenu.subMenuLeaveTimer = null;
      if (callFn && parentMenu.subMenuLeaveFn) {
        parentMenu.subMenuLeaveFn();
      }
      parentMenu.subMenuLeaveFn = null;
    }
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
      keyPath: props.keyPath,
      eventKey: `${props.eventKey}-menu-`,
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
    classes[this.getSelectedClassName()] = props.selected;
    this._menuId = this._menuId || guid();
    classes[prefixCls] = true;
    classes[`${prefixCls}-${props.mode}`] = 1;
    let titleClickEvents = {};
    let mouseEvents = {};
    let titleMouseEvents = {};
    if (!props.disabled) {
      titleClickEvents = {
        onClick: this.onTitleClick,
      };
      mouseEvents = {
        onMouseLeave: this.onMouseLeave,
        onMouseEnter: this.onMouseEnter,
      };
      // only works in title, not outer li
      titleMouseEvents = {
        onMouseEnter: this.onTitleMouseEnter,
        onMouseLeave: this.onTitleMouseLeave,
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
          className={`${prefixCls}-title`}
          {...titleMouseEvents}
          {...titleClickEvents}
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
