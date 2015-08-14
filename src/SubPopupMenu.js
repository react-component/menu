import React from 'react';
import MenuMixin from './MenuMixin';
import assign from 'object-assign';
import {getKeyFromChildrenIndex} from './util';

const SubPopupMenu = React.createClass({
  propTypes: {
    onSelect: React.PropTypes.func,
    onClick: React.PropTypes.func,
    onDeselect: React.PropTypes.func,
    onOpenChange: React.PropTypes.func,
    onDestroy: React.PropTypes.func,
    openKeys: React.PropTypes.arrayOf(React.PropTypes.string),
    closeSubMenuOnMouseLeave: React.PropTypes.bool,
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

  onOpenChange(e) {
    this.props.onOpenChange(e);
  },

  onDestroy(key) {
    this.props.onDestroy(key);
  },

  onItemHover(e) {
    this.onCommonItemHover(e);
  },

  renderMenuItem(c, i) {
    const key = getKeyFromChildrenIndex(c, i);
    const props = this.props;
    const extraProps = {
      openKeys: props.openKeys,
      selectedKeys: props.selectedKeys,
      open: props.openKeys.indexOf(key) !== -1,
      selected: props.selectedKeys.indexOf(key) !== -1,
      openSubMenuOnMouseEnter: true,
    };
    return this.renderCommonMenuItem(c, i, extraProps);
  },

  render() {
    const props = assign({}, this.props);
    props.className += ` ${props.prefixCls}-sub`;
    return this.renderRoot(props);
  },
});

export default SubPopupMenu;
