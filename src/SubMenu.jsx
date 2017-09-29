import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import SubPopupMenu from './SubPopupMenu';
import KeyCode from 'rc-util/lib/KeyCode';
import classnames from 'classnames';
import { noop, loopMenuItemRecusively } from './util';

let guid = 0;

/* eslint react/no-is-mounted:0 */

const SubMenu = createReactClass({
  displayName: 'SubMenu',

  propTypes: {
    parentMenu: PropTypes.object,
    title: PropTypes.node,
    children: PropTypes.any,
    selectedKeys: PropTypes.array,
    openKeys: PropTypes.array,
    onClick: PropTypes.func,
    onOpenChange: PropTypes.func,
    rootPrefixCls: PropTypes.string,
    eventKey: PropTypes.string,
    multiple: PropTypes.bool,
    active: PropTypes.bool,
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
    const { onDestroy, eventKey, parentMenu } = this.props;
    if (onDestroy) {
      onDestroy(eventKey);
    }
    if (parentMenu.subMenuInstance === this) {
      this.clearSubMenuTimers();
    }
  },

  onDestroy(key) {
    this.props.onDestroy(key);
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
    this.props.onOpenChange(e);
  },

  onMouseEnter(e) {
    const props = this.props;
    this.clearSubMenuLeaveTimer();
    props.onMouseEnter({
      key: props.eventKey,
      domEvent: e,
    });
  },

  onMouseLeave(e) {
    const { props } = this;
    const { parentMenu, eventKey } = props;
    parentMenu.subMenuInstance = this;
    parentMenu.subMenuLeaveFn = () => {
      // leave whole sub tree
      // still active
      if (props.mode !== 'inline') {
        const isOpen = this.isOpen();
        if (isOpen && props.closeSubMenuOnMouseLeave && props.active) {
          props.onItemHover({
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
          if (props.active) {
            props.onItemHover({
              key: eventKey,
              item: this,
              hover: false,
              trigger: 'mouseleave',
            });
          }
          if (isOpen && props.closeSubMenuOnMouseLeave) {
            this.triggerOpenChange(false);
          }
        }
      }
      // trigger mouseleave
      props.onMouseLeave({
        key: eventKey,
        domEvent: e,
      });
    };
    // prevent popup menu and submenu gap
    parentMenu.subMenuLeaveTimer = setTimeout(parentMenu.subMenuLeaveFn, 100);
  },

  onTitleMouseEnter(domEvent) {
    const props = this.props;
    const { parentMenu, eventKey: key } = props;
    const item = this;
    this.clearSubMenuTitleLeaveTimer();
    if (parentMenu.menuItemInstance) {
      parentMenu.menuItemInstance.clearMenuItemMouseLeaveTimer();
    }
    const openChanges = [];
    if (props.openSubMenuOnMouseEnter) {
      openChanges.push({
        key,
        item,
        trigger: 'mouseenter',
        open: true,
      });
    }
    props.onItemHover({
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
    const { parentMenu, eventKey } = props;
    parentMenu.subMenuInstance = this;
    parentMenu.subMenuTitleLeaveFn = () => {
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
    };
    parentMenu.subMenuTitleLeaveTimer = setTimeout(parentMenu.subMenuTitleLeaveFn, 100);
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
    this.triggerOpenChange(!this.isOpen(), 'click');
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

  clearSubMenuTimers() {
    this.clearSubMenuLeaveTimer();
    this.clearSubMenuTitleLeaveTimer();
  },

  clearSubMenuTitleLeaveTimer() {
    const parentMenu = this.props.parentMenu;
    if (parentMenu.subMenuTitleLeaveTimer) {
      clearTimeout(parentMenu.subMenuTitleLeaveTimer);
      parentMenu.subMenuTitleLeaveTimer = null;
      parentMenu.subMenuTitleLeaveFn = null;
    }
  },

  clearSubMenuLeaveTimer() {
    const parentMenu = this.props.parentMenu;
    if (parentMenu.subMenuLeaveTimer) {
      clearTimeout(parentMenu.subMenuLeaveTimer);
      parentMenu.subMenuLeaveTimer = null;
      parentMenu.subMenuLeaveFn = null;
    }
  },

  isChildrenSelected() {
    const ret = { find: false };
    loopMenuItemRecusively(this.props.children, this.props.selectedKeys, ret);
    return ret.find;
  },
  isOpen() {
    return this.props.openKeys.indexOf(this.props.eventKey) !== -1;
  },

  renderChildren(children) {
    const props = this.props;
    const baseProps = {
      mode: props.mode === 'horizontal' ? 'vertical' : props.mode,
      visible: this.isOpen(),
      level: props.level + 1,
      inlineIndent: props.inlineIndent,
      focusable: false,
      onClick: this.onSubMenuClick,
      onSelect: this.onSelect,
      onDeselect: this.onDeselect,
      onDestroy: this.onDestroy,
      selectedKeys: props.selectedKeys,
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
    const isOpen = this.isOpen();
    this.haveOpen = this.haveOpen || isOpen;
    const props = this.props;
    const prefixCls = this.getPrefixCls();
    const classes = {
      [props.className]: !!props.className,
      [`${prefixCls}-${props.mode}`]: 1,
    };

    classes[this.getOpenClassName()] = isOpen;
    classes[this.getActiveClassName()] = props.active;
    classes[this.getDisabledClassName()] = props.disabled;
    classes[this.getSelectedClassName()] = this.isChildrenSelected();

    if (!this._menuId) {
      if (props.eventKey) {
        this._menuId = `${props.eventKey}$Menu`;
      } else {
        this._menuId = `$__$${++guid}$Menu`;
      }
    }

    classes[prefixCls] = true;
    classes[`${prefixCls}-${props.mode}`] = 1;
    let mouseEvents = {};
    let titleClickEvents = {};
    let titleMouseEvents = {};
    if (!props.disabled) {
      mouseEvents = {
        onMouseLeave: this.onMouseLeave,
        onMouseEnter: this.onMouseEnter,
      };
      titleClickEvents = {
        onClick: this.onTitleClick,
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
      <li className={classnames(classes)} {...mouseEvents} style={props.style}>
        <div
          style={style}
          className={`${prefixCls}-title`}
          {...titleMouseEvents}
          {...titleClickEvents}
          aria-expanded={isOpen}
          aria-owns={this._menuId}
          aria-haspopup="true"
          title={typeof props.title === 'string' ? props.title : undefined}
        >
          {props.title}
          <i className={`${prefixCls}-arrow`} />
        </div>
        {this.renderChildren(props.children)}
      </li>
    );
  },
});

SubMenu.isSubMenu = 1;

export default SubMenu;
