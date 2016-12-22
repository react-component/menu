import SubPopupMenu from './SubPopupMenu';
import React, { PropTypes } from 'react';
import KeyCode from 'rc-util/lib/KeyCode';
import classnames from 'classnames';
import { noop, loopMenuItemRecusively } from './util';

let guid = 0;

/* eslint react/no-is-mounted:0 */

const SubMenu = React.createClass({
  propTypes: {
    title: PropTypes.node,
    children: PropTypes.any,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    onTitleMouseEnter: PropTypes.func,
    onTitleMouseLeave: PropTypes.func,
    onTitleClick: PropTypes.func,
  },

  contextTypes: {
    parentMenu: PropTypes.object,
    openKeys: PropTypes.arrayOf(PropTypes.string),
    activeKey: PropTypes.string,
    selectedKeys: PropTypes.arrayOf(PropTypes.string),
    mode: PropTypes.string,
    level: PropTypes.number,
    multiple: PropTypes.bool,
    inlineIndent: PropTypes.number,
    rootPrefixCls: PropTypes.string,
    openAnimation: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    openSubMenuOnMouseEnter: PropTypes.bool,
    closeSubMenuOnMouseLeave: PropTypes.bool,
    saveRef: PropTypes.func,
    onClick: PropTypes.func,
    onSelect: PropTypes.func,
    onDestroy: PropTypes.func,
    onDeselect: PropTypes.func,
    onItemHover: PropTypes.func,
    onOpenChange: PropTypes.func,
    getEventKey: PropTypes.func,
    openTransitionName: PropTypes.string,
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

  componentWillMount() {
    this.context.saveRef(this);
  },

  componentWillUpdate() {
    this.context.saveRef(this);
  },

  componentWillUnmount() {
    const { parentMenu, onDestroy } = this.context;
    const eventKey = this.getEventKey();
    if (onDestroy) {
      onDestroy(eventKey);
    }
    if (parentMenu.subMenuInstance === this) {
      this.clearSubMenuTimers();
    }
  },

  onDestroy(key) {
    this.context.onDestroy(key);
  },

  onKeyDown(e) {
    const keyCode = e.keyCode;
    const menu = this.menuInstance;
    const isOpen = this.isOpen();

    if (keyCode === KeyCode.ENTER) {
      this.onTitleClick(e);
      this.setState({
        defaultActiveFirst: true,
      });
      return true;
    }

    if (keyCode === KeyCode.RIGHT) {
      if (isOpen) {
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
      if (isOpen) {
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

    if (isOpen && (keyCode === KeyCode.UP || keyCode === KeyCode.DOWN)) {
      return menu.onKeyDown(e);
    }
  },

  onOpenChange(e) {
    this.context.onOpenChange(e);
  },

  onMouseEnter(e) {
    const props = this.props;
    const { parentMenu } = this.context;
    const eventKey = this.getEventKey();
    this.clearSubMenuLeaveTimer(parentMenu.subMenuInstance !== this);
    props.onMouseEnter({
      key: eventKey,
      domEvent: e,
    });
  },

  onTitleMouseEnter(domEvent) {
    const props = this.props;
    const { parentMenu, openSubMenuOnMouseEnter, onItemHover } = this.context;
    const key = this.getEventKey();
    const item = this;
    this.clearSubMenuTitleLeaveTimer(parentMenu.subMenuInstance !== item);
    if (parentMenu.menuItemInstance) {
      parentMenu.menuItemInstance.clearMenuItemMouseLeaveTimer(true);
    }
    const openChanges = [];
    if (openSubMenuOnMouseEnter) {
      openChanges.push({
        key,
        item,
        trigger: 'mouseenter',
        open: true,
      });
    }
    onItemHover({
      key,
      item,
      hover: true,
      trigger: 'mouseenter',
      openChanges,
    });
    this.setState({
      defaultActiveFirst: false,
    });
    props.onTitleMouseEnter({
      key,
      domEvent,
    });
  },

  onTitleMouseLeave(e) {
    const { props } = this;
    const { parentMenu, mode, onItemHover } = this.context;
    const eventKey = this.getEventKey();
    parentMenu.subMenuInstance = this;
    parentMenu.subMenuTitleLeaveFn = () => {
      if (this.isMounted()) {
        // leave whole sub tree
        // still active
        if (mode === 'inline' && this.isActive()) {
          onItemHover({
            key: eventKey,
            item: this,
            hover: false,
            trigger: 'mouseleave',
          });
        }
        props.onTitleMouseLeave({
          key: eventKey,
          domEvent: e,
        });
      }
    };
    parentMenu.subMenuTitleLeaveTimer = setTimeout(parentMenu.subMenuTitleLeaveFn, 100);
  },

  onMouseLeave(e) {
    const { props } = this;
    const { parentMenu, mode, closeSubMenuOnMouseLeave, onItemHover } = this.context;
    const eventKey = this.getEventKey();
    parentMenu.subMenuInstance = this;
    parentMenu.subMenuLeaveFn = () => {
      if (this.isMounted()) {
        // leave whole sub tree
        // still active
        if (mode !== 'inline') {
          const isOpen = this.isOpen();
          if (isOpen && closeSubMenuOnMouseLeave && this.isActive()) {
            onItemHover({
              key: eventKey,
              item: this,
              hover: false,
              trigger: 'mouseleave',
              openChanges: [{
                key: eventKey,
                item: this,
                trigger: 'mouseleave',
                open: false,
              }],
            });
          } else {
            if (this.isActive()) {
              onItemHover({
                key: eventKey,
                item: this,
                hover: false,
                trigger: 'mouseleave',
              });
            }
            if (isOpen && closeSubMenuOnMouseLeave) {
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
    const { openSubMenuOnMouseEnter } = this.context;
    const eventKey = this.getEventKey();
    props.onTitleClick({
      key: eventKey,
      domEvent: e,
    });
    if (openSubMenuOnMouseEnter) {
      return;
    }
    this.triggerOpenChange(!this.isOpen(), 'click');
    this.setState({
      defaultActiveFirst: false,
    });
  },

  onSubMenuClick(info) {
    this.context.onClick(this.addKeyPath(info));
  },

  onSelect(info) {
    this.context.onSelect(info);
  },

  onDeselect(info) {
    this.context.onDeselect(info);
  },

  getPrefixCls() {
    return `${this.context.rootPrefixCls}-submenu`;
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
    return `${this.context.rootPrefixCls}-submenu-open`;
  },

  getEventKey() {
    return this.context.getEventKey(this);
  },

  saveMenuInstance(c) {
    this.menuInstance = c;
  },

  addKeyPath(info) {
    const eventKey = this.getEventKey();
    return {
      ...info,
      keyPath: (info.keyPath || []).concat(eventKey),
    };
  },

  triggerOpenChange(open, type) {
    const key = this.getEventKey();
    this.onOpenChange({
      key,
      item: this,
      trigger: type,
      open,
    });
  },

  clearSubMenuTimers() {
    let callFn;
    this.clearSubMenuLeaveTimer(callFn);
    this.clearSubMenuTitleLeaveTimer(callFn);
  },

  clearSubMenuTitleLeaveTimer() {
    let callFn;
    const { parentMenu } = this.context;
    if (parentMenu.subMenuTitleLeaveTimer) {
      clearTimeout(parentMenu.subMenuTitleLeaveTimer);
      parentMenu.subMenuTitleLeaveTimer = null;
      if (callFn && parentMenu.subMenuTitleLeaveFn) {
        parentMenu.subMenuTitleLeaveFn();
      }
      parentMenu.subMenuTitleLeaveFn = null;
    }
  },

  clearSubMenuLeaveTimer() {
    let callFn;
    const { parentMenu } = this.context;
    if (parentMenu.subMenuLeaveTimer) {
      clearTimeout(parentMenu.subMenuLeaveTimer);
      parentMenu.subMenuLeaveTimer = null;
      if (callFn && parentMenu.subMenuLeaveFn) {
        parentMenu.subMenuLeaveFn();
      }
      parentMenu.subMenuLeaveFn = null;
    }
  },

  isChildrenSelected() {
    const ret = { find: false };
    loopMenuItemRecusively(this.props.children, this.context.selectedKeys, ret);
    return ret.find;
  },

  isOpen() {
    const { openKeys } = this.context;
    return openKeys.indexOf(this.getEventKey()) !== -1;
  },

  isActive() {
    const { disabled } = this.props;
    const { activeKey } = this.context;
    return !disabled && this.getEventKey() === activeKey;
  },

  renderChildren(children) {
    const props = this.props;
    const context = this.context;
    const eventKey = `${this.getEventKey()}-menu-`;
    const baseProps = {
      mode: context.mode === 'horizontal' ? 'vertical' : context.mode,
      visible: this.isOpen(),
      level: context.level + 1,
      inlineIndent: context.inlineIndent,
      focusable: false,
      onClick: this.onSubMenuClick,
      onSelect: this.onSelect,
      onDeselect: this.onDeselect,
      onDestroy: this.onDestroy,
      selectedKeys: context.selectedKeys,
      eventKey,
      openKeys: context.openKeys,
      openTransitionName: context.openTransitionName,
      openAnimation: context.openAnimation,
      onOpenChange: this.onOpenChange,
      closeSubMenuOnMouseLeave: context.closeSubMenuOnMouseLeave,
      defaultActiveFirst: this.state.defaultActiveFirst,
      multiple: context.multiple,
      prefixCls: context.rootPrefixCls,
      id: this._menuId,
      ref: this.saveMenuInstance,
    };
    return <SubPopupMenu {...baseProps}>{children}</SubPopupMenu>;
  },

  render() {
    const isOpen = this.isOpen();
    this.haveOpen = this.haveOpen || isOpen;
    const props = this.props;
    const prefixCls = this.getPrefixCls();
    const { mode, level, inlineIndent } = this.context;
    const eventKey = this.getEventKey();
    const classes = {
      [props.className]: !!props.className,
      [`${prefixCls}-${mode}`]: 1,
    };

    classes[this.getOpenClassName()] = isOpen;
    classes[this.getActiveClassName()] = this.isActive();
    classes[this.getDisabledClassName()] = props.disabled;
    classes[this.getSelectedClassName()] = this.isChildrenSelected();

    if (!this._menuId) {
      if (eventKey) {
        this._menuId = `${eventKey}$Menu`;
      } else {
        this._menuId = `$__$${++guid}$Menu`;
      }
    }

    classes[prefixCls] = true;
    classes[`${prefixCls}-${mode}`] = 1;
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
    if (mode === 'inline') {
      style.paddingLeft = inlineIndent * level;
    }
    return (
      <li className={classnames(classes)} {...mouseEvents}>
        <div
          style={style}
          className={`${prefixCls}-title`}
          {...titleMouseEvents}
          {...titleClickEvents}
          aria-expanded={isOpen}
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

SubMenu.isSubMenu = 1;

export default SubMenu;
