import React from 'react';
import MenuMixin from './MenuMixin';
import assign from 'object-assign';
import {getKeyFromChildrenIndex} from './util';
import Animate from 'rc-animate';

const SubPopupMenu = React.createClass({
  propTypes: {
    onSelect: React.PropTypes.func,
    onClick: React.PropTypes.func,
    onDeselect: React.PropTypes.func,
    onOpenChange: React.PropTypes.func,
    onDestroy: React.PropTypes.func,
    openTransitionName: React.PropTypes.string,
    openAnimation: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.object]),
    openKeys: React.PropTypes.arrayOf(React.PropTypes.string),
    closeSubMenuOnMouseLeave: React.PropTypes.bool,
    visible: React.PropTypes.bool,
    children: React.PropTypes.any,
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

  getOpenTransitionName() {
    return this.props.openTransitionName;
  },

  renderMenuItem(c, i, subIndex) {
    const props = this.props;
    const key = getKeyFromChildrenIndex(c, props.eventKey, i);
    const extraProps = {
      openKeys: props.openKeys,
      selectedKeys: props.selectedKeys,
      open: props.openKeys.indexOf(key) !== -1,
      selected: props.selectedKeys.indexOf(key) !== -1,
      openSubMenuOnMouseEnter: true,
    };
    return this.renderCommonMenuItem(c, i, subIndex, extraProps);
  },

  render() {
    const renderFirst = this.renderFirst;
    this.renderFirst = 1;
    this.haveOpened = this.haveOpened || this.props.visible;
    if (!this.haveOpened) {
      return null;
    }
    let transitionAppear = true;
    if (!renderFirst && this.props.visible) {
      transitionAppear = false;
    }
    const props = assign({}, this.props);
    props.className += ` ${props.prefixCls}-sub`;
    const animProps = {};
    if (props.openTransitionName) {
      animProps.transitionName = props.openTransitionName;
    } else if (typeof props.openAnimation === 'object') {
      animProps.animation = assign({}, props.openAnimation);
      if (!transitionAppear) {
        delete animProps.animation.appear;
      }
    }
    return (<Animate {...animProps}
      showProp="visible"
      component=""
      transitionAppear={transitionAppear}>
      {this.renderRoot(props)}
    </Animate>);
  },
});

export default SubPopupMenu;
