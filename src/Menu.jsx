import React from 'react';
import {classSet, createChainedFunction, KeyCode} from 'rc-util';
import scrollIntoView from 'dom-scroll-into-view';
import assign from 'object-assign';

function noop() {
}

const now = Date.now();

function getChildIndexInChildren(child, children) {
  let index = -1;
  React.Children.forEach(children, (c, i) => {
    if (c === child) {
      index = i;
    }
  });
  return index;
}

function getKeyFromChildren(child, children) {
  return child.key || 'rcMenuItem_' + now + '_' + getChildIndexInChildren(child, children);
}

function getKeyFromChildrenIndex(child, index) {
  return child.key || 'rcMenuItem_' + now + '_' + index;
}

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

class Menu extends React.Component {
  constructor(props) {
    super(props);
    let selectedKeys = props.defaultSelectedKeys;
    if ('selectedKeys' in props) {
      selectedKeys = props.selectedKeys;
    }
    this.state = {
      activeKey: getActiveKey(props),
      selectedKeys: selectedKeys || [],
    };
    ['onItemHover', 'onDeselect',
      'onClick',
      'onSelect', 'onKeyDown',
      'onDestroy', 'renderMenuItem'].forEach((m)=> {
        this[m] = this[m].bind(this);
      });
  }

  componentWillReceiveProps(nextProps) {
    const props = {};
    if ('activeKey' in nextProps) {
      props.activeKey = getActiveKey(nextProps);
    }
    if ('selectedKeys' in nextProps) {
      props.selectedKeys = nextProps.selectedKeys || [];
    }
    this.setState(props);
  }

  shouldComponentUpdate(nextProps) {
    return this.props.visible || nextProps.visible;
  }

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
  }

  onItemHover(key) {
    this.setState({
      activeKey: key,
    });
  }

  onSelect(selectInfo) {
    const props = this.props;
    // root menu
    if (!props.sub) {
      let selectedKeys = this.state.selectedKeys;
      const selectedKey = selectInfo.key;
      if (props.multiple) {
        selectedKeys = selectedKeys.concat([selectedKey]);
      } else {
        selectedKeys = [selectedKey];
      }
      if (!('selectedKeys' in props)) {
        this.setState({
          selectedKeys: selectedKeys,
        });
      }
      props.onSelect(assign({}, selectInfo, {
        selectedKeys: selectedKeys,
      }));
    } else {
      props.onSelect(selectInfo);
    }
  }

  onDeselect(selectInfo) {
    const props = this.props;
    if (!props.sub) {
      const selectedKeys = this.state.selectedKeys.concat();
      const selectedKey = selectInfo.key;
      const index = selectedKeys.indexOf(selectedKey);
      if (index !== -1) {
        selectedKeys.splice(index, 1);
      }
      if (!('selectedKeys' in props)) {
        this.setState({
          selectedKeys: selectedKeys,
        });
      }
      props.onDeselect(assign({}, selectInfo, {
        selectedKeys: selectedKeys,
      }));
    } else {
      props.onDeselect(selectInfo);
    }
  }

  onDestroy(key) {
    const state = this.state;
    const props = this.props;
    const selectedKeys = state.selectedKeys;
    const index = selectedKeys.indexOf(key);
    if (!props.sub) {
      if (!('selectedKeys' in props) && index !== -1) {
        selectedKeys.splice(index, 1);
      }
    } else {
      props.onDestroy(key);
    }
  }

  onClick(e) {
    const props = this.props;
    // no top menu
    if (!props.multiple && this.instanceArray.indexOf(e.item) === -1) {
      this.setState({
        activeKey: null,
      });
    }
    this.props.onClick(e);
  }

  renderMenuItem(child) {
    const state = this.state;
    const props = this.props;
    const key = getKeyFromChildren(child, props.children);
    const childProps = child.props;
    const mode = props.mode;
    let openSubMenuOnHover = props.openSubMenuOnHover;
    let closeSubMenuOnDeactive = props.closeSubMenuOnDeactive;
    if (mode === 'inline') {
      openSubMenuOnHover = false;
      closeSubMenuOnDeactive = false;
    }
    return React.cloneElement(child, {
      mode: props.mode,
      level: props.level,
      inlineIndent: props.inlineIndent,
      openSubMenuOnHover: openSubMenuOnHover,
      closeSubMenuOnDeactive: closeSubMenuOnDeactive,
      renderMenuItem: this.renderMenuItem,
      rootPrefixCls: props.prefixCls,
      ref: createChainedFunction(child.ref, saveRef.bind(this, key)),
      eventKey: key,
      onHover: this.onItemHover,
      active: !childProps.disabled && key === state.activeKey,
      multiple: props.multiple,
      selectedKeys: state.selectedKeys,
      selected: state.selectedKeys.indexOf(key) !== -1,
      onClick: this.onClick,
      onDeselect: createChainedFunction(childProps.onDeselect, this.onDeselect),
      onDestroy: 'selectedKeys' in props ? noop : this.onDestroy,
      onSelect: createChainedFunction(childProps.onSelect, this.onSelect),
    });
  }

  render() {
    const props = this.props;
    this.instanceArray = [];
    const classes = {
      [props.prefixCls]: 1,
      [`${props.prefixCls}-sub`]: !!props.sub,
      [`${props.prefixCls}-root`]: !props.sub,
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
  }

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
  }
}

Menu.propTypes = {
  focusable: React.PropTypes.bool,
  multiple: React.PropTypes.bool,
  onSelect: React.PropTypes.func,
  onClick: React.PropTypes.func,
  style: React.PropTypes.object,
  onDeselect: React.PropTypes.func,
  defaultActiveFirst: React.PropTypes.bool,
  visible: React.PropTypes.bool,
  openSubMenuOnHover: React.PropTypes.bool,
  closeSubMenuOnDeactive: React.PropTypes.bool,
  activeKey: React.PropTypes.string,
  selectedKeys: React.PropTypes.arrayOf(React.PropTypes.string),
  defaultSelectedKeys: React.PropTypes.arrayOf(React.PropTypes.string),
};

Menu.defaultProps = {
  prefixCls: 'rc-menu',
  mode: 'vertical',
  level: 1,
  inlineIndent: 24,
  visible: true,
  focusable: true,
  openSubMenuOnHover: true,
  closeSubMenuOnDeactive: true,
  style: {},
  onSelect: noop,
  onClick: noop,
  onDeselect: noop,
};

export default Menu;
