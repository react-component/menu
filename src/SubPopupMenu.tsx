import * as React from 'react';
import { connect } from 'mini-store';
import KeyCode from 'rc-util/lib/KeyCode';
import createChainedFunction from 'rc-util/lib/createChainedFunction';
import shallowEqual from 'shallowequal';
import classNames from 'classnames';
import {
  getKeyFromChildrenIndex,
  loopMenuItem,
  noop,
  menuAllProps,
  isMobileDevice,
} from './util';
import DOMWrap from './DOMWrap';
import {
  SelectEventHandler,
  OpenEventHandler,
  DestroyEventHandler,
  MiniStore,
  MenuMode,
  LegacyFunctionRef,
  RenderIconType,
  HoverEventHandler,
  BuiltinPlacements,
  MenuClickEventHandler,
  MenuInfo,
  TriggerSubMenuAction,
  MotionType,
} from './interface';
import { MenuItem, MenuItemProps } from './MenuItem';
import { MenuItemGroupProps } from './MenuItemGroup';

function allDisabled(arr: MenuItem[]) {
  if (!arr.length) {
    return true;
  }
  return arr.every(c => !!c.props.disabled);
}

function updateActiveKey(
  store: MiniStore,
  menuId: React.Key,
  activeKey: React.Key,
) {
  const state = store.getState();
  store.setState({
    activeKey: {
      ...state.activeKey,
      [menuId]: activeKey,
    },
  });
}

function getEventKey(props: SubPopupMenuProps): React.Key {
  // when eventKey not available ,it's menu and return menu id '0-menu-'
  return props.eventKey || '0-menu-';
}

export function getActiveKey(
  props: {
    children?: React.ReactNode;
    eventKey?: React.Key;
    defaultActiveFirst?: boolean;
  },
  originalActiveKey: string,
) {
  let activeKey: React.Key = originalActiveKey;
  const { children, eventKey } = props;
  if (activeKey) {
    let found: boolean;
    loopMenuItem(children, (c, i) => {
      if (
        c &&
        c.props &&
        !c.props.disabled &&
        activeKey === getKeyFromChildrenIndex(c, eventKey, i)
      ) {
        found = true;
      }
    });
    if (found) {
      return activeKey;
    }
  }
  activeKey = null;
  if (props.defaultActiveFirst) {
    loopMenuItem(children, (c, i) => {
      if (!activeKey && c && !c.props.disabled) {
        activeKey = getKeyFromChildrenIndex(c, eventKey, i);
      }
    });
    return activeKey;
  }
  return activeKey;
}

export function saveRef(c: React.ReactInstance) {
  if (c) {
    const index = this.instanceArray.indexOf(c);
    if (index !== -1) {
      // update component if it's already inside instanceArray
      this.instanceArray[index] = c;
    } else {
      // add component if it's not in instanceArray yet;
      this.instanceArray.push(c);
    }
  }
}

export interface SubPopupMenuProps {
  onSelect?: SelectEventHandler;
  onClick?: MenuClickEventHandler;
  onDeselect?: SelectEventHandler;
  onOpenChange?: OpenEventHandler;
  onDestroy?: DestroyEventHandler;
  openKeys?: string[];
  visible?: boolean;
  children?: React.ReactNode;
  parentMenu?: React.ReactInstance;
  eventKey?: React.Key;
  store?: MiniStore;

  // adding in refactor
  prefixCls?: string;
  focusable?: boolean;
  multiple?: boolean;
  style?: React.CSSProperties;
  className?: string;
  defaultActiveFirst?: boolean;
  activeKey?: string;
  selectedKeys?: string[];
  defaultSelectedKeys?: string[];
  defaultOpenKeys?: string[];
  level?: number;
  mode?: MenuMode;
  triggerSubMenuAction?: TriggerSubMenuAction;
  inlineIndent?: number;
  manualRef?: LegacyFunctionRef;
  itemIcon?: RenderIconType;
  expandIcon?: RenderIconType;

  subMenuOpenDelay?: number;
  subMenuCloseDelay?: number;
  forceSubMenuRender?: boolean;
  builtinPlacements?: BuiltinPlacements;
  role?: string;
  id?: string;
  overflowedIndicator?: React.ReactNode;
  theme?: string;

  // [Legacy]
  // openTransitionName?: string;
  // openAnimation?: OpenAnimation;
  motion?: MotionType;
}

export class SubPopupMenu extends React.Component<SubPopupMenuProps> {
  static defaultProps = {
    prefixCls: 'rc-menu',
    className: '',
    mode: 'vertical',
    level: 1,
    inlineIndent: 24,
    visible: true,
    focusable: true,
    style: {},
    manualRef: noop,
  };

  constructor(props: SubPopupMenuProps) {
    super(props);

    props.store.setState({
      activeKey: {
        ...props.store.getState().activeKey,
        [props.eventKey]: getActiveKey(props, props.activeKey),
      },
    });

    this.instanceArray = [];
  }

  instanceArray: MenuItem[];

  componentDidMount() {
    // invoke customized ref to expose component to mixin
    if (this.props.manualRef) {
      this.props.manualRef(this);
    }
  }

  shouldComponentUpdate(nextProps: SubPopupMenuProps) {
    return (
      this.props.visible ||
      nextProps.visible ||
      this.props.className !== nextProps.className ||
      !shallowEqual(this.props.style, nextProps.style)
    );
  }

  componentDidUpdate(prevProps: SubPopupMenuProps) {
    const { props } = this;
    const originalActiveKey =
      'activeKey' in props
        ? props.activeKey
        : props.store.getState().activeKey[getEventKey(props)];
    const activeKey = getActiveKey(props, originalActiveKey);
    if (activeKey !== originalActiveKey) {
      updateActiveKey(props.store, getEventKey(props), activeKey);
    } else if ('activeKey' in prevProps) {
      // If prev activeKey is not same as current activeKey,
      // we should set it.
      const prevActiveKey = getActiveKey(prevProps, prevProps.activeKey);
      if (activeKey !== prevActiveKey) {
        updateActiveKey(props.store, getEventKey(props), activeKey);
      }
    }
  }

  /**
   * all keyboard events callbacks run from here at first
   *
   * note:
   *  This legacy code that `onKeyDown` is called by parent instead of dom self.
   *  which need return code to check if this event is handled
   */
  onKeyDown = (
    e: React.KeyboardEvent<HTMLElement>,
    callback: (item: MenuItem) => void,
  ) => {
    const { keyCode } = e;
    let handled: boolean;
    this.getFlatInstanceArray().forEach((obj: MenuItem) => {
      if (obj && obj.props.active && obj.onKeyDown) {
        handled = obj.onKeyDown(e);
      }
    });
    if (handled) {
      return 1;
    }
    let activeItem: MenuItem = null;
    if (keyCode === KeyCode.UP || keyCode === KeyCode.DOWN) {
      activeItem = this.step(keyCode === KeyCode.UP ? -1 : 1);
    }
    if (activeItem) {
      e.preventDefault();
      updateActiveKey(
        this.props.store,
        getEventKey(this.props),
        activeItem.props.eventKey,
      );

      if (typeof callback === 'function') {
        callback(activeItem);
      }

      return 1;
    }
    return undefined;
  };

  onItemHover: HoverEventHandler = e => {
    const { key, hover } = e;
    updateActiveKey(
      this.props.store,
      getEventKey(this.props),
      hover ? key : null,
    );
  };

  onDeselect: SelectEventHandler = selectInfo => {
    this.props.onDeselect(selectInfo);
  };

  onSelect: SelectEventHandler = selectInfo => {
    this.props.onSelect(selectInfo);
  };

  onClick: MenuClickEventHandler = e => {
    this.props.onClick(e);
  };

  onOpenChange: OpenEventHandler = e => {
    this.props.onOpenChange(e);
  };

  onDestroy: DestroyEventHandler = key => {
    /* istanbul ignore next */
    this.props.onDestroy(key);
  };

  getFlatInstanceArray = () => this.instanceArray;

  step = (direction: number) => {
    let children = this.getFlatInstanceArray();
    const activeKey = this.props.store.getState().activeKey[
      getEventKey(this.props)
    ];
    const len = children.length;
    if (!len) {
      return null;
    }
    if (direction < 0) {
      children = children.concat().reverse();
    }
    // find current activeIndex
    let activeIndex = -1;
    children.every((c, ci) => {
      if (c && c.props.eventKey === activeKey) {
        activeIndex = ci;
        return false;
      }
      return true;
    });
    if (
      !this.props.defaultActiveFirst &&
      activeIndex !== -1 &&
      allDisabled(children.slice(activeIndex, len - 1))
    ) {
      return undefined;
    }
    const start = (activeIndex + 1) % len;
    let i = start;

    do {
      const child = children[i];
      if (!child || child.props.disabled) {
        i = (i + 1) % len;
      } else {
        return child;
      }
    } while (i !== start);

    return null;
  };

  renderCommonMenuItem = (
    child: React.ReactElement,
    i: number,
    extraProps: MenuItemProps,
  ) => {
    const state = this.props.store.getState();
    const { props } = this;
    const key = getKeyFromChildrenIndex(child, props.eventKey, i);
    const childProps = child.props;
    // https://github.com/ant-design/ant-design/issues/11517#issuecomment-477403055
    if (!childProps || typeof child.type === 'string') {
      return child;
    }
    const isActive = key === state.activeKey;
    const newChildProps: MenuItemProps &
      MenuItemGroupProps &
      SubPopupMenuProps = {
      mode: childProps.mode || props.mode,
      level: props.level,
      inlineIndent: props.inlineIndent,
      renderMenuItem: this.renderMenuItem,
      rootPrefixCls: props.prefixCls,
      index: i,
      parentMenu: props.parentMenu,
      // customized ref function, need to be invoked manually in child's componentDidMount
      manualRef: childProps.disabled
        ? undefined
        : (createChainedFunction(
            (child as any).ref,
            saveRef.bind(this),
          ) as LegacyFunctionRef),
      eventKey: key,
      active: !childProps.disabled && isActive,
      multiple: props.multiple,
      onClick: (e: MenuInfo) => {
        (childProps.onClick || noop)(e);
        this.onClick(e);
      },
      onItemHover: this.onItemHover,
      motion: props.motion,
      subMenuOpenDelay: props.subMenuOpenDelay,
      subMenuCloseDelay: props.subMenuCloseDelay,
      forceSubMenuRender: props.forceSubMenuRender,
      onOpenChange: this.onOpenChange,
      onDeselect: this.onDeselect,
      onSelect: this.onSelect,
      builtinPlacements: props.builtinPlacements,
      itemIcon: childProps.itemIcon || this.props.itemIcon,
      expandIcon: childProps.expandIcon || this.props.expandIcon,
      ...extraProps,
    };
    // ref: https://github.com/ant-design/ant-design/issues/13943
    if (props.mode === 'inline' || isMobileDevice()) {
      newChildProps.triggerSubMenuAction = 'click';
    }
    return React.cloneElement(child, newChildProps);
  };

  renderMenuItem = (
    c: React.ReactElement,
    i: number,
    subMenuKey: React.Key,
  ) => {
    /* istanbul ignore if */
    if (!c) {
      return null;
    }
    const state = this.props.store.getState();
    const extraProps = {
      openKeys: state.openKeys,
      selectedKeys: state.selectedKeys,
      triggerSubMenuAction: this.props.triggerSubMenuAction,
      subMenuKey,
    };
    return this.renderCommonMenuItem(c, i, extraProps);
  };

  render() {
    const { ...props } = this.props;
    this.instanceArray = [];
    const className = classNames(
      props.prefixCls,
      props.className,
      `${props.prefixCls}-${props.mode}`,
    );
    const domProps: React.HTMLAttributes<HTMLElement> = {
      className,
      // role could be 'select' and by default set to menu
      role: props.role || 'menu',
    };
    if (props.id) {
      domProps.id = props.id;
    }
    if (props.focusable) {
      domProps.tabIndex = 0;
      domProps.onKeyDown = this.onKeyDown as any;
    }
    const {
      prefixCls,
      eventKey,
      visible,
      level,
      mode,
      overflowedIndicator,
      theme,
    } = props;
    menuAllProps.forEach(key => delete props[key]);

    // Otherwise, the propagated click event will trigger another onClick
    delete props.onClick;

    return (
      <DOMWrap
        {...props}
        prefixCls={prefixCls}
        mode={mode}
        tag="ul"
        level={level}
        theme={theme}
        visible={visible}
        overflowedIndicator={overflowedIndicator}
        {...domProps}
      >
        {React.Children.map(props.children, (c: React.ReactElement, i) =>
          this.renderMenuItem(c, i, eventKey || '0-menu-'),
        )}
      </DOMWrap>
    );
  }
}
const connected = connect()(SubPopupMenu) as (React.ComponentClass<
  SubPopupMenuProps
> & {
  getWrappedInstance: () => SubPopupMenu;
});

export default connected;
