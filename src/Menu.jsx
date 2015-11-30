import React from 'react';
import MenuMixin from './MenuMixin';
import assign from 'object-assign';
import {noop, getKeyFromChildrenIndex} from './util';

const Menu = React.createClass({
  propTypes: {
    openSubMenuOnMouseEnter: React.PropTypes.bool,
    closeSubMenuOnMouseLeave: React.PropTypes.bool,
    selectedKeys: React.PropTypes.arrayOf(React.PropTypes.string),
    defaultSelectedKeys: React.PropTypes.arrayOf(React.PropTypes.string),
    defaultOpenKeys: React.PropTypes.arrayOf(React.PropTypes.string),
    openKeys: React.PropTypes.arrayOf(React.PropTypes.string),
    mode: React.PropTypes.string,
    onClick: React.PropTypes.func,
    onSelect: React.PropTypes.func,
    onDeselect: React.PropTypes.func,
    onDestroy: React.PropTypes.func,
    openTransitionName: React.PropTypes.string,
    openAnimation: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.object]),
    level: React.PropTypes.number,
    eventKey: React.PropTypes.string,
    selectable: React.PropTypes.bool,
    children: React.PropTypes.any,
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
      selectedKeys, openKeys,
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
    const {item} = e;
    // special for top sub menu
    if (this.props.mode !== 'inline' && !this.props.closeSubMenuOnMouseLeave && item.isSubMenu) {
      const activeKey = this.state.activeKey;
      const activeItem = this.getFlatInstanceArray().filter((c)=> {
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
          selectedKeys: selectedKeys,
        });
      }
      props.onSelect(assign({}, selectInfo, {
        selectedKeys: selectedKeys,
      }));
    }
  },

  onClick(e) {
    const props = this.props;
    props.onClick(e);
  },

  onOpenChange(e) {
    let openKeys = this.state.openKeys;
    const props = this.props;
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
      if (!('openKeys' in this.props)) {
        // hack: batch does not update state
        this.state.openKeys = openKeys;
        this.setState({openKeys});
      }
      const info = assign({openKeys}, e);
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
          selectedKeys: selectedKeys,
        });
      }
      props.onDeselect(assign({}, selectInfo, {
        selectedKeys: selectedKeys,
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
      lastOpen = this.getFlatInstanceArray().filter((c)=> {
        return c && this.state.openKeys.indexOf(c.props.eventKey) !== -1;
      });
    }
    return lastOpen[0];
  },

  renderMenuItem(c, i, subIndex) {
    const key = getKeyFromChildrenIndex(c, this.props.eventKey, i);
    const state = this.state;
    const extraProps = {
      openKeys: state.openKeys,
      open: state.openKeys.indexOf(key) !== -1,
      selectedKeys: state.selectedKeys,
      selected: state.selectedKeys.indexOf(key) !== -1,
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
