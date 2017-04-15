import React, { PropTypes } from 'react';
import MenuMixin from './MenuMixin';
import { noop } from './util';

const Menu = React.createClass({
  propTypes: {
    openSubMenuOnMouseEnter: PropTypes.bool,
    closeSubMenuOnMouseLeave: PropTypes.bool,
    selectedKeys: PropTypes.arrayOf(PropTypes.string),
    defaultSelectedKeys: PropTypes.arrayOf(PropTypes.string),
    defaultOpenKeys: PropTypes.arrayOf(PropTypes.string),
    openKeys: PropTypes.arrayOf(PropTypes.string),
    mode: PropTypes.string,
    onClick: PropTypes.func,
    onSelect: PropTypes.func,
    onDeselect: PropTypes.func,
    onDestroy: PropTypes.func,
    openTransitionName: PropTypes.string,
    openAnimation: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    level: PropTypes.number,
    eventKey: PropTypes.string,
    selectable: PropTypes.bool,
    children: PropTypes.any,
  },

  childContextTypes: {
    parentMenu: PropTypes.object,
    openKeys: PropTypes.arrayOf(PropTypes.string),
    activeKey: PropTypes.string,
    selectedKeys: PropTypes.arrayOf(PropTypes.string),
    mode: PropTypes.string,
    level: PropTypes.number,
    multiple: PropTypes.bool,
    inlineIndent: PropTypes.number,
    rootPrefixCls: PropTypes.string,
    openAnimation: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    openSubMenuOnMouseEnter: PropTypes.bool,
    closeSubMenuOnMouseLeave: PropTypes.bool,
    saveRef: PropTypes.func,
    onClick: PropTypes.func,
    onSelect: PropTypes.func,
    onDestroy: PropTypes.func,
    onDeselect: PropTypes.func,
    onItemHover: PropTypes.func,
    onOpenChange: PropTypes.func,
    getEventKey: PropTypes.func,
    openTransitionName: PropTypes.string,
  },

  mixins: [MenuMixin],

  getDefaultProps() {
    return {
      openSubMenuOnMouseEnter: true,
      closeSubMenuOnMouseLeave: true,
      selectable: true,
      onClick: noop,
      onSelect: noop,
      onOpenChange: noop,
      onDeselect: noop,
      defaultSelectedKeys: [],
      defaultOpenKeys: [],
    };
  },

  getInitialState() {
    const props = this.props;
    let selectedKeys = props.defaultSelectedKeys;
    let openKeys = props.defaultOpenKeys;
    if ('selectedKeys' in props) {
      selectedKeys = props.selectedKeys || [];
    }
    if ('openKeys' in props) {
      openKeys = props.openKeys || [];
    }
    return {
      selectedKeys,
      openKeys,
    };
  },

  /**
   * renderMenuItem // 没用
   * index // 没用
   * ref // 通过 callback 实现
   * eventKey // 通过 callback 实现
   * active => activeKey
   */
  getChildContext() {
    return {
      parentMenu: this,
      openKeys: this.state.openKeys,
      activeKey: this.state.activeKey,
      selectedKeys: this.state.selectedKeys,
      mode: this.props.mode,
      level: this.props.level,
      multiple: this.props.multiple,
      inlineIndent: this.props.inlineIndent,
      rootPrefixCls: this.props.prefixCls,
      openAnimation: this.props.openAnimation,
      openSubMenuOnMouseEnter: this.props.mode === 'inline' ? false : this.props.openSubMenuOnMouseEnter,
      closeSubMenuOnMouseLeave: this.props.mode === 'inline' ? false : this.props.closeSubMenuOnMouseLeave,
      saveRef: this.saveRef,
      onClick: this.onClick,
      onSelect: this.onSelect,
      onDestroy: this.onDestroy,
      onDeselect: this.onDeselect,
      onItemHover: this.onItemHover,
      onOpenChange: this.onOpenChange,
      getEventKey: this.getEventKey,
      openTransitionName: this.getOpenTransitionName(),
    };
  },

  componentWillReceiveProps(nextProps) {
    const props = {};
    if ('selectedKeys' in nextProps) {
      props.selectedKeys = nextProps.selectedKeys || [];
    }
    if ('openKeys' in nextProps) {
      props.openKeys = nextProps.openKeys || [];
    }
    this.setState(props);
  },

  componentWillUpdate() {
    this.refIndex = null;
    this.instanceArray = [];
  },

  onDestroy(key) {
    const state = this.state;
    const props = this.props;
    const selectedKeys = state.selectedKeys;
    const openKeys = state.openKeys;
    let index = selectedKeys.indexOf(key);
    if (!('selectedKeys' in props) && index !== -1) {
      selectedKeys.splice(index, 1);
    }
    index = openKeys.indexOf(key);
    if (!('openKeys' in props) && index !== -1) {
      openKeys.splice(index, 1);
    }
  },

  onItemHover(e) {
    const { item } = e;
    const { mode, closeSubMenuOnMouseLeave } = this.props;
    let { openChanges = [] } = e;
    // special for top sub menu
    if (mode !== 'inline' && !closeSubMenuOnMouseLeave && item.isSubMenu) {
      const activeKey = this.state.activeKey;
      const activeItem = this.getFlatInstanceArray().filter((c) => {
        return c && c.getEventKey() === activeKey;
      })[0];
      if (activeItem && activeItem.props.open) {
        openChanges = openChanges.concat({
          key: item.getEventKey(),
          item,
          originalEvent: e,
          open: true,
        });
      }
    }
    openChanges = openChanges.concat(this.getOpenChangesOnItemHover(e));
    if (openChanges.length) {
      this.onOpenChange(openChanges);
    }
  },

  onSelect(selectInfo) {
    const props = this.props;
    if (props.selectable) {
      // root menu
      let selectedKeys = this.state.selectedKeys;
      const selectedKey = selectInfo.key;
      if (props.multiple) {
        selectedKeys = selectedKeys.concat([selectedKey]);
      } else {
        selectedKeys = [selectedKey];
      }
      if (!('selectedKeys' in props)) {
        this.setState({
          selectedKeys,
        });
      }
      props.onSelect({
        ...selectInfo,
        selectedKeys,
      });
    }
  },

  onClick(e) {
    this.props.onClick(e);
  },

  onOpenChange(e_) {
    const props = this.props;
    const openKeys = this.state.openKeys.concat();
    let changed = false;
    const processSingle = (e) => {
      let oneChanged = false;
      if (e.open) {
        oneChanged = openKeys.indexOf(e.key) === -1;
        if (oneChanged) {
          openKeys.push(e.key);
        }
      } else {
        const index = openKeys.indexOf(e.key);
        oneChanged = index !== -1;
        if (oneChanged) {
          openKeys.splice(index, 1);
        }
      }
      changed = changed || oneChanged;
    };
    if (Array.isArray(e_)) {
      // batch change call
      e_.forEach(processSingle);
    } else {
      processSingle(e_);
    }
    if (changed) {
      if (!('openKeys' in this.props)) {
        this.setState({ openKeys });
      }
      props.onOpenChange(openKeys);
    }
  },

  onDeselect(selectInfo) {
    const props = this.props;
    if (props.selectable) {
      const selectedKeys = this.state.selectedKeys.concat();
      const selectedKey = selectInfo.key;
      const index = selectedKeys.indexOf(selectedKey);
      if (index !== -1) {
        selectedKeys.splice(index, 1);
      }
      if (!('selectedKeys' in props)) {
        this.setState({
          selectedKeys,
        });
      }
      props.onDeselect({
        ...selectInfo,
        selectedKeys,
      });
    }
  },

  getOpenTransitionName() {
    const props = this.props;
    let transitionName = props.openTransitionName;
    const animationName = props.openAnimation;
    if (!transitionName && typeof animationName === 'string') {
      transitionName = `${props.prefixCls}-open-${animationName}`;
    }
    return transitionName;
  },

  isInlineMode() {
    return this.props.mode === 'inline';
  },

  lastOpenSubMenu() {
    let lastOpen = [];
    const { openKeys } = this.state;
    if (openKeys.length) {
      lastOpen = this.getFlatInstanceArray().filter((c) => {
        return c && openKeys.indexOf(c.getEventKey()) !== -1;
      });
    }
    return lastOpen[0];
  },

  renderMenuItem(c, i, subIndex) {
    if (!c) {
      return null;
    }
    const state = this.state;
    const extraProps = {
      openKeys: state.openKeys,
      selectedKeys: state.selectedKeys,
      openSubMenuOnMouseEnter: this.props.openSubMenuOnMouseEnter,
    };
    return this.renderCommonMenuItem(c, i, subIndex, extraProps);
  },

  render() {
    const props = { ...this.props };
    props.className += ` ${props.prefixCls}-root`;
    return this.renderRoot(props);
  },
});

export default Menu;
