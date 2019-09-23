import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import KeyCode from 'rc-util/lib/KeyCode';
import classNames from 'classnames';
import scrollIntoView from 'dom-scroll-into-view';
import { connect } from 'mini-store';
import { noop, menuAllProps } from './util';

/* eslint react/no-is-mounted:0 */

export class MenuItem extends React.Component {
  static propTypes = {
    attribute: PropTypes.object,
    rootPrefixCls: PropTypes.string,
    eventKey: PropTypes.string,
    active: PropTypes.bool,
    children: PropTypes.any,
    selectedKeys: PropTypes.array,
    disabled: PropTypes.bool,
    title: PropTypes.string,
    onItemHover: PropTypes.func,
    onSelect: PropTypes.func,
    onClick: PropTypes.func,
    onDeselect: PropTypes.func,
    parentMenu: PropTypes.object,
    onDestroy: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    multiple: PropTypes.bool,
    isSelected: PropTypes.bool,
    manualRef: PropTypes.func,
    itemIcon: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  };

  static defaultProps = {
    onSelect: noop,
    onMouseEnter: noop,
    onMouseLeave: noop,
    manualRef: noop,
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // invoke customized ref to expose component to mixin
    this.callRef();
  }

  componentDidUpdate(prevProps) {
    const { active, parentMenu, eventKey } = this.props;
    // 在 parentMenu 上层保存滚动状态，避免重复的 MenuItem key 导致滚动跳动
    // https://github.com/ant-design/ant-design/issues/16181
    if (!prevProps.active && active && (!parentMenu || !parentMenu[`scrolled-${eventKey}`])) {
      if (this.node) {
        scrollIntoView(this.node, ReactDOM.findDOMNode(parentMenu), {
          onlyScrollIfNeeded: true,
        });
        parentMenu[`scrolled-${eventKey}`] = true;
      }
    } else if (parentMenu && parentMenu[`scrolled-${eventKey}`]) {
      delete parentMenu[`scrolled-${eventKey}`];
    }
    this.callRef();
  }

  componentWillUnmount() {
    const props = this.props;
    if (props.onDestroy) {
      props.onDestroy(props.eventKey);
    }
  }

  onKeyDown = e => {
    const keyCode = e.keyCode;
    if (keyCode === KeyCode.ENTER) {
      this.onClick(e);
      return true;
    }
  };

  onMouseLeave = e => {
    const { eventKey, onItemHover, onMouseLeave } = this.props;
    onItemHover({
      key: eventKey,
      hover: false,
    });
    onMouseLeave({
      key: eventKey,
      domEvent: e,
    });
  };

  onMouseEnter = e => {
    const { eventKey, onItemHover, onMouseEnter } = this.props;
    onItemHover({
      key: eventKey,
      hover: true,
    });
    onMouseEnter({
      key: eventKey,
      domEvent: e,
    });
  };

  onClick = e => {
    const { eventKey, multiple, onClick, onSelect, onDeselect, isSelected } = this.props;
    const info = {
      key: eventKey,
      keyPath: [eventKey],
      item: this,
      domEvent: e,
    };
    onClick(info);
    if (multiple) {
      if (isSelected) {
        onDeselect(info);
      } else {
        onSelect(info);
      }
    } else if (!isSelected) {
      onSelect(info);
    }
  };

  getPrefixCls() {
    return `${this.props.rootPrefixCls}-item`;
  }

  getActiveClassName() {
    return `${this.getPrefixCls()}-active`;
  }

  getSelectedClassName() {
    return `${this.getPrefixCls()}-selected`;
  }

  getDisabledClassName() {
    return `${this.getPrefixCls()}-disabled`;
  }

  saveNode = node => {
    this.node = node;
  };

  callRef() {
    if (this.props.manualRef) {
      this.props.manualRef(this);
    }
  }

  render() {
    const props = { ...this.props };
    const className = classNames(this.getPrefixCls(), props.className, {
      [this.getActiveClassName()]: !props.disabled && props.active,
      [this.getSelectedClassName()]: props.isSelected,
      [this.getDisabledClassName()]: props.disabled,
    });
    let attrs = {
      ...props.attribute,
      title: props.title,
      className,
      // set to menuitem by default
      role: props.role || 'menuitem',
      'aria-disabled': props.disabled,
    };

    if (props.role === 'option') {
      // overwrite to option
      attrs = {
        ...attrs,
        role: 'option',
        'aria-selected': props.isSelected,
      };
    } else if (props.role === null || props.role === 'none') {
      // sometimes we want to specify role inside <li/> element
      // <li><a role='menuitem'>Link</a></li> would be a good example
      // in this case the role on <li/> should be "none" to
      // remove the implied listitem role.
      // https://www.w3.org/TR/wai-aria-practices-1.1/examples/menubar/menubar-1/menubar-1.html
      attrs.role = 'none';
    }
    // In case that onClick/onMouseLeave/onMouseEnter is passed down from owner
    const mouseEvent = {
      onClick: props.disabled ? null : this.onClick,
      onMouseLeave: props.disabled ? null : this.onMouseLeave,
      onMouseEnter: props.disabled ? null : this.onMouseEnter,
    };
    const style = {
      ...props.style,
    };
    if (props.mode === 'inline') {
      style.paddingLeft = props.inlineIndent * props.level;
    }
    menuAllProps.forEach(key => delete props[key]);
    let icon = this.props.itemIcon;
    if (typeof this.props.itemIcon === 'function') {
      icon = React.createElement(this.props.itemIcon, this.props);
    }
    return (
      <li {...props} {...attrs} {...mouseEvent} style={style} ref={this.saveNode}>
        {props.children}
        {icon}
      </li>
    );
  }
}

MenuItem.isMenuItem = true;

const connected = connect(({ activeKey, selectedKeys }, { eventKey, subMenuKey }) => ({
  active: activeKey[subMenuKey] === eventKey,
  isSelected: selectedKeys.indexOf(eventKey) !== -1,
}))(MenuItem);

export default connected;
