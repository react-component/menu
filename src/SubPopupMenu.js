import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import Animate from 'rc-animate';
import MenuMixin from './MenuMixin';

const SubPopupMenu = createReactClass({
  displayName: 'SubPopupMenu',

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
    this.haveOpened = this.haveOpened || this.props.visible;
    if (!this.haveOpened) {
      return null;
    }

    const props = { ...this.props };
    props.className += ` ${props.prefixCls}-sub`;
    const animProps = {};
    if (props.openTransitionName) {
      animProps.transitionName = props.openTransitionName;
    } else if (typeof props.openAnimation === 'object') {
      animProps.animation = { ...props.openAnimation };
    }
    return (
      <Animate
        {...animProps}
        showProp="visible"
        component=""
        transitionAppear
      >
        {this.renderRoot(props)}
      </Animate>
    );
  },
});

export default SubPopupMenu;
