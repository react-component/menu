import React from 'react';
import PropTypes from 'prop-types';
import { Provider, create } from 'mini-store';
import { default as SubPopupMenu, getActiveKey } from './SubPopupMenu';
import { noop } from './util';

class Menu extends React.Component {
  static propTypes = {
    defaultSelectedKeys: PropTypes.arrayOf(PropTypes.string),
    defaultActiveFirst: PropTypes.bool,
    selectedKeys: PropTypes.arrayOf(PropTypes.string),
    defaultOpenKeys: PropTypes.arrayOf(PropTypes.string),
    openKeys: PropTypes.arrayOf(PropTypes.string),
    mode: PropTypes.oneOf(['horizontal', 'vertical', 'vertical-left', 'vertical-right', 'inline']),
    getPopupContainer: PropTypes.func,
    onClick: PropTypes.func,
    onSelect: PropTypes.func,
    onDeselect: PropTypes.func,
    onDestroy: PropTypes.func,
    openTransitionName: PropTypes.string,
    openAnimation: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    subMenuOpenDelay: PropTypes.number,
    subMenuCloseDelay: PropTypes.number,
    forceSubMenuRender: PropTypes.bool,
    triggerSubMenuAction: PropTypes.string,
    level: PropTypes.number,
    selectable: PropTypes.bool,
    multiple: PropTypes.bool,
    children: PropTypes.any,
    className: PropTypes.string,
    style: PropTypes.object,
    activeKey: PropTypes.string,
    prefixCls: PropTypes.string,
    builtinPlacements: PropTypes.object,
    itemIcon: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
    expandIcon: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
    overflowedIndicator: PropTypes.node,
  };

  static defaultProps = {
    selectable: true,
    onClick: noop,
    onSelect: noop,
    onOpenChange: noop,
    onDeselect: noop,
    defaultSelectedKeys: [],
    defaultOpenKeys: [],
    subMenuOpenDelay: 0.1,
    subMenuCloseDelay: 0.1,
    triggerSubMenuAction: 'hover',
    prefixCls: 'rc-menu',
    className: '',
    mode: 'vertical',
    style: {},
    builtinPlacements: {},
    overflowedIndicator: <span>···</span>,
  };

  constructor(props) {
    super(props);

    this.isRootMenu = true;

    let selectedKeys = props.defaultSelectedKeys;
    let openKeys = props.defaultOpenKeys;
    if ('selectedKeys' in props) {
      selectedKeys = props.selectedKeys || [];
    }
    if ('openKeys' in props) {
      openKeys = props.openKeys || [];
    }

    this.store = create({
      selectedKeys,
      openKeys,
      activeKey: { '0-menu-': getActiveKey(props, props.activeKey) },
    });
  }

  componentDidMount() {
    this.updateMiniStore();
  }

  componentDidUpdate() {
    this.updateMiniStore();
  }

  onSelect = (selectInfo) => {
    const props = this.props;
    if (props.selectable) {
      // root menu
      let selectedKeys = this.store.getState().selectedKeys;
      const selectedKey = selectInfo.key;
      if (props.multiple) {
        selectedKeys = selectedKeys.concat([selectedKey]);
      } else {
        selectedKeys = [selectedKey];
      }
      if (!('selectedKeys' in props)) {
        this.store.setState({
          selectedKeys,
        });
      }
      props.onSelect({
        ...selectInfo,
        selectedKeys,
      });
    }
  }

  onClick = (e) => {
    this.props.onClick(e);
  }

  // onKeyDown needs to be exposed as a instance method
  // e.g., in rc-select, we need to navigate menu item while
  // current active item is rc-select input box rather than the menu itself
  onKeyDown = (e, callback) => {
    this.innerMenu.getWrappedInstance().onKeyDown(e, callback);
  }

  onOpenChange = (event) => {
    const props = this.props;
    const openKeys = this.store.getState().openKeys.concat();
    let changed = false;
    const processSingle = (e) => {
      let oneChanged = false;
      if (e.open) {
        oneChanged = openKeys.indexOf(e.key) === -1;
        if (oneChanged) {
          openKeys.push(e.key);
        }
      } else {
        const index = openKeys.indexOf(e.key);
        oneChanged = index !== -1;
        if (oneChanged) {
          openKeys.splice(index, 1);
        }
      }
      changed = changed || oneChanged;
    };
    if (Array.isArray(event)) {
      // batch change call
      event.forEach(processSingle);
    } else {
      processSingle(event);
    }
    if (changed) {
      if (!('openKeys' in this.props)) {
        this.store.setState({ openKeys });
      }
      props.onOpenChange(openKeys);
    }
  }

  onDeselect = (selectInfo) => {
    const props = this.props;
    if (props.selectable) {
      const selectedKeys = this.store.getState().selectedKeys.concat();
      const selectedKey = selectInfo.key;
      const index = selectedKeys.indexOf(selectedKey);
      if (index !== -1) {
        selectedKeys.splice(index, 1);
      }
      if (!('selectedKeys' in props)) {
        this.store.setState({
          selectedKeys,
        });
      }
      props.onDeselect({
        ...selectInfo,
        selectedKeys,
      });
    }
  }

  getOpenTransitionName = () => {
    const props = this.props;
    let transitionName = props.openTransitionName;
    const animationName = props.openAnimation;
    if (!transitionName && typeof animationName === 'string') {
      transitionName = `${props.prefixCls}-open-${animationName}`;
    }
    return transitionName;
  }

  updateMiniStore() {
    if ('selectedKeys' in this.props) {
      this.store.setState({
        selectedKeys: this.props.selectedKeys || [],
      });
    }
    if ('openKeys' in this.props) {
      this.store.setState({
        openKeys: this.props.openKeys || [],
      });
    }
  }

  render() {
    let { ...props } = this.props;
    props.className += ` ${props.prefixCls}-root`;
    props = {
      ...props,
      onClick: this.onClick,
      onOpenChange: this.onOpenChange,
      onDeselect: this.onDeselect,
      onSelect: this.onSelect,
      openTransitionName: this.getOpenTransitionName(),
      parentMenu: this,
    };
    return (
      <Provider store={this.store}>
        <SubPopupMenu {...props} ref={c => this.innerMenu = c}>{this.props.children}</SubPopupMenu>
      </Provider>
    );
  }
}

export default Menu;
