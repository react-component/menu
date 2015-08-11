import React from 'react';
import MenuMixin from './MenuMixin';
import assign from 'object-assign';
import {getKeyFromChildrenIndex} from './util';

const Menu = React.createClass({
  propTypes: {
    defaultSelectedKeys: React.PropTypes.arrayOf(React.PropTypes.string),
    onClick: React.PropTypes.func,
  },

  getDefaultProps() {
    return {
      defaultSelectedKeys: [],
    };
  },

  mixins: [MenuMixin],

  getInitialState() {
    const props = this.props;
    let selectedKeys = props.defaultSelectedKeys;
    if ('selectedKeys' in props) {
      selectedKeys = props.selectedKeys;
    }
    return {
      selectedKeys: selectedKeys || [],
    };
  },

  componentWillReceiveProps(nextProps) {
    const props = {};
    if ('selectedKeys' in nextProps) {
      props.selectedKeys = nextProps.selectedKeys;
    }
    this.setState(props);
  },

  onDestroy(key) {
    const state = this.state;
    const props = this.props;
    const selectedKeys = state.selectedKeys;
    const index = selectedKeys.indexOf(key);
    if (!('selectedKeys' in props) && index !== -1) {
      selectedKeys.splice(index, 1);
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
    // no top menu
    if (!props.multiple) {
      this.setState({
        activeKey: null,
      });
    }
    this.props.onClick(e);
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
    const props = this.props;
    const key = getKeyFromChildrenIndex(c, i);
    const state = this.state;
    const extraProps = {
      selectedKeys: state.selectedKeys,
      selected: state.selectedKeys.indexOf(key) !== -1,
    };
    extraProps.openSubMenuOnMouseEnter = props.openSubMenuOnMouseEnter;
    extraProps.closeSubMenuOnDeactive = true;
    extraProps.deactiveSubMenuOnMouseLeave = props.openSubMenuOnMouseEnter;
    if (this.lastOpenKey) {
      extraProps.open = state.activeKey === key;
    }
    return this.renderCommonMenuItem(c, i, extraProps);
  },

  render() {
    const props = assign({}, this.props);
    let lastOpenKey;
    if (!props.openSubMenuOnMouseEnter) {
      const lastOpened = this.instanceArray.filter((c)=> {
        return c.state && c.state.open;
      });
      lastOpenKey = lastOpened[0] && lastOpened[0].props.eventKey;
    }
    this.lastOpenKey = lastOpenKey;
    props.className += ` ${props.prefixCls}-root`;
    return this.renderRoot(props);
  },
});

export default Menu;
