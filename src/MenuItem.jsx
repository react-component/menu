import React, { PropTypes } from 'react';
import KeyCode from 'rc-util/lib/KeyCode';
import classnames from 'classnames';
import { noop } from './util';

/* eslint react/no-is-mounted:0 */

const MenuItem = React.createClass({
  propTypes: {
    children: PropTypes.any,
    disabled: PropTypes.bool,
    title: PropTypes.string,
    onItemHover: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
  },

  contextTypes: {
    parentMenu: PropTypes.object,
    activeKey: PropTypes.string,
    selectedKeys: PropTypes.arrayOf(PropTypes.string),
    mode: PropTypes.string,
    level: PropTypes.number,
    multiple: PropTypes.bool,
    inlineIndent: PropTypes.number,
    rootPrefixCls: PropTypes.string,
    saveRef: PropTypes.func,
    onClick: PropTypes.func,
    onSelect: PropTypes.func,
    onDestroy: PropTypes.func,
    onDeselect: PropTypes.func,
    onItemHover: PropTypes.func,
    getEventKey: PropTypes.func,
  },

  getDefaultProps() {
    return {
      onMouseEnter: noop,
      onMouseLeave: noop,
    };
  },

  componentWillMount() {
    this.context.saveRef(this);
  },

  componentWillUpdate() {
    this.context.saveRef(this);
  },

  componentWillUnmount() {
    const props = this.props;
    const { parentMenu, onDestroy } = this.context;
    const eventKey = this.getEventKey();
    if (onDestroy) {
      onDestroy(eventKey);
    }
    if (parentMenu.menuItemInstance === this) {
      this.clearMenuItemMouseLeaveTimer();
    }
  },

  onKeyDown(e) {
    const keyCode = e.keyCode;
    if (keyCode === KeyCode.ENTER) {
      this.onClick(e);
      return true;
    }
  },

  onMouseLeave(e) {
    const props = this.props;
    const { parentMenu, onItemHover } = this.context
    const eventKey = this.getEventKey();
    parentMenu.menuItemInstance = this;
    parentMenu.menuItemMouseLeaveFn = () => {
      if (this.isMounted() && this.isActive()) {
        onItemHover({
          key: eventKey,
          item: this,
          hover: false,
          domEvent: e,
          trigger: 'mouseleave',
        });
      }
    };
    parentMenu.menuItemMouseLeaveTimer = setTimeout(parentMenu.menuItemMouseLeaveFn, 30);
    props.onMouseLeave({
      key: eventKey,
      domEvent: e,
    });
  },

  onMouseEnter(e) {
    const props = this.props;
    const { parentMenu, onItemHover } = this.context;
    const eventKey = this.getEventKey();
    this.clearMenuItemMouseLeaveTimer(parentMenu.menuItemInstance !== this);
    if (parentMenu.subMenuInstance) {
      parentMenu.subMenuInstance.clearSubMenuTimers();
    }
    onItemHover({
      key: eventKey,
      item: this,
      hover: true,
      domEvent: e,
      trigger: 'mouseenter',
    });
    props.onMouseEnter({
      key: eventKey,
      domEvent: e,
    });
  },

  onClick(e) {
    const props = this.props;
    const { multiple, onSelect, onDeselect } = this.context;
    const eventKey = this.getEventKey();
    const selected = this.isSelected();
    const info = {
      key: eventKey,
      keyPath: [eventKey],
      item: this,
      domEvent: e,
    };
    this.context.onClick(info);
    if (multiple) {
      if (selected) {
        onDeselect(info);
      } else {
        onSelect(info);
      }
    } else if (!selected) {
      onSelect(info);
    }
  },

  getPrefixCls() {
    return `${this.context.rootPrefixCls}-item`;
  },

  getActiveClassName() {
    return `${this.getPrefixCls()}-active`;
  },

  getSelectedClassName() {
    return `${this.getPrefixCls()}-selected`;
  },

  getDisabledClassName() {
    return `${this.getPrefixCls()}-disabled`;
  },

  getEventKey() {
    return this.context.getEventKey(this);
  },

  clearMenuItemMouseLeaveTimer() {
    const props = this.props;
    let callFn;
    const { parentMenu } = this.context;
    if (parentMenu.menuItemMouseLeaveTimer) {
      clearTimeout(parentMenu.menuItemMouseLeaveTimer);
      parentMenu.menuItemMouseLeaveTimer = null;
      if (callFn && parentMenu.menuItemMouseLeaveFn) {
        parentMenu.menuItemMouseLeaveFn();
      }
      parentMenu.menuItemMouseLeaveFn = null;
    }
  },

  isSelected() {
    const { selectedKeys } = this.context;
    const eventKey = this.getEventKey();
    return selectedKeys.indexOf(eventKey) !== -1;
  },

  isActive() {
    const { disabled } = this.props;
    const { activeKey } = this.context;
    const eventKey = this.getEventKey();
    return !disabled && eventKey === activeKey;
  },

  render() {
    const props = this.props;
    const selected = this.isSelected();
    const { mode, level, inlineIndent } = this.context;
    const classes = {};
    classes[this.getActiveClassName()] = !props.disabled && this.isActive();
    classes[this.getSelectedClassName()] = selected;
    classes[this.getDisabledClassName()] = props.disabled;
    classes[this.getPrefixCls()] = true;
    classes[props.className] = !!props.className;
    const attrs = {
      ...props.attribute,
      title: props.title,
      className: classnames(classes),
      role: 'menuitem',
      'aria-selected': selected,
      'aria-disabled': props.disabled,
    };
    let mouseEvent = {};
    if (!props.disabled) {
      mouseEvent = {
        onClick: this.onClick,
        onMouseLeave: this.onMouseLeave,
        onMouseEnter: this.onMouseEnter,
      };
    }
    const style = {
      ...props.style,
    };
    if (mode === 'inline') {
      style.paddingLeft = inlineIndent * level;
    }
    return (
      <li
        style={style}
        {...attrs}
        {...mouseEvent}
      >
        {props.children}
      </li>
    );
  },
});

MenuItem.isMenuItem = 1;

export default MenuItem;
