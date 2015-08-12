import React from 'react';
import MenuMixin from './MenuMixin';
import assign from 'object-assign';
import {getKeyFromChildrenIndex} from './util';

const SubPopupMenu = React.createClass({
  propTypes: {
    onSelect: React.PropTypes.func,
    onClick: React.PropTypes.func,
    onDeselect: React.PropTypes.func,
    onExpandedChange: React.PropTypes.func,
    onDestroy: React.PropTypes.func,
    expandedKeys: React.PropTypes.arrayOf(React.PropTypes.string),
    openSubMenuOnMouseEnter: React.PropTypes.bool,
  },

  mixins: [MenuMixin],

  onDeselect(selectInfo) {
    this.props.onDeselect(selectInfo);
  },

  onSelect(selectInfo) {
    this.props.onSelect(selectInfo);
  },

  onClick(e) {
    this.props.onClick(e);
  },

  onExpandedChange(e) {
    this.props.onExpandedChange(e);
  },

  onItemHover({hover, key, item, trigger}) {
    if (!hover && trigger) {
      if (!this.props.openSubMenuOnMouseEnter) {
        return;
      }
    }
    this.setState({
      activeKey: hover ? key : null,
    });

    if (hover && !item.isSubMenu) {
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

  onDestroy(key) {
    this.props.onDestroy(key);
  },

  renderMenuItem(c, i) {
    const key = getKeyFromChildrenIndex(c, i);
    const props = this.props;
    const extraProps = {
      expandedKeys: props.expandedKeys,
      selectedKeys: props.selectedKeys,
      expanded: props.expandedKeys.indexOf(key) !== -1,
      selected: props.selectedKeys.indexOf(key) !== -1,
    };
    return this.renderCommonMenuItem(c, i, extraProps);
  },

  render() {
    const props = assign({}, this.props);
    props.className += ` ${props.prefixCls}-sub`;
    return this.renderRoot(props);
  },

  lastExpandedSubMenu() {
    let lastOpen = [];
    if (this.props.expandedKeys.length) {
      lastOpen = this.instanceArray.filter((c)=> {
        return this.props.expandedKeys.indexOf(c.props.eventKey) !== -1;
      });
    }
    return lastOpen[0];
  },
});

export default SubPopupMenu;
