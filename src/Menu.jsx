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
    defaultOpenedKeys: React.PropTypes.arrayOf(React.PropTypes.string),
    openedKeys: React.PropTypes.arrayOf(React.PropTypes.string),
    mode: React.PropTypes.string,
    onClick: React.PropTypes.func,
    onOpenedChange: React.PropTypes.func,
    onSelect: React.PropTypes.func,
    onDeselect: React.PropTypes.func,
    onDestroy: React.PropTypes.func,
  },

  getDefaultProps() {
    return {
      openSubMenuOnMouseEnter: true,
      closeSubMenuOnMouseLeave: true,
      onOpenedChange: noop,
      onClick: noop,
      onSelect: noop,
      onOpen: noop,
      onClose: noop,
      onDeselect: noop,
      defaultSelectedKeys: [],
      defaultOpenedKeys: [],
    };
  },

  mixins: [MenuMixin],

  getInitialState() {
    const props = this.props;
    let selectedKeys = props.defaultSelectedKeys;
    let openedKeys = props.defaultOpenedKeys;
    if ('selectedKeys' in props) {
      selectedKeys = props.selectedKeys || [];
    }
    if ('openedKeys' in props) {
      openedKeys = props.openedKeys || [];
    }
    return {
      selectedKeys, openedKeys,
    };
  },

  componentWillReceiveProps(nextProps) {
    const props = {};
    if ('selectedKeys' in nextProps) {
      props.selectedKeys = nextProps.selectedKeys;
    }
    if ('openedKeys' in nextProps) {
      props.openedKeys = nextProps.openedKeys;
    }
    this.setState(props);
  },

  onDestroy(key) {
    const state = this.state;
    const props = this.props;
    const selectedKeys = state.selectedKeys;
    const openedKeys = state.openedKeys;
    let index = selectedKeys.indexOf(key);
    if (!('selectedKeys' in props) && index !== -1) {
      selectedKeys.splice(index, 1);
    }
    index = openedKeys.indexOf(key);
    if (!('openedKeys' in props) && index !== -1) {
      openedKeys.splice(index, 1);
    }
  },

  onItemHover(e) {
    const {item} = e;
    // special for top sub menu
    if (this.props.mode !== 'inline' && !this.props.closeSubMenuOnMouseLeave && item.isSubMenu) {
      const activeKey = this.state.activeKey;
      const activeItem = this.instanceArray.filter((c)=> {
        return c.props.eventKey === activeKey;
      })[0];
      if (activeItem && activeItem.props.opened) {
        this.onOpenedChange({
          key: item.props.eventKey,
          item: e.item,
          opened: true,
        });
      }
    }

    this.onCommonItemHover(e);
  },

  onSelect(selectInfo) {
    const props = this.props;
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
  },

  onClick(e) {
    const props = this.props;
    if (!props.multiple && !this.isInlineMode()) {
      const tmp = this.instanceArray.filter((c)=> {
        return c.props.eventKey === e.key;
      });
      if (!tmp.length) {
        this.setState({
          activeKey: null,
        });
        if (!('openedKeys' in this.props)) {
          this.setState({openedKeys: []});
        }
        this.props.onOpenedChange({openedKeys: []});
      }
    }
    props.onClick(e);
  },

  onOpenedChange(e) {
    let openedKeys = this.state.openedKeys;
    const props = this.props;
    let changed = true;
    if (e.opened) {
      changed = openedKeys.indexOf(e.key) === -1;
      if (changed) {
        openedKeys = openedKeys.concat(e.key);
      }
    } else {
      const index = openedKeys.indexOf(e.key);
      changed = index !== -1;
      if (changed) {
        openedKeys = openedKeys.concat();
        openedKeys.splice(index, 1);
      }
    }
    if (changed) {
      // hack: batch does not update state
      this.state.openedKeys = openedKeys;
      if (!('openedKeys' in this.props)) {
        this.setState({openedKeys});
      }
      const info = assign({openedKeys}, e);
      if (e.opened) {
        props.onOpen(info);
      } else {
        props.onClose(info);
      }
    }
  },

  onDeselect(selectInfo) {
    const props = this.props;
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
  },

  renderMenuItem(c, i) {
    const key = getKeyFromChildrenIndex(c, i);
    const state = this.state;
    const extraProps = {
      openedKeys: state.openedKeys,
      opened: state.openedKeys.indexOf(key) !== -1,
      selectedKeys: state.selectedKeys,
      selected: state.selectedKeys.indexOf(key) !== -1,
      openSubMenuOnMouseEnter: this.props.openSubMenuOnMouseEnter,
    };
    return this.renderCommonMenuItem(c, i, extraProps);
  },

  render() {
    const props = assign({}, this.props);
    props.className += ` ${props.prefixCls}-root`;
    return this.renderRoot(props);
  },

  isInlineMode() {
    return this.props.mode === 'inline';
  },

  lastOpenedSubMenu() {
    let lastOpen = [];
    if (this.state.openedKeys.length) {
      lastOpen = this.instanceArray.filter((c)=> {
        return this.state.openedKeys.indexOf(c.props.eventKey) !== -1;
      });
    }
    return lastOpen[0];
  },
});

export default Menu;
