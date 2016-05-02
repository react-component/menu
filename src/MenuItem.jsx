import React, { PropTypes } from 'react';
import { KeyCode } from 'rc-util';
import classnames from 'classnames';
import { noop } from './util';

const MenuItem = React.createClass({
  propTypes: {
    rootPrefixCls: PropTypes.string,
    eventKey: PropTypes.string,
    active: PropTypes.bool,
    selected: PropTypes.bool,
    disabled: PropTypes.bool,
    title: PropTypes.string,
    onSelect: PropTypes.func,
    onClick: PropTypes.func,
    onDeselect: PropTypes.func,
    parentMenu: PropTypes.object,
    onItemHover: PropTypes.func,
    onDestroy: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
  },

  getDefaultProps() {
    return {
      onSelect: noop,
      onMouseEnter: noop,
      onMouseLeave: noop,
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

  onMouseLeave(e) {
    const props = this.props;
    const eventKey = props.eventKey;
    const parentMenu = props.parentMenu;
    parentMenu.menuItemMouseLeaveTimer = setTimeout(()=> {
      if (this.isMounted() && props.active) {
        props.onItemHover({
          key: eventKey,
          item: this,
          hover: false,
          trigger: 'mouseleave',
        });
      }
    }, 30);
    props.onMouseLeave({
      key: eventKey,
      domEvent: e,
    });
  },

  onMouseEnter(e) {
    const props = this.props;
    const parentMenu = props.parentMenu;
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
    props.onMouseEnter({
      key: eventKey,
      domEvent: e,
    });
    if (parentMenu.props.mode === 'inline') {
      if (parentMenu.isSubPopupMenu) {
        const popupMenuProps = parentMenu.props;
        const subMenuProps = popupMenuProps.parentMenu.props;
        const subMenuEventKey = subMenuProps.eventKey;
        if (subMenuProps.active) {
          subMenuProps.onItemHover({
            key: subMenuEventKey,
            item: this,
            hover: false,
            trigger: 'mouseleave',
          });
        }
      }
    }
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
      ...props.attribute,
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
    const style = {
      ...props.style,
    };
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
