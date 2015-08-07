import React from 'react';
import {classSet, createChainedFunction, KeyCode} from 'rc-util';
import scrollIntoView from 'dom-scroll-into-view';

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
  if (props.activeFirst) {
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

  onSelect(key, child, e) {
    const props = this.props;

    if (!('selectedKeys' in props)) {
      const state = this.state;
      // not from submenu
      // top menu
      // TODO: remove sub judge
      if (!props.sub) {
        if (!props.multiple) {
          const selectedDescendant = this.selectedDescendant;
          if (selectedDescendant) {
            if (selectedDescendant !== child) {
              const selectedDescendantProps = selectedDescendant.props;
              selectedDescendantProps.onDeselect(selectedDescendantProps.eventKey, selectedDescendant, e, child);
            }
          }
          this.selectedDescendant = child;
        }
      }
      // my child
      if (this.instanceArray.indexOf(child) !== -1) {
        let selectedKeys;
        if (props.multiple) {
          selectedKeys = state.selectedKeys.concat([key]);
        } else {
          selectedKeys = [key];
        }
        this.setState({
          selectedKeys: selectedKeys,
        });
      }
    }

    if (props.onSelect) {
      props.onSelect(key, child, e);
    }
  }

  onDeselect(key, child, e, __childToBeSelected) {
    const props = this.props;
    if (!('selectedKeys' in props)) {
      const state = this.state;
      const children = this.instanceArray;
      // my children
      if (children.indexOf(child) !== -1 && children.indexOf(__childToBeSelected) === -1) {
        let selectedKeys = state.selectedKeys;
        const index = selectedKeys.indexOf(key);
        if (index !== -1) {
          selectedKeys = selectedKeys.concat([]);
          selectedKeys.splice(index, 1);
          this.setState({
            selectedKeys: selectedKeys,
          });
        }
      }
    }
    props.onDeselect.apply(null, arguments);
  }

  onDestroy(key) {
    const state = this.state;
    const selectedKeys = state.selectedKeys;
    const index = selectedKeys.indexOf(key);
    if (index !== -1) {
      // selectedKeys = selectedKeys.concat([]);
      selectedKeys.splice(index, 1);
      // can not call setState in unmount, will cause render and update unmounted children
      // https://github.com/facebook/react/pull/3795
      // this.setState({
      //   selectedKeys: selectedKeys
      // });
    }
  }

  renderMenuItem(child) {
    const state = this.state;
    const props = this.props;
    const key = getKeyFromChildren(child, props.children);
    const childProps = child.props;
    return React.cloneElement(child, {
      mode: props.mode,
      level: props.level,
      inlineIndent: props.inlineIndent,
      globalOpenOnHover: props.openOnHover,
      globalCloseOnDeActive: props.closeOnDeActive,
      renderMenuItem: this.renderMenuItem,
      rootPrefixCls: props.prefixCls,
      ref: createChainedFunction(child.ref, saveRef.bind(this, key)),
      eventKey: key,
      onHover: this.onItemHover,
      active: !childProps.disabled && key === state.activeKey,
      multiple: props.multiple,
      selected: state.selectedKeys.indexOf(key) !== -1,
      onClick: props.onClick,
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
  style: React.PropTypes.object,
  onDeselect: React.PropTypes.func,
  activeFirst: React.PropTypes.bool,
  openOnHover: React.PropTypes.bool,
  closeOnDeActive: React.PropTypes.bool,
  activeKey: React.PropTypes.string,
  selectedKeys: React.PropTypes.arrayOf(React.PropTypes.string),
  defaultSelectedKeys: React.PropTypes.arrayOf(React.PropTypes.string),
};

Menu.defaultProps = {
  prefixCls: 'rc-menu',
  mode: 'vertical',
  level: 1,
  inlineIndent: 24,
  focusable: true,
  openOnHover: true,
  closeOnDeActive: true,
  style: {},
  onSelect: noop,
  onClick: noop,
  onDeselect: noop,
};

export default Menu;
