import React from 'react';
import {KeyCode} from 'rc-util';
import classnames from 'classnames';

const MenuItem = React.createClass({
  propTypes: {
    rootPrefixCls: React.PropTypes.string,
    eventKey: React.PropTypes.string,
    active: React.PropTypes.bool,
    selected: React.PropTypes.bool,
    disabled: React.PropTypes.bool,
    title: React.PropTypes.string,
    onSelect: React.PropTypes.func,
    onClick: React.PropTypes.func,
    onDeselect: React.PropTypes.func,
    parentMenu: React.PropTypes.object,
    onItemHover: React.PropTypes.func,
    onDestroy: React.PropTypes.func,
  },

  getDefaultProps() {
    return {
      onSelect() {
      },
      onMouseEnter() {
      },
    };
  },

  componentWillUnmount() {
    const props = this.props;
    if (props.onDestroy) {
      props.onDestroy(props.eventKey);
    }
  },

  onKeyDown(e) {
    const keyCode = e.keyCode;
    if (keyCode === KeyCode.ENTER) {
      this.onClick(e);
      return true;
    }
  },

  onMouseLeave() {
    const eventKey = this.props.eventKey;
    const parentMenu = this.props.parentMenu;
    parentMenu.menuItemMouseLeaveTimer = setTimeout(()=> {
      if (this.isMounted() && this.props.active) {
        this.props.onItemHover({
          key: eventKey,
          item: this,
          hover: false,
          trigger: 'mouseleave',
        });
      }
    }, 30);
  },

  onMouseEnter() {
    const props = this.props;
    const parentMenu = this.props.parentMenu;
    if (parentMenu.menuItemMouseLeaveTimer) {
      clearTimeout(parentMenu.menuItemMouseLeaveTimer);
      parentMenu.menuItemMouseLeaveTimer = null;
    }
    const eventKey = props.eventKey;
    props.onItemHover({
      key: eventKey,
      item: this,
      hover: true,
      trigger: 'mouseenter',
    });
  },

  onClick(e) {
    const props = this.props;
    const eventKey = props.eventKey;
    const info = {
      key: eventKey,
      keyPath: [eventKey],
      item: this,
      domEvent: e,
    };
    props.onClick(info);
    if (props.multiple) {
      if (props.selected) {
        props.onDeselect(info);
      } else {
        props.onSelect(info);
      }
    } else if (!props.selected) {
      props.onSelect(info);
    }
  },

  getPrefixCls() {
    return this.props.rootPrefixCls + '-item';
  },

  getActiveClassName() {
    return this.getPrefixCls() + '-active';
  },

  getSelectedClassName() {
    return this.getPrefixCls() + '-selected';
  },

  getDisabledClassName() {
    return this.getPrefixCls() + '-disabled';
  },

  render() {
    const props = this.props;
    const classes = {};
    classes[this.getActiveClassName()] = !props.disabled && props.active;
    classes[this.getSelectedClassName()] = props.selected;
    classes[this.getDisabledClassName()] = props.disabled;
    classes[this.getPrefixCls()] = true;
    classes[props.className] = !!props.className;
    const attrs = {
      title: props.title,
      className: classnames(classes),
      role: 'menuitem',
      'aria-selected': props.selected,
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
    const style = {};
    if (props.mode === 'inline') {
      style.paddingLeft = props.inlineIndent * props.level;
    }
    return (
      <li style={style}
        {...attrs}
        {...mouseEvent}>
        {props.children}
      </li>
    );
  },
});

export default MenuItem;
