import React from 'react';
import {classSet, createChainedFunction, KeyCode} from 'rc-util';
import scrollIntoView from 'dom-scroll-into-view';
import assign from 'object-assign';
import {noop, getKeyFromChildrenIndex} from './util';


function getActiveKey(props) {
  let activeKey = props.activeKey;
  const children = props.children;
  if (activeKey) {
    let found;
    React.Children.forEach(children, (c, i)=> {
      if (!c.props.disabled && activeKey === getKeyFromChildrenIndex(c, i)) {
        found = true;
      }
    });
    if (found) {
      return activeKey;
    }
  }
  activeKey = null;
  if (props.defaultActiveFirst) {
    React.Children.forEach(children, (c, i)=> {
      if (!activeKey && !c.props.disabled) {
        activeKey = getKeyFromChildrenIndex(c, i);
      }
    });
    return activeKey;
  }
  return activeKey;
}

function saveRef(name, c) {
  if (c) {
    this.instanceArray.push(c);
  }
}

const MenuMixin = {
  propTypes: {
    focusable: React.PropTypes.bool,
    multiple: React.PropTypes.bool,
    onSelect: React.PropTypes.func,
    onDeselect: React.PropTypes.func,
    onDestroy: React.PropTypes.func,
    onClick: React.PropTypes.func,
    style: React.PropTypes.object,
    defaultActiveFirst: React.PropTypes.bool,
    visible: React.PropTypes.bool,
    openSubMenuOnMouseEnter: React.PropTypes.bool,
    activeKey: React.PropTypes.string,
    selectedKeys: React.PropTypes.arrayOf(React.PropTypes.string),
  },

  getDefaultProps() {
    return {
      prefixCls: 'rc-menu',
      className: '',
      mode: 'vertical',
      level: 1,
      inlineIndent: 24,
      visible: true,
      focusable: true,
      closeSubMenuOnDeactive: true,
      deactiveSubMenuOnMouseLeave: true,
      openSubMenuOnMouseEnter: true,
      style: {},
      onSelect: noop,
      onClick: noop,
      onDeselect: noop,
    };
  },

  getInitialState() {
    const props = this.props;
    return {
      activeKey: getActiveKey(props),
    };
  },

  componentWillReceiveProps(nextProps) {
    const props = {};
    if ('activeKey' in nextProps) {
      props.activeKey = getActiveKey(nextProps);
    }
    this.setState(props);
  },

  shouldComponentUpdate(nextProps) {
    return this.props.visible || nextProps.visible;
  },

  componentWillMount() {
    this.instanceArray = [];
  },

  // all keyboard events callbacks run from here at first
  onKeyDown(e) {
    const keyCode = e.keyCode;
    let handled;
    this.instanceArray.forEach((obj)=> {
      if (obj.props.active) {
        handled = obj.onKeyDown(e);
      }
    });
    if (handled) {
      return 1;
    }
    let activeItem;
    switch (keyCode) {
    case KeyCode.UP:
      activeItem = this.step(-1);
      break;
    case KeyCode.DOWN:
      activeItem = this.step(1);
      break;
    default:
    }
    if (activeItem) {
      e.preventDefault();
      this.setState({
        activeKey: activeItem.props.eventKey,
      }, ()=> {
        scrollIntoView(React.findDOMNode(activeItem), React.findDOMNode(this), {
          onlyScrollIfNeeded: true,
        });
      });
      return 1;
    }
  },

  onItemHover(key) {
    this.setState({
      activeKey: key,
    });
  },

  renderCommonMenuItem(child, i, extraProps) {
    const state = this.state;
    const props = this.props;
    const key = getKeyFromChildrenIndex(child, i);
    const childProps = child.props;
    let newChildProps = {
      parent: this,
      mode: props.mode,
      level: props.level,
      inlineIndent: props.inlineIndent,
      renderMenuItem: this.renderMenuItem,
      rootPrefixCls: props.prefixCls,
      ref: createChainedFunction(child.ref, saveRef.bind(this, key)),
      eventKey: key,
      onHover: this.onItemHover,
      active: !childProps.disabled && key === state.activeKey,
      multiple: props.multiple,
      onClick: this.onClick,
      onDeselect: this.onDeselect,
      onDestroy: this.onDestroy,
      onSelect: this.onSelect,
    };
    newChildProps = assign({}, childProps, newChildProps, extraProps);
    if (props.mode === 'inline') {
      newChildProps.openSubMenuOnMouseEnter = newChildProps.closeSubMenuOnDeactive = false;
      delete newChildProps.open;
    } else if (!('open' in newChildProps)) {
      if (newChildProps.closeSubMenuOnDeactive && !newChildProps.active) {
        newChildProps.open = false;
      }
      if (!props.visible) {
        newChildProps.open = false;
      }
    }
    return React.cloneElement(child, newChildProps);
  },

  renderRoot(props) {
    this.instanceArray = [];
    const classes = {
      [props.prefixCls]: 1,
      [`${props.prefixCls}-${props.mode}`]: 1,
      [props.className]: !!props.className,
    };
    const domProps = {
      className: classSet(classes),
      role: 'menu',
      'aria-activedescendant': '',
    };
    if (props.id) {
      domProps.id = props.id;
    }
    if (props.focusable) {
      domProps.tabIndex = '0';
      domProps.onKeyDown = this.onKeyDown;
    }
    return (
      <ul style={props.style}
        {...domProps}>
        {React.Children.map(props.children, this.renderMenuItem)}
      </ul>
    );
  },

  step(direction) {
    let children = this.instanceArray;
    const activeKey = this.state.activeKey;
    const len = children.length;
    if (direction < 0) {
      children = children.concat().reverse();
    }
    // find current activeIndex
    let activeIndex = -1;
    children.every((c, ci)=> {
      if (c.props.eventKey === activeKey) {
        activeIndex = ci;
        return false;
      }
      return true;
    });
    const start = (activeIndex + 1) % len;
    let i = start;
    for (; ;) {
      const child = children[i];
      if (child.props.disabled) {
        i = (i + 1 + len) % len;
        // complete a loop
        if (i === start) {
          return null;
        }
      } else {
        return child;
      }
    }
  },
};

export default MenuMixin;
