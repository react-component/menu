import * as React from 'react';
import { Provider, create } from 'mini-store';
import omit from 'omit.js';
import { CSSMotionProps } from 'rc-motion';
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
} from './interface';
import { getMotion } from './utils/legacyUtil';

export interface MenuProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick' | 'onSelect'> {
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
  activeKey?: string;
  prefixCls?: string;
  builtinPlacements?: BuiltinPlacements;
  itemIcon?: RenderIconType;
  expandIcon?: RenderIconType;
  overflowedIndicator?: React.ReactNode;
  /** Menu motion define */
  motion?: CSSMotionProps;

  /** Default menu motion of each mode */
  defaultMotions?: Partial<{ [key in MenuMode | 'other']: CSSMotionProps }>;

  /** @deprecated Please use `motion` instead */
  openTransitionName?: string;
  /** @deprecated Please use `motion` instead */
  openAnimation?: OpenAnimation;

  /** direction of menu */
  direction?: 'ltr' | 'rtl';

  inlineCollapsed?: boolean;

  /** SiderContextProps of layout in ant design */
  siderCollapsed?: boolean;
  collapsedWidth?: string | number;
}

export interface MenuState {
  switchingModeFromInline: boolean;
}

class Menu extends React.Component<MenuProps, MenuState> {
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

    this.state = {
      switchingModeFromInline: false,
    };
  }

  isRootMenu: boolean;

  store: MiniStore;

  innerMenu: typeof SubPopupMenu;

  inlineOpenKeys: string[] = [];

  prevOpenKeys: string[];

  componentDidMount() {
    this.updateMiniStore();
    this.updateMenuDisplay();
  }

  componentDidUpdate(prevProps: MenuProps) {
    this.updateOpentKeysWhenSwitchMode(prevProps);
    this.updateMiniStore();
    const { siderCollapsed, inlineCollapsed, onOpenChange } = this.props;
    if (
      (!prevProps.inlineCollapsed && inlineCollapsed) ||
      (!prevProps.siderCollapsed && siderCollapsed)
    ) {
      onOpenChange([]);
    }
    this.updateMenuDisplay();
  }

  updateOpentKeysWhenSwitchMode(prevProps: MenuProps) {
    const { props: nextProps, store, inlineOpenKeys } = this;
    const prevState = store.getState();
    const newState: any = {};
    if (prevProps.mode === 'inline' && nextProps.mode !== 'inline') {
      this.setState({
        switchingModeFromInline: true,
      });
    }

    if (!('openKeys' in nextProps)) {
      // [Legacy] Old code will return after `openKeys` changed.
      // Not sure the reason, we should keep this logic still.
      if (
        (nextProps.inlineCollapsed && !prevProps.inlineCollapsed) ||
        (nextProps.siderCollapsed && !prevProps.siderCollapsed)
      ) {
        this.setState({
          switchingModeFromInline: true,
        });
        this.inlineOpenKeys = prevState.openKeys.concat();
        newState.openKeys = [];
      }

      if (
        (!nextProps.inlineCollapsed && prevProps.inlineCollapsed) ||
        (!nextProps.siderCollapsed && prevProps.siderCollapsed)
      ) {
        newState.openKeys = inlineOpenKeys;
        this.inlineOpenKeys = [];
      }
    }

    if (Object.keys(newState).length) {
      store.setState(newState);
    }
  }

  updateMenuDisplay() {
    const {
      props: { collapsedWidth },
      store,
      prevOpenKeys,
    } = this;
    // https://github.com/ant-design/ant-design/issues/8587
    const hideMenu =
      this.getInlineCollapsed() &&
      (collapsedWidth === 0 ||
        collapsedWidth === '0' ||
        collapsedWidth === '0px');
    if (hideMenu) {
      this.prevOpenKeys = store.getState().openKeys.concat();
      this.store.setState({
        openKeys: [],
      });
    } else if (prevOpenKeys) {
      this.store.setState({
        openKeys: prevOpenKeys,
      });
      this.prevOpenKeys = null;
    }
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
    const mode = this.getRealMenuMode();
    const {
      store,
      props: { onOpenChange },
    } = this;

    if (mode !== 'inline' && !('openKeys' in this.props)) {
      // closing vertical popup submenu after click it
      store.setState({
        openKeys: [],
      });
      onOpenChange([]);
    }
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

  getRealMenuMode() {
    const { mode } = this.props;
    const { switchingModeFromInline } = this.state;
    const inlineCollapsed = this.getInlineCollapsed();
    if (switchingModeFromInline && inlineCollapsed) {
      return 'inline';
    }
    return inlineCollapsed ? 'vertical' : mode;
  }

  getInlineCollapsed() {
    const { inlineCollapsed, siderCollapsed } = this.props;
    if (siderCollapsed !== undefined) {
      return siderCollapsed;
    }
    return inlineCollapsed;
  }

  // Restore vertical mode when menu is collapsed responsively when mounted
  // https://github.com/ant-design/ant-design/issues/13104
  // TODO: not a perfect solution,
  // looking a new way to avoid setting switchingModeFromInline in this situation
  onMouseEnter = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    this.restoreModeVerticalFromInline();
    const { onMouseEnter } = this.props;
    if (onMouseEnter) {
      onMouseEnter(e);
    }
  };

  onTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    // when inlineCollapsed menu width animation finished
    // https://github.com/ant-design/ant-design/issues/12864
    const widthCollapsed =
      e.propertyName === 'width' && e.target === e.currentTarget;

    // Fix SVGElement e.target.className.indexOf is not a function
    // https://github.com/ant-design/ant-design/issues/15699
    const { className } = e.target as HTMLElement | SVGElement;
    // SVGAnimatedString.animVal should be identical to SVGAnimatedString.baseVal,
    // unless during an animation.
    const classNameValue =
      Object.prototype.toString.call(className) === '[object SVGAnimatedString]'
        ? className.animVal
        : className;

    // Fix for <Menu style={{ width: '100%' }} />,
    // the width transition won't trigger when menu is collapsed
    // https://github.com/ant-design/ant-design-pro/issues/2783
    const iconScaled =
      e.propertyName === 'font-size' && classNameValue.indexOf('anticon') >= 0;
    if (widthCollapsed || iconScaled) {
      this.restoreModeVerticalFromInline();
    }
  };

  restoreModeVerticalFromInline() {
    const { switchingModeFromInline } = this.state;
    if (switchingModeFromInline) {
      this.setState({
        switchingModeFromInline: false,
      });
    }
  }

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
    let props: MenuProps & { parentMenu?: Menu } = {
      ...omit(this.props, [
        'collapsedWidth',
        'siderCollapsed',
        'defaultMotions',
      ]),
    };
    const mode = this.getRealMenuMode();
    props.className += ` ${props.prefixCls}-root`;
    if (props.direction === 'rtl') {
      props.className += ` ${props.prefixCls}-rtl`;
    }
    props = {
      ...props,
      mode,
      onClick: this.onClick,
      onOpenChange: this.onOpenChange,
      onDeselect: this.onDeselect,
      onSelect: this.onSelect,
      onMouseEnter: this.onMouseEnter,
      onTransitionEnd: this.onTransitionEnd,
      parentMenu: this,
      motion: getMotion(this.props, this.state, mode),
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
