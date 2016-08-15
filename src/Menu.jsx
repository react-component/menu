import React, { PropTypes } from 'react';
import MenuMixin from './MenuMixin';
import assign from 'object-assign';
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

  mixins: [MenuMixin],

  getDefaultProps() {
    return {
      openSubMenuOnMouseEnter: true,
      closeSubMenuOnMouseLeave: true,
      selectable: true,
      onClick: noop,
      onSelect: noop,
      onOpen: noop,
      onClose: noop,
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

  componentWillReceiveProps(nextProps) {
    const props = {};
    if ('selectedKeys' in nextProps) {
      props.selectedKeys = nextProps.selectedKeys;
    }
    if ('openKeys' in nextProps) {
      props.openKeys = nextProps.openKeys;
    }
    this.setState(props);
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
    // special for top sub menu
    if (this.props.mode !== 'inline' && !this.props.closeSubMenuOnMouseLeave && item.isSubMenu) {
      const activeKey = this.state.activeKey;
      const activeItem = this.getFlatInstanceArray().filter((c) => {
        return c && c.props.eventKey === activeKey;
      })[0];
      if (activeItem && activeItem.props.open) {
        this.onOpenChange({
          key: item.props.eventKey,
          item: e.item,
          open: true,
        });
      }
    }

    this.onCommonItemHover(e);
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
      props.onSelect(assign({}, selectInfo, {
        selectedKeys,
      }));
    }
  },

  onClick(e) {
    this.props.onClick(e);
  },

  onOpenChange(e) {
    const props = this.props;
    let openKeys = this.state.openKeys;
    let changed = true;
    if (e.open) {
      changed = openKeys.indexOf(e.key) === -1;
      if (changed) {
        openKeys = openKeys.concat(e.key);
      }
    } else {
      const index = openKeys.indexOf(e.key);
      changed = index !== -1;
      if (changed) {
        openKeys = openKeys.concat();
        openKeys.splice(index, 1);
      }
    }
    if (changed) {
      // hack, synchronous call from onTitleMouseEnter
      if (props.mode !== 'inline') {
        this.state.openKeys = openKeys;
      }
      if (!('openKeys' in this.props)) {
        // hack: batch does not update state
        this.setState({ openKeys });
      }
      const info = assign({ openKeys }, e);
      if (e.open) {
        props.onOpen(info);
      } else {
        props.onClose(info);
      }
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
      props.onDeselect(assign({}, selectInfo, {
        selectedKeys,
      }));
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
    if (this.state.openKeys.length) {
      lastOpen = this.getFlatInstanceArray().filter((c) => {
        return c && this.state.openKeys.indexOf(c.props.eventKey) !== -1;
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
    const props = assign({}, this.props);
    props.className += ` ${props.prefixCls}-root`;
    return this.renderRoot(props);
  },
});

export default Menu;
