import React from 'react';
import MenuMixin from './MenuMixin';
import assign from 'object-assign';
import {getKeyFromChildrenIndex} from './util';

const Menu = React.createClass({
  propTypes: {
    openSubMenuOnMouseEnter: React.PropTypes.bool,
    selectedKeys: React.PropTypes.arrayOf(React.PropTypes.string),
    defaultSelectedKeys: React.PropTypes.arrayOf(React.PropTypes.string),
    defaultExpandedKeys: React.PropTypes.arrayOf(React.PropTypes.string),
    expandedKeys: React.PropTypes.arrayOf(React.PropTypes.string),
    mode: React.PropTypes.string,
    onClick: React.PropTypes.func,
    onExpandedChange: React.PropTypes.func,
    onSelect: React.PropTypes.func,
    onDeselect: React.PropTypes.func,
    onDestroy: React.PropTypes.func,
  },

  getDefaultProps() {
    return {
      openSubMenuOnMouseEnter: true,
      onExpandedChange() {
      },
      onClick() {
      },
      onSelect() {
      },
      onDeselect() {
      },
      defaultSelectedKeys: [],
      defaultExpandedKeys: [],
    };
  },

  mixins: [MenuMixin],

  getInitialState() {
    const props = this.props;
    let selectedKeys = props.defaultSelectedKeys;
    let expandedKeys = props.defaultExpandedKeys;
    if ('selectedKeys' in props) {
      selectedKeys = props.selectedKeys || [];
    }
    if ('expandedKeys' in props) {
      expandedKeys = props.expandedKeys || [];
    }
    return {
      selectedKeys, expandedKeys,
    };
  },

  componentWillReceiveProps(nextProps) {
    const props = {};
    if ('selectedKeys' in nextProps) {
      props.selectedKeys = nextProps.selectedKeys;
    }
    if ('expandedKeys' in nextProps) {
      props.expandedKeys = nextProps.expandedKeys;
    }
    this.setState(props);
  },

  onDestroy(key) {
    const state = this.state;
    const props = this.props;
    const selectedKeys = state.selectedKeys;
    const expandedKeys = state.expandedKeys;
    let index = selectedKeys.indexOf(key);
    if (!('selectedKeys' in props) && index !== -1) {
      selectedKeys.splice(index, 1);
    }
    index = expandedKeys.indexOf(key);
    if (!('expandedKeys' in props) && index !== -1) {
      expandedKeys.splice(index, 1);
    }
  },

  onItemHover(e) {
    const {key, hover, trigger, item} = e;
    if (!trigger) {
      this.setState({
        activeKey: hover ? key : null,
      });
    } else if (hover || this.props.openSubMenuOnMouseEnter) {
      this.setState({
        activeKey: hover ? key : null,
      });
    }

    if (hover && this.props.openSubMenuOnMouseEnter && !item.isSubMenu) {
      const subMenu = this.lastExpandedSubMenu();
      if (subMenu && key !== subMenu.props.eventKey) {
        this.onExpandedChange({
          key: subMenu.props.eventKey,
          expanded: false,
          item: subMenu,
          trigger: 'mouseleave',
        });
      }
    }
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
        if (!('expandedKeys' in this.props)) {
          this.setState({expandedKeys: []});
        }
        this.props.onExpandedChange({expandedKeys: []});
      }
    }
    props.onClick(e);
  },

  onExpandedChange(e) {
    let expandedKeys = this.state.expandedKeys;
    let changed = true;
    if (e.expanded) {
      changed = expandedKeys.indexOf(e.key) === -1;
      if (changed) {
        // same level only one turn on
        if (!this.isInlineMode()) {
          expandedKeys = expandedKeys.filter((k) => {
            return e.parent.instanceArray.every((c) => {
              return c.props.eventKey !== k;
            });
          });
        }
        expandedKeys = expandedKeys.concat(e.key);
      }
    } else {
      const index = expandedKeys.indexOf(e.key);
      changed = index !== -1;
      if (changed) {
        expandedKeys = expandedKeys.concat();
        expandedKeys.splice(index, 1);
      }
    }
    if (changed) {
      const trigger = e.trigger;
      const mode = this.props.mode;
      if (trigger) {
        if (trigger === 'mouseenter') {
          if (mode === 'inline') {
            changed = false;
          } else if (this.props.openSubMenuOnMouseEnter || e.item.props.level !== 1) {
            changed = true;
          } else if (e.item.props.level === 1) {
            changed = !!this.lastExpandedSubMenu();
          } else {
            changed = true;
          }
        } else if (trigger === 'mouseleave') {
          if (mode === 'inline') {
            changed = false;
          } else if (this.props.openSubMenuOnMouseEnter) {
            changed = true;
          } else {
            changed = false;
          }
        }
      }
      if (!('expandedKeys' in this.props)) {
        if (changed) {
          this.setState({expandedKeys});
        }
      }
      if (changed) {
        this.props.onExpandedChange(assign({expandedKeys}, e));
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
      expandedKeys: state.expandedKeys,
      expanded: state.expandedKeys.indexOf(key) !== -1,
      selectedKeys: state.selectedKeys,
      selected: state.selectedKeys.indexOf(key) !== -1,
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

  lastExpandedSubMenu() {
    let lastOpen = [];
    if (this.state.expandedKeys.length) {
      lastOpen = this.instanceArray.filter((c)=> {
        return this.state.expandedKeys.indexOf(c.props.eventKey) !== -1;
      });
    }
    return lastOpen[0];
  },
});

export default Menu;
