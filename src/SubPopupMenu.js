import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'mini-store';
import KeyCode from 'rc-util/lib/KeyCode';
import createChainedFunction from 'rc-util/lib/createChainedFunction';
import classNames from 'classnames';
import { getKeyFromChildrenIndex, loopMenuItem, noop, menuAllProps } from './util';
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

export class SubPopupMenu extends React.Component {
  static propTypes = {
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
    eventKey: PropTypes.string,
    store: PropTypes.shape({
      getState: PropTypes.func,
      setState: PropTypes.func,
    }),

    // adding in refactor
    focusable: PropTypes.bool,
    multiple: PropTypes.bool,
    style: PropTypes.object,
    defaultActiveFirst: PropTypes.bool,
    activeKey: PropTypes.string,
    selectedKeys: PropTypes.arrayOf(PropTypes.string),
    defaultSelectedKeys: PropTypes.arrayOf(PropTypes.string),
    defaultOpenKeys: PropTypes.arrayOf(PropTypes.string),
    level: PropTypes.number,
    mode: PropTypes.oneOf(['horizontal', 'vertical', 'vertical-left', 'vertical-right', 'inline']),
    triggerSubMenuAction: PropTypes.oneOf(['click', 'hover']),
    inlineIndent: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    manualRef: PropTypes.func,
  };

  static defaultProps = {
    prefixCls: 'rc-menu',
    className: '',
    mode: 'vertical',
    level: 1,
    inlineIndent: 24,
    visible: true,
    focusable: true,
    style: {},
    manualRef: noop,
  };

  constructor(props) {
    super(props);

    props.store.setState({
      activeKey: {
        ...props.store.getState().activeKey,
        [props.eventKey]: getActiveKey(props, props.activeKey),
      },
    });
  }

  componentWillMount() {
    this.instanceArray = [];
  }

  componentDidMount() {
    // invoke customized ref to expose component to mixin
    if (this.props.manualRef) {
      this.props.manualRef(this);
    }
  }

  componentWillReceiveProps(nextProps) {
    const originalActiveKey = 'activeKey' in nextProps ? nextProps.activeKey :
      this.getStore().getState().activeKey[this.getEventKey()];
    const activeKey = getActiveKey(nextProps, originalActiveKey);
    if (activeKey !== originalActiveKey) {
      updateActiveKey(this.getStore(), this.getEventKey(), activeKey);
    }
  }

  shouldComponentUpdate(nextProps) {
    return this.props.visible || nextProps.visible;
  }

  // all keyboard events callbacks run from here at first
  onKeyDown = (e, callback) => {
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
  };

  onItemHover = (e) => {
    const { key, hover } = e;
    updateActiveKey(this.getStore(), this.getEventKey(), hover ? key : null);
  };

  onDeselect = (selectInfo) => {
    this.props.onDeselect(selectInfo);
  };

  onSelect = (selectInfo) => {
    this.props.onSelect(selectInfo);
  }

  onClick = (e) => {
    this.props.onClick(e);
  };

  onOpenChange = (e) => {
    this.props.onOpenChange(e);
  };

  onDestroy = (key) => {
    /* istanbul ignore next */
    this.props.onDestroy(key);
  };

  getFlatInstanceArray = () => {
    return this.instanceArray;
  };

  getStore = () => {
    return this.props.store;
  };

  getEventKey = () => {
    // when eventKey not available ,it's menu and return menu id '0-menu-'
    return this.props.eventKey || '0-menu-';
  };

  getOpenTransitionName = () => {
    return this.props.openTransitionName;
  };

  step = (direction) => {
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
    if (
      !this.props.defaultActiveFirst && activeIndex !== -1
      &&
      allDisabled(children.slice(activeIndex, len - 1))
    ) {
      return undefined;
    }
    const start = (activeIndex + 1) % len;
    let i = start;

    do {
      const child = children[i];
      if (!child || child.props.disabled) {
        i = (i + 1) % len;
      } else {
        return child;
      }
    } while (i !== start);

    return null;
  };

  renderCommonMenuItem = (child, i, extraProps) => {
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
      onClick: (e) => {
        (childProps.onClick || noop)(e);
        this.onClick(e);
      },
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
  };

  renderMenuItem = (c, i, subMenuKey) => {
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
  };

  render() {
    const { ...props } = this.props;
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
    const { prefixCls, eventKey, visible } = props;
    menuAllProps.forEach(key => delete props[key]);
    return (
      // ESLint is not smart enough to know that the type of `children` was checked.
      /* eslint-disable */
      <DOMWrap
        {...props}
        tag="ul"
        hiddenClassName={`${prefixCls}-hidden`}
        visible={visible}
        {...domProps}
      >
        {React.Children.map(
          props.children,
          (c, i) => this.renderMenuItem(c, i, eventKey || '0-menu-'),
        )}
      </DOMWrap>
      /*eslint-enable */
    );
  }
}

export default connect()(SubPopupMenu);
