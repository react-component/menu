import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import Animate from 'rc-animate';
import { connect } from 'mini-store';
import { default as MenuMixin, getActiveKey } from './MenuMixin';

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
    visible: PropTypes.bool,
    children: PropTypes.any,
  },

  mixins: [MenuMixin],

  getInitialState() {
    const props = this.props;
    props.store.setState({
      activeKey: {
        ...props.store.getState().activeKey,
        [props.eventKey]: getActiveKey(props, props.activeKey),
      },
    });

    return {};
  },

  componentDidMount() {
    // invoke customized ref to expose component to mixin
    if (this.props.manualRef) {
      this.props.manualRef(this);
    }
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

  getOpenTransitionName() {
    return this.props.openTransitionName;
  },

  renderMenuItem(c, i, subIndex, subMenuKey) {
    if (!c) {
      return null;
    }
    const props = this.props;
    const extraProps = {
      openKeys: props.openKeys,
      selectedKeys: props.selectedKeys,
      triggerSubMenuAction: props.triggerSubMenuAction,
      subMenuKey,
    };
    return this.renderCommonMenuItem(c, i, subIndex, extraProps);
  },

  render() {
    const props = { ...this.props };

    const haveRendered = this.haveRendered;
    this.haveRendered = true;

    this.haveOpened = this.haveOpened || props.visible || props.forceSubMenuRender;
    if (!this.haveOpened) {
      return null;
    }

    const transitionAppear = !(!haveRendered && props.visible && props.mode === 'inline');

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

    return (
      <Animate
        {...animProps}
        showProp="visible"
        component=""
        transitionAppear={transitionAppear}
      >
        {this.renderRoot(props)}
      </Animate>
    );
  },
});

export default connect()(SubPopupMenu);
