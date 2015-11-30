import React from 'react';
import ReactDOM from 'react-dom';
import {createChainedFunction, KeyCode} from 'rc-util';
import classnames from 'classnames';
import scrollIntoView from 'dom-scroll-into-view';
import assign from 'object-assign';
import {getKeyFromChildrenIndex} from './util';
import DOMWrap from './DOMWrap';

function getActiveKey(props) {
  let activeKey = props.activeKey;
  const children = props.children;
  const eventKey = props.eventKey;
  if (activeKey) {
    let found;
    React.Children.forEach(children, (c, i)=> {
      if (!c.props.disabled && activeKey === getKeyFromChildrenIndex(c, eventKey, i)) {
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
        activeKey = getKeyFromChildrenIndex(c, eventKey, i);
      }
    });
    return activeKey;
  }
  return activeKey;
}

function saveRef(index, subIndex, c) {
  if (c) {
    if (subIndex !== undefined) {
      this.instanceArray[index] = this.instanceArray[index] || [];
      this.instanceArray[index][subIndex] = c;
    } else {
      this.instanceArray[index] = c;
    }
  }
}

const MenuMixin = {
  propTypes: {
    focusable: React.PropTypes.bool,
    multiple: React.PropTypes.bool,
    style: React.PropTypes.object,
    defaultActiveFirst: React.PropTypes.bool,
    visible: React.PropTypes.bool,
    activeKey: React.PropTypes.string,
    selectedKeys: React.PropTypes.arrayOf(React.PropTypes.string),
    defaultSelectedKeys: React.PropTypes.arrayOf(React.PropTypes.string),
    defaultOpenKeys: React.PropTypes.arrayOf(React.PropTypes.string),
    openKeys: React.PropTypes.arrayOf(React.PropTypes.string),
    children: React.PropTypes.any,
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
      style: {},
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
    this.getFlatInstanceArray().forEach((obj)=> {
      if (obj && obj.props.active) {
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
        scrollIntoView(ReactDOM.findDOMNode(activeItem), ReactDOM.findDOMNode(this), {
          onlyScrollIfNeeded: true,
        });
      });
      return 1;
    }
  },

  onCommonItemHover(e) {
    const {mode} = this.props;
    const {key, hover, trigger} = e;
    const activeKey = this.state.activeKey;
    if (!trigger || hover || this.props.closeSubMenuOnMouseLeave || !e.item.isSubMenu || mode === 'inline') {
      this.setState({
        activeKey: hover ? key : null,
      });
    } else {
      // keep active for sub menu for click active
      // empty
    }
    // clear last open status
    if (hover && mode !== 'inline') {
      const activeItem = this.getFlatInstanceArray().filter((c)=> {
        return c && c.props.eventKey === activeKey;
      })[0];
      if (activeItem && activeItem.isSubMenu && activeItem.props.eventKey !== key) {
        this.onOpenChange({
          item: activeItem,
          key: activeItem.props.eventKey,
          open: false,
        });
      }
    }
  },

  getFlatInstanceArray() {
    let instanceArray = this.instanceArray;
    const hasInnerArray = instanceArray.some((a)=> {
      return Array.isArray(a);
    });
    if (hasInnerArray) {
      instanceArray = [];
      this.instanceArray.forEach((a)=> {
        if (Array.isArray(a)) {
          instanceArray.push.apply(instanceArray, a);
        } else {
          instanceArray.push(a);
        }
      });
      this.instanceArray = instanceArray;
    }
    return instanceArray;
  },

  renderCommonMenuItem(child, i, subIndex, extraProps) {
    const state = this.state;
    const props = this.props;
    const key = getKeyFromChildrenIndex(child, props.eventKey, i);
    const childProps = child.props;
    const newChildProps = assign({
      mode: props.mode,
      level: props.level,
      inlineIndent: props.inlineIndent,
      renderMenuItem: this.renderMenuItem,
      rootPrefixCls: props.prefixCls,
      index: i,
      ref: childProps.disabled ? undefined : createChainedFunction(child.ref, saveRef.bind(this, i, subIndex)),
      eventKey: key,
      closeSubMenuOnMouseLeave: props.closeSubMenuOnMouseLeave,
      onItemHover: this.onItemHover,
      active: !childProps.disabled && key === state.activeKey,
      multiple: props.multiple,
      onClick: this.onClick,
      openTransitionName: this.getOpenTransitionName(),
      openAnimation: props.openAnimation,
      onOpenChange: this.onOpenChange,
      onDeselect: this.onDeselect,
      onDestroy: this.onDestroy,
      onSelect: this.onSelect,
    }, extraProps);
    if (props.mode === 'inline') {
      newChildProps.closeSubMenuOnMouseLeave = newChildProps.openSubMenuOnMouseEnter = false;
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
      className: classnames(classes),
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
      // ESLint is not smart enough to know that the type of `children` was checked.
      /* eslint-disable */
      <DOMWrap style={props.style}
               tag="ul"
               hiddenClassName={`${props.prefixCls}-hidden`}
               visible={props.visible}
        {...domProps}>
        {React.Children.map(props.children, this.renderMenuItem)}
      </DOMWrap>
      /*eslint-enable */
    );
  },

  step(direction) {
    let children = this.getFlatInstanceArray();
    const activeKey = this.state.activeKey;
    const len = children.length;
    if (direction < 0) {
      children = children.concat().reverse();
    }
    // find current activeIndex
    let activeIndex = -1;
    children.every((c, ci)=> {
      if (c && c.props.eventKey === activeKey) {
        activeIndex = ci;
        return false;
      }
      return true;
    });
    const start = (activeIndex + 1) % len;
    let i = start;
    for (; ;) {
      const child = children[i];
      if (!child || child.props.disabled) {
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
