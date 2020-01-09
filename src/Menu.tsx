import * as React from 'react';
import { Provider, create } from 'mini-store';
import SubPopupMenu, { getActiveKey } from './SubPopupMenu';
import { noop } from './util';
import {
  RenderIconType,
  SelectInfo,
  SelectEventHandler,
  DestroyEventHandler,
  MenuMode,
  OpenEventHandler,
  OpenAnimation,
  MiniStore,
  BuiltinPlacements,
  TriggerSubMenuAction,
  MenuClickEventHandler,
  MotionType,
} from './interface';
import { getMotion } from './utils/legacyUtil';

export interface MenuProps {
  defaultSelectedKeys?: string[];
  defaultActiveFirst?: boolean;
  selectedKeys?: string[];
  defaultOpenKeys?: string[];
  openKeys?: string[];
  mode?: MenuMode;
  getPopupContainer?: (node: HTMLElement) => HTMLElement;
  onClick?: MenuClickEventHandler;
  onSelect?: SelectEventHandler;
  onOpenChange?: OpenEventHandler;
  onDeselect?: SelectEventHandler;
  onDestroy?: DestroyEventHandler;
  subMenuOpenDelay?: number;
  subMenuCloseDelay?: number;
  forceSubMenuRender?: boolean;
  triggerSubMenuAction?: TriggerSubMenuAction;
  level?: number;
  selectable?: boolean;
  multiple?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  activeKey?: string;
  prefixCls?: string;
  builtinPlacements?: BuiltinPlacements;
  itemIcon?: RenderIconType;
  expandIcon?: RenderIconType;
  overflowedIndicator?: React.ReactNode;
  role?: string;

  /** Menu motion define */
  motion?: MotionType;

  /** @deprecated Please use `motion` instead */
  openTransitionName?: string;
  /** @deprecated Please use `motion` instead */
  openAnimation?: OpenAnimation;
}

class Menu extends React.Component<MenuProps> {
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

  constructor(props: MenuProps) {
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

  isRootMenu: boolean;

  store: MiniStore;

  innerMenu: typeof SubPopupMenu;

  componentDidMount() {
    this.updateMiniStore();
  }

  componentDidUpdate() {
    this.updateMiniStore();
  }

  onSelect = (selectInfo: SelectInfo) => {
    const { props } = this;
    if (props.selectable) {
      // root menu
      let { selectedKeys } = this.store.getState();
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
  };

  onClick: MenuClickEventHandler = e => {
    this.props.onClick(e);
  };

  // onKeyDown needs to be exposed as a instance method
  // e.g., in rc-select, we need to navigate menu item while
  // current active item is rc-select input box rather than the menu itself
  onKeyDown = (e: React.KeyboardEvent<HTMLElement>, callback) => {
    this.innerMenu.getWrappedInstance().onKeyDown(e, callback);
  };

  onOpenChange = event => {
    const { props } = this;
    const openKeys = this.store.getState().openKeys.concat();
    let changed = false;
    const processSingle = e => {
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
  };

  onDeselect = (selectInfo: SelectInfo) => {
    const { props } = this;
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
  };

  getOpenTransitionName = () => {
    const { props } = this;
    let transitionName = props.openTransitionName;
    const animationName = props.openAnimation;
    if (!transitionName && typeof animationName === 'string') {
      transitionName = `${props.prefixCls}-open-${animationName}`;
    }
    return transitionName;
  };

  setInnerMenu = node => {
    this.innerMenu = node;
  };

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
    let props: MenuProps & { parentMenu?: Menu } = { ...this.props };
    props.className += ` ${props.prefixCls}-root`;
    props = {
      ...props,
      onClick: this.onClick,
      onOpenChange: this.onOpenChange,
      onDeselect: this.onDeselect,
      onSelect: this.onSelect,
      parentMenu: this,
      motion: getMotion(this.props),
    };

    delete props.openAnimation;
    delete props.openTransitionName;

    return (
      <Provider store={this.store}>
        <SubPopupMenu {...props} ref={this.setInnerMenu}>
          {this.props.children}
        </SubPopupMenu>
      </Provider>
    );
  }
}

export default Menu;
