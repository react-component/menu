import React from 'react';
import MenuMixin from './MenuMixin';
import assign from 'object-assign';
import {getKeyFromChildrenIndex} from './util';

const SubPopupMenu = React.createClass({
  propTypes: {
    onSelect: React.PropTypes.func,
    onClick: React.PropTypes.func,
    onDeselect: React.PropTypes.func,
    onDestroy: React.PropTypes.func,
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

  onDestroy(key) {
    this.props.onDestroy(key);
  },

  renderMenuItem(c, i) {
    const key = getKeyFromChildrenIndex(c, i);
    const props = this.props;
    const extraProps = {
      selectedKeys: props.selectedKeys,
      selected: props.selectedKeys.indexOf(key) !== -1,
    };
    extraProps.openSubMenuOnMouseEnter = true;
    extraProps.closeSubMenuOnDeactive = true;
    extraProps.deactiveSubMenuOnMouseLeave = props.deactiveSubMenuOnMouseLeave;
    return this.renderCommonMenuItem(c, i, extraProps);
  },

  render() {
    const props = assign({}, this.props);
    props.className += ` ${props.prefixCls}-sub`;
    return this.renderRoot(props);
  },
});

export default SubPopupMenu;
