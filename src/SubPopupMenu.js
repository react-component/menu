import React, { PropTypes } from 'react';
import MenuMixin from './MenuMixin';
import Animate from 'rc-animate';

const SubPopupMenu = React.createClass({
  propTypes: {
    onSelect: PropTypes.func,
    onClick: PropTypes.func,
    onDeselect: PropTypes.func,
    onOpenChange: PropTypes.func,
    onDestroy: PropTypes.func,
    openTransitionName: PropTypes.string,
    openAnimation: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    openKeys: PropTypes.arrayOf(PropTypes.string),
    closeSubMenuOnMouseLeave: PropTypes.bool,
    visible: PropTypes.bool,
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

  /**
   * renderMenuItem
   * index,
   * ref,
   * eventKey
   * active => activeKey
   */
  getChildContext() {
    return {
      parentMenu: this,
      openKeys: this.props.openKeys,
      activeKey: this.props.activeKey,
      selectedKeys: this.props.selectedKeys,
      mode: this.props.mode,
      level: this.props.level,
      multiple: this.props.multiple,
      inlineIndent: this.props.inlineIndent,
      rootPrefixCls: this.props.prefixCls,
      openAnimation: this.props.openAnimation,
      openSubMenuOnMouseEnter: this.props.mode !== 'inline',
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

  componentWillUpdate() {
    this.refIndex = null;
    this.instanceArray = [];
  },

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
    let { openChanges = [] } = e;
    openChanges = openChanges.concat(this.getOpenChangesOnItemHover(e));
    if (openChanges.length) {
      this.onOpenChange(openChanges);
    }
  },

  getOpenTransitionName() {
    return this.props.openTransitionName;
  },

  renderMenuItem(c, i, subIndex) {
    if (!c) {
      return null;
    }
    const props = this.props;
    const extraProps = {
      openKeys: props.openKeys,
      selectedKeys: props.selectedKeys,
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
    const props = { ...this.props };
    props.className += ` ${props.prefixCls}-sub`;
    const animProps = {};
    if (props.openTransitionName) {
      animProps.transitionName = props.openTransitionName;
    } else if (typeof props.openAnimation === 'object') {
      animProps.animation = { ...props.openAnimation };
      if (!transitionAppear) {
        delete animProps.animation.appear;
      }
    }
    return (<Animate
      {...animProps}
      showProp="visible"
      component=""
      transitionAppear={transitionAppear}
    >
      {this.renderRoot(props)}
    </Animate>);
  },
});

export default SubPopupMenu;
