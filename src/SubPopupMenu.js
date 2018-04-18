import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import Animate from 'rc-animate';
import { connect } from 'mini-store';
import KeyCode from 'rc-util/lib/KeyCode';
import createChainedFunction from 'rc-util/lib/createChainedFunction';
import classNames from 'classnames';
import { getKeyFromChildrenIndex, loopMenuItem } from './util';
import DOMWrap from './DOMWrap';

function allDisabled(arr) {
  if (!arr.length) {
    return true;
  }
  return arr.every(c => !!c.props.disabled);
}

function updateActiveKey(store, menuId, activeKey) {
  const state = store.getState();
  store.setState({
    activeKey: {
      ...state.activeKey,
      [menuId]: activeKey,
    },
  });
}

export function getActiveKey(props, originalActiveKey) {
  let activeKey = originalActiveKey;
  const { children, eventKey } = props;
  if (activeKey) {
    let found;
    loopMenuItem(children, (c, i) => {
      if (c && !c.props.disabled && activeKey === getKeyFromChildrenIndex(c, eventKey, i)) {
        found = true;
      }
    });
    if (found) {
      return activeKey;
    }
  }
  activeKey = null;
  if (props.defaultActiveFirst) {
    loopMenuItem(children, (c, i) => {
      if (!activeKey && c && !c.props.disabled) {
        activeKey = getKeyFromChildrenIndex(c, eventKey, i);
      }
    });
    return activeKey;
  }
  return activeKey;
}

function saveRef(index, c) {
  if (c) {
    this.instanceArray[index] = c;
  }
}

const SubPopupMenu = createReactClass({
  displayName: 'SubPopupMenu',

  propTypes: {
    onSelect: PropTypes.func,
    onClick: PropTypes.func,
    onDeselect: PropTypes.func,
    onOpenChange: PropTypes.func,
    onDestroy: PropTypes.func,
    openTransitionName: PropTypes.string,
    openAnimation: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    openKeys: PropTypes.arrayOf(PropTypes.string),
    visible: PropTypes.bool,
    children: PropTypes.any,
    parentMenu: PropTypes.object,

    // adding in refactor
    focusable: PropTypes.bool,
    multiple: PropTypes.bool,
    style: PropTypes.object,
    defaultActiveFirst: PropTypes.bool,
    activeKey: PropTypes.string,
    selectedKeys: PropTypes.arrayOf(PropTypes.string),
    defaultSelectedKeys: PropTypes.arrayOf(PropTypes.string),
    defaultOpenKeys: PropTypes.arrayOf(PropTypes.string),
    openKeys: PropTypes.arrayOf(PropTypes.string),
    level: PropTypes.number,
    mode: PropTypes.oneOf(['horizontal', 'vertical', 'vertical-left', 'vertical-right', 'inline']),
    inlineIndent: PropTypes.number,
  },

  getInitialState() {
    const props = this.props;
    props.store.setState({
      activeKey: {
        ...props.store.getState().activeKey,
        [props.eventKey]: getActiveKey(props, props.activeKey),
      },
    });

    return {};
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

  componentWillReceiveProps(nextProps) {
    const originalActiveKey = 'activeKey' in nextProps ? nextProps.activeKey :
      this.getStore().getState().activeKey[this.getEventKey()];
    const activeKey = getActiveKey(nextProps, originalActiveKey);
    if (activeKey !== originalActiveKey) {
      updateActiveKey(this.getStore(), this.getEventKey(), activeKey);
    }
  },

  componentDidMount() {
    // invoke customized ref to expose component to mixin
    if (this.props.manualRef) {
      this.props.manualRef(this);
    }
  },

  shouldComponentUpdate(nextProps) {
    return this.props.visible || nextProps.visible;
  },

  componentWillMount() {
    this.instanceArray = [];
  },

  // all keyboard events callbacks run from here at first
  // FIXME: callback is currently used by rc-select, should be more explicit
  onKeyDown(e, callback) {
    const keyCode = e.keyCode;
    let handled;
    this.getFlatInstanceArray().forEach((obj) => {
      if (obj && obj.props.active && obj.onKeyDown) {
        handled = obj.onKeyDown(e);
      }
    });
    if (handled) {
      return 1;
    }
    let activeItem = null;
    if (keyCode === KeyCode.UP || keyCode === KeyCode.DOWN) {
      activeItem = this.step(keyCode === KeyCode.UP ? -1 : 1);
    }
    if (activeItem) {
      e.preventDefault();
      updateActiveKey(this.getStore(), this.getEventKey(), activeItem.props.eventKey);

      if (typeof callback === 'function') {
        callback(activeItem);
      }

      return 1;
    }
  },

  onItemHover(e) {
    const { key, hover } = e;
    updateActiveKey(this.getStore(), this.getEventKey(), hover ? key : null);
  },

  getEventKey() {
    // when eventKey not available ,it's menu and return menu id '0-menu-'
    return this.props.eventKey || '0-menu-';
  },

  getStore() {
    const store = this.props.store;

    return store;
  },

  getFlatInstanceArray() {
    return this.instanceArray;
  },

  onDeselect(selectInfo) {
    this.props.onDeselect(selectInfo);
  },

  onSelect(selectInfo) {
    this.props.onSelect(selectInfo);
  },

  onClick(e) {
    this.props.onClick(e);
  },

  onOpenChange(e) {
    this.props.onOpenChange(e);
  },

  onDestroy(key) {
    /* istanbul ignore next */
    this.props.onDestroy(key);
  },

  getOpenTransitionName() {
    return this.props.openTransitionName;
  },

  renderCommonMenuItem(child, i, extraProps) {
    const state = this.getStore().getState();
    const props = this.props;
    const key = getKeyFromChildrenIndex(child, props.eventKey, i);
    const childProps = child.props;
    const isActive = key === state.activeKey;
    const newChildProps = {
      mode: props.mode,
      level: props.level,
      inlineIndent: props.inlineIndent,
      renderMenuItem: this.renderMenuItem,
      rootPrefixCls: props.prefixCls,
      index: i,
      parentMenu: props.parentMenu,
      // customized ref function, need to be invoked manually in child's componentDidMount
      manualRef: childProps.disabled ? undefined :
        createChainedFunction(child.ref, saveRef.bind(this, i)),
      eventKey: key,
      active: !childProps.disabled && isActive,
      multiple: props.multiple,
      onClick: this.onClick,
      onItemHover: this.onItemHover,
      openTransitionName: this.getOpenTransitionName(),
      openAnimation: props.openAnimation,
      subMenuOpenDelay: props.subMenuOpenDelay,
      subMenuCloseDelay: props.subMenuCloseDelay,
      forceSubMenuRender: props.forceSubMenuRender,
      onOpenChange: this.onOpenChange,
      onDeselect: this.onDeselect,
      onSelect: this.onSelect,
      ...extraProps,
    };
    if (props.mode === 'inline') {
      newChildProps.triggerSubMenuAction = 'click';
    }
    return React.cloneElement(child, newChildProps);
  },

  renderMenuItem(c, i, subMenuKey) {
    /* istanbul ignore if */
    if (!c) {
      return null;
    }
    const state = this.getStore().getState();
    const extraProps = {
      openKeys: state.openKeys,
      selectedKeys: state.selectedKeys,
      triggerSubMenuAction: this.props.triggerSubMenuAction,
      subMenuKey,
    };
    return this.renderCommonMenuItem(c, i, extraProps);
  },

  render() {
    const props = this.props;
    this.instanceArray = [];
    const className = classNames(
      props.prefixCls,
      props.className,
      `${props.prefixCls}-${props.mode}`,
    );
    const domProps = {
      className,
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
      <DOMWrap
        style={props.style}
        tag="ul"
        hiddenClassName={`${props.prefixCls}-hidden`}
        visible={props.visible}
        {...domProps}
      >
        {React.Children.map(
          props.children,
          (c, i) => this.renderMenuItem(c, i, props.eventKey || '0-menu-'),
        )}
      </DOMWrap>
      /*eslint-enable */
    );
  },

  step(direction) {
    let children = this.getFlatInstanceArray();
    const activeKey = this.getStore().getState().activeKey[this.getEventKey()];
    const len = children.length;
    if (!len) {
      return null;
    }
    if (direction < 0) {
      children = children.concat().reverse();
    }
    // find current activeIndex
    let activeIndex = -1;
    children.every((c, ci) => {
      if (c && c.props.eventKey === activeKey) {
        activeIndex = ci;
        return false;
      }
      return true;
    });
    if (!this.props.defaultActiveFirst && activeIndex !== -1) {
      if (allDisabled(children.slice(activeIndex, len - 1))) {
        return undefined;
      }
    }
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
});

export default connect()(SubPopupMenu);
