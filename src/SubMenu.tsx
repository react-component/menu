import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Trigger from 'rc-trigger';
import raf from 'rc-util/lib/raf';
import KeyCode from 'rc-util/lib/KeyCode';
import type { CSSMotionProps } from 'rc-motion';
import CSSMotion from 'rc-motion';
import classNames from 'classnames';
import { connect } from 'mini-store';
import type { SubPopupMenuProps } from './SubPopupMenu';
import SubPopupMenu from './SubPopupMenu';
import { placements, placementsRtl } from './placements';
import {
  noop,
  loopMenuItemRecursively,
  getMenuIdFromSubMenuEventKey,
  menuAllProps,
} from './util';
import type {
  MiniStore,
  RenderIconType,
  LegacyFunctionRef,
  MenuMode,
  OpenEventHandler,
  SelectEventHandler,
  DestroyEventHandler,
  MenuHoverEventHandler,
  MenuClickEventHandler,
  MenuInfo,
  BuiltinPlacements,
  TriggerSubMenuAction,
  HoverEventHandler,
} from './interface';
import type { MenuItem } from './MenuItem';

let guid = 0;

const popupPlacementMap = {
  horizontal: 'bottomLeft',
  vertical: 'rightTop',
  'vertical-left': 'rightTop',
  'vertical-right': 'leftTop',
};

const updateDefaultActiveFirst = (
  store: MiniStore,
  eventKey: string,
  defaultActiveFirst: boolean,
) => {
  const menuId = getMenuIdFromSubMenuEventKey(eventKey);
  const state = store.getState();
  store.setState({
    defaultActiveFirst: {
      ...state.defaultActiveFirst,
      [menuId]: defaultActiveFirst,
    },
  });
};

export interface SubMenuProps {
  parentMenu?: React.ReactElement & {
    isRootMenu: boolean;
    subMenuInstance: React.ReactInstance;
  };
  title?: React.ReactNode;
  children?: React.ReactNode;
  selectedKeys?: string[];
  openKeys?: string[];
  onClick?: MenuClickEventHandler;
  onOpenChange?: OpenEventHandler;
  rootPrefixCls?: string;
  eventKey?: string;
  multiple?: boolean;
  active?: boolean; // TODO: remove
  onItemHover?: HoverEventHandler;
  onSelect?: SelectEventHandler;
  triggerSubMenuAction?: TriggerSubMenuAction;
  onDeselect?: SelectEventHandler;
  onDestroy?: DestroyEventHandler;
  onMouseEnter?: MenuHoverEventHandler;
  onMouseLeave?: MenuHoverEventHandler;
  onTitleMouseEnter?: MenuHoverEventHandler;
  onTitleMouseLeave?: MenuHoverEventHandler;
  onTitleClick?: (info: {
    key: React.Key;
    domEvent: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>;
  }) => void;
  popupOffset?: number[];
  isOpen?: boolean;
  store?: MiniStore;
  mode?: MenuMode;
  manualRef?: LegacyFunctionRef;
  itemIcon?: RenderIconType;
  expandIcon?: RenderIconType;
  inlineIndent?: number;
  level?: number;
  subMenuOpenDelay?: number;
  subMenuCloseDelay?: number;
  forceSubMenuRender?: boolean;
  builtinPlacements?: BuiltinPlacements;
  disabled?: boolean;
  className?: string;
  popupClassName?: string;

  motion?: CSSMotionProps;
  direction?: 'ltr' | 'rtl';
}

interface SubMenuState {
  mode: MenuMode;
  isOpen: boolean;
}

export class SubMenu extends React.Component<SubMenuProps, SubMenuState> {
  static defaultProps = {
    onMouseEnter: noop,
    onMouseLeave: noop,
    onTitleMouseEnter: noop,
    onTitleMouseLeave: noop,
    onTitleClick: noop,
    manualRef: noop,
    mode: 'vertical',
    title: '',
  };

  constructor(props: SubMenuProps) {
    super(props);
    const { store, eventKey } = props;
    const { defaultActiveFirst } = store.getState();

    this.isRootMenu = false;

    let value = false;

    if (defaultActiveFirst) {
      value = defaultActiveFirst[eventKey];
    }

    updateDefaultActiveFirst(store, eventKey, value);

    this.state = {
      mode: props.mode,
      isOpen: props.isOpen,
    };
  }

  isRootMenu: boolean;

  menuInstance: MenuItem;

  subMenuTitle: HTMLElement;

  internalMenuId: string;

  haveRendered: boolean;

  haveOpened: boolean;

  updateStateRaf: number;

  /**
   * Follow timeout should be `number`.
   * Current is only convert code into TS,
   * we not use `window.setTimeout` instead of `setTimeout`.
   */
  minWidthTimeout: any;

  mouseenterTimeout: any;

  componentDidMount() {
    this.componentDidUpdate();
  }

  componentDidUpdate() {
    const { mode, parentMenu, manualRef, isOpen } = this.props;

    const updateState = () => {
      this.setState({
        mode,
        isOpen,
      });
    };

    // Delay sync when mode changed in case openKeys change not sync
    const isOpenChanged = isOpen !== this.state.isOpen;
    const isModeChanged = mode !== this.state.mode;
    if (isModeChanged || isOpenChanged) {
      raf.cancel(this.updateStateRaf);

      if (isModeChanged) {
        this.updateStateRaf = raf(updateState);
      } else {
        updateState();
      }
    }

    // invoke customized ref to expose component to mixin
    if (manualRef) {
      manualRef(this);
    }

    if (mode !== 'horizontal' || !parentMenu?.isRootMenu || !isOpen) {
      return;
    }

    this.minWidthTimeout = setTimeout(() => this.adjustWidth(), 0);
  }

  componentWillUnmount() {
    const { onDestroy, eventKey } = this.props;
    if (onDestroy) {
      onDestroy(eventKey);
    }

    /* istanbul ignore if */
    if (this.minWidthTimeout) {
      clearTimeout(this.minWidthTimeout);
    }

    /* istanbul ignore if */
    if (this.mouseenterTimeout) {
      clearTimeout(this.mouseenterTimeout);
    }

    raf.cancel(this.updateStateRaf);
  }

  onDestroy = (key: string) => {
    this.props.onDestroy(key);
  };

  /**
   * note:
   *  This legacy code that `onKeyDown` is called by parent instead of dom self.
   *  which need return code to check if this event is handled
   */
  onKeyDown: React.KeyboardEventHandler<HTMLElement> = (e) => {
    const { keyCode } = e;
    const menu = this.menuInstance;
    const { store } = this.props;
    const visible = this.getVisible();

    if (keyCode === KeyCode.ENTER) {
      this.onTitleClick(e);
      updateDefaultActiveFirst(store, this.props.eventKey, true);
      return true;
    }

    if (keyCode === KeyCode.RIGHT) {
      if (visible) {
        menu.onKeyDown(e);
      } else {
        this.triggerOpenChange(true);
        // need to update current menu's defaultActiveFirst value
        updateDefaultActiveFirst(store, this.props.eventKey, true);
      }
      return true;
    }
    if (keyCode === KeyCode.LEFT) {
      let handled: boolean;
      if (visible) {
        handled = menu.onKeyDown(e);
      } else {
        return undefined;
      }
      if (!handled) {
        this.triggerOpenChange(false);
        handled = true;
      }
      return handled;
    }

    if (visible && (keyCode === KeyCode.UP || keyCode === KeyCode.DOWN)) {
      return menu.onKeyDown(e);
    }

    return undefined;
  };

  onOpenChange: OpenEventHandler = (e) => {
    this.props.onOpenChange(e);
  };

  onPopupVisibleChange = (visible: boolean) => {
    this.triggerOpenChange(visible, visible ? 'mouseenter' : 'mouseleave');
  };

  onMouseEnter: React.MouseEventHandler<HTMLElement> = (e) => {
    const { eventKey: key, onMouseEnter, store } = this.props;
    updateDefaultActiveFirst(store, this.props.eventKey, false);
    onMouseEnter({
      key,
      domEvent: e,
    });
  };

  onMouseLeave: React.MouseEventHandler<HTMLElement> = (e) => {
    const { parentMenu, eventKey, onMouseLeave } = this.props;
    parentMenu.subMenuInstance = this;
    onMouseLeave({
      key: eventKey,
      domEvent: e,
    });
  };

  onTitleMouseEnter: React.MouseEventHandler<HTMLElement> = (domEvent) => {
    const { eventKey: key, onItemHover, onTitleMouseEnter } = this.props;
    onItemHover({
      key,
      hover: true,
    });
    onTitleMouseEnter({
      key,
      domEvent,
    });
  };

  onTitleMouseLeave: React.MouseEventHandler<HTMLElement> = (e) => {
    const { parentMenu, eventKey, onItemHover, onTitleMouseLeave } = this.props;
    parentMenu.subMenuInstance = this;
    onItemHover({
      key: eventKey,
      hover: false,
    });
    onTitleMouseLeave({
      key: eventKey,
      domEvent: e,
    });
  };

  onTitleClick = (
    e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
  ) => {
    const { props } = this;
    props.onTitleClick({
      key: props.eventKey,
      domEvent: e,
    });
    if (props.triggerSubMenuAction === 'hover') {
      return;
    }
    this.triggerOpenChange(!this.getVisible(), 'click');
    updateDefaultActiveFirst(props.store, this.props.eventKey, false);
  };

  onSubMenuClick = (info: MenuInfo) => {
    // in the case of overflowed submenu
    // onClick is not copied over
    if (typeof this.props.onClick === 'function') {
      this.props.onClick(this.addKeyPath(info));
    }
  };

  onSelect: SelectEventHandler = (info) => {
    this.props.onSelect(info);
  };

  onDeselect: SelectEventHandler = (info) => {
    this.props.onDeselect(info);
  };

  getPrefixCls = () => `${this.props.rootPrefixCls}-submenu`;

  getActiveClassName = () => `${this.getPrefixCls()}-active`;

  getDisabledClassName = () => `${this.getPrefixCls()}-disabled`;

  getSelectedClassName = () => `${this.getPrefixCls()}-selected`;

  getOpenClassName = () => `${this.props.rootPrefixCls}-submenu-open`;

  getVisible = () => this.state.isOpen;

  getMode = () => this.state.mode;

  saveMenuInstance = (c: MenuItem) => {
    // children menu instance
    this.menuInstance = c;
  };

  addKeyPath = (info: MenuInfo) => ({
    ...info,
    keyPath: (info.keyPath || []).concat(this.props.eventKey),
  });

  triggerOpenChange = (open: boolean, type?: string) => {
    const key = this.props.eventKey;
    const openChange = () => {
      this.onOpenChange({
        key,
        item: this,
        trigger: type,
        open,
      });
    };
    if (type === 'mouseenter') {
      // make sure mouseenter happen after other menu item's mouseleave
      this.mouseenterTimeout = setTimeout(() => {
        openChange();
      }, 0);
    } else {
      openChange();
    }
  };

  isChildrenSelected = () => {
    const ret = { find: false };
    loopMenuItemRecursively(this.props.children, this.props.selectedKeys, ret);
    return ret.find;
  };

  isInlineMode = () => this.getMode() === 'inline';

  adjustWidth = () => {
    /* istanbul ignore if */
    if (!this.subMenuTitle || !this.menuInstance) {
      return;
    }
    const popupMenu = ReactDOM.findDOMNode(this.menuInstance) as HTMLElement;
    if (popupMenu.offsetWidth >= this.subMenuTitle.offsetWidth) {
      return;
    }

    /* istanbul ignore next */
    popupMenu.style.minWidth = `${this.subMenuTitle.offsetWidth}px`;
  };

  saveSubMenuTitle = (subMenuTitle: HTMLElement) => {
    this.subMenuTitle = subMenuTitle;
  };

  getBaseProps = (): SubPopupMenuProps => {
    const { props } = this;
    const mergedMode = this.getMode();

    return {
      mode: mergedMode === 'horizontal' ? 'vertical' : mergedMode,
      visible: this.getVisible(),
      level: props.level + 1,
      inlineIndent: props.inlineIndent,
      focusable: false,
      onClick: this.onSubMenuClick,
      onSelect: this.onSelect,
      onDeselect: this.onDeselect,
      onDestroy: this.onDestroy as any,
      selectedKeys: props.selectedKeys,
      eventKey: `${props.eventKey}-menu-`,
      openKeys: props.openKeys,
      motion: props.motion,
      onOpenChange: this.onOpenChange,
      subMenuOpenDelay: props.subMenuOpenDelay,
      parentMenu: this,
      subMenuCloseDelay: props.subMenuCloseDelay,
      forceSubMenuRender: props.forceSubMenuRender,
      triggerSubMenuAction: props.triggerSubMenuAction,
      builtinPlacements: props.builtinPlacements,
      defaultActiveFirst:
        props.store.getState().defaultActiveFirst[
          getMenuIdFromSubMenuEventKey(props.eventKey)
        ],
      multiple: props.multiple,
      prefixCls: props.rootPrefixCls,
      id: this.internalMenuId,
      manualRef: this.saveMenuInstance as any,
      itemIcon: props.itemIcon,
      expandIcon: props.expandIcon,
      direction: props.direction,
    };
  };

  getMotion = (mode: MenuMode, visible: boolean) => {
    const { haveRendered } = this;
    const { motion, rootPrefixCls } = this.props;

    // don't show transition on first rendering (no animation for opened menu)
    // show appear transition if it's not visible (not sure why)
    // show appear transition if it's not inline mode
    const mergedMotion: CSSMotionProps = {
      ...motion,
      leavedClassName: `${rootPrefixCls}-hidden`,
      removeOnLeave: false,
      motionAppear: haveRendered || !visible || mode !== 'inline',
    };

    return mergedMotion;
  };

  renderPopupMenu(className: string, style?: React.CSSProperties) {
    const baseProps = this.getBaseProps();

    /**
     * zombiej: Why SubPopupMenu here?
     * Seems whatever popup or inline mode both will render SubPopupMenu.
     * It's controlled by Trigger for popup or not.
     */
    return (
      <SubPopupMenu
        {...baseProps}
        id={this.internalMenuId}
        className={className}
        style={style}
      >
        {this.props.children}
      </SubPopupMenu>
    );
  }

  renderChildren() {
    const baseProps = this.getBaseProps();
    const { mode, visible, forceSubMenuRender, direction } = baseProps;

    // [Legacy] getMotion must be called before `haveRendered`
    const mergedMotion = this.getMotion(mode, visible);

    this.haveRendered = true;

    this.haveOpened = this.haveOpened || visible || forceSubMenuRender;
    // never rendered not planning to, don't render
    if (!this.haveOpened) {
      return <div />;
    }

    const sharedClassName = classNames(`${baseProps.prefixCls}-sub`, {
      [`${baseProps.prefixCls}-rtl`]: direction === 'rtl',
    });

    if (!this.isInlineMode()) {
      return this.renderPopupMenu(sharedClassName);
    }

    return (
      <CSSMotion
        visible={baseProps.visible}
        forceRender={forceSubMenuRender}
        {...mergedMotion}
      >
        {({ className, style }) => {
          const mergedClassName = classNames(sharedClassName, className);

          return this.renderPopupMenu(mergedClassName, style);
        }}
      </CSSMotion>
    );
  }

  render() {
    const props = { ...this.props };
    const visible = this.getVisible();
    const prefixCls = this.getPrefixCls();
    const inline = this.isInlineMode();
    const mergedMode = this.getMode();
    const className = classNames(prefixCls, `${prefixCls}-${mergedMode}`, {
      [props.className]: !!props.className,
      [this.getOpenClassName()]: visible,
      [this.getActiveClassName()]: props.active || (visible && !inline),
      [this.getDisabledClassName()]: props.disabled,
      [this.getSelectedClassName()]: this.isChildrenSelected(),
    });

    if (!this.internalMenuId) {
      if (props.eventKey) {
        this.internalMenuId = `${props.eventKey}$Menu`;
      } else {
        guid += 1;
        this.internalMenuId = `$__$${guid}$Menu`;
      }
    }

    let mouseEvents = {};
    let titleClickEvents = {};
    let titleMouseEvents = {};
    if (!props.disabled) {
      mouseEvents = {
        onMouseLeave: this.onMouseLeave,
        onMouseEnter: this.onMouseEnter,
      };

      // only works in title, not outer li
      titleClickEvents = {
        onClick: this.onTitleClick,
      };
      titleMouseEvents = {
        onMouseEnter: this.onTitleMouseEnter,
        onMouseLeave: this.onTitleMouseLeave,
      };
    }

    const style: React.CSSProperties = {};

    const { direction } = props;
    const isRTL = direction === 'rtl';

    if (inline) {
      if (isRTL) {
        style.paddingRight = props.inlineIndent * props.level;
      } else {
        style.paddingLeft = props.inlineIndent * props.level;
      }
    }

    let ariaOwns = {};
    // only set aria-owns when menu is open
    // otherwise it would be an invalid aria-owns value
    // since corresponding node cannot be found
    if (this.getVisible()) {
      ariaOwns = {
        'aria-owns': this.internalMenuId,
      };
    }

    // expand custom icon should NOT be displayed in menu with horizontal mode.
    let icon = null;
    if (mergedMode !== 'horizontal') {
      icon = this.props.expandIcon; // ReactNode
      if (typeof this.props.expandIcon === 'function') {
        icon = React.createElement(this.props.expandIcon as any, {
          ...this.props,
        });
      }
    }

    const title = (
      <div
        ref={this.saveSubMenuTitle}
        style={style}
        className={`${prefixCls}-title`}
        role="button"
        {...titleMouseEvents}
        {...titleClickEvents}
        aria-expanded={visible}
        {...ariaOwns}
        aria-haspopup="true"
        title={typeof props.title === 'string' ? props.title : undefined}
      >
        {props.title}
        {icon || <i className={`${prefixCls}-arrow`} />}
      </div>
    );

    const children = this.renderChildren();

    const getPopupContainer = props.parentMenu?.isRootMenu
      ? props.parentMenu.props.getPopupContainer
      : (triggerNode: HTMLElement) => triggerNode.parentNode;
    const popupPlacement = popupPlacementMap[mergedMode];
    const popupAlign = props.popupOffset ? { offset: props.popupOffset } : {};
    const popupClassName = classNames({
      [props.popupClassName]: props.popupClassName && !inline,
      [`${prefixCls}-rtl`]: isRTL,
    });
    const {
      disabled,
      triggerSubMenuAction,
      subMenuOpenDelay,
      forceSubMenuRender,
      subMenuCloseDelay,
      builtinPlacements,
    } = props;
    menuAllProps.forEach((key) => delete props[key]);
    // Set onClick to null, to ignore propagated onClick event
    delete props.onClick;
    const placement = isRTL
      ? { ...placementsRtl, ...builtinPlacements }
      : { ...placements, ...builtinPlacements };
    delete props.direction;

    // [Legacy] It's a fast fix,
    // but we should check if we can refactor this to make code more easy to understand
    const baseProps = this.getBaseProps();
    const mergedMotion: CSSMotionProps = inline
      ? null
      : this.getMotion(baseProps.mode, baseProps.visible);

    return (
      <li
        {...(props as any)}
        {...mouseEvents}
        className={className}
        role="menuitem"
      >
        <Trigger
          prefixCls={prefixCls}
          popupClassName={classNames(`${prefixCls}-popup`, popupClassName)}
          getPopupContainer={getPopupContainer}
          builtinPlacements={placement}
          popupPlacement={popupPlacement}
          popupVisible={inline ? false : visible}
          popupAlign={popupAlign}
          popup={inline ? null : children}
          action={disabled || inline ? [] : [triggerSubMenuAction]}
          mouseEnterDelay={subMenuOpenDelay}
          mouseLeaveDelay={subMenuCloseDelay}
          onPopupVisibleChange={this.onPopupVisibleChange}
          forceRender={forceSubMenuRender}
          popupMotion={mergedMotion}
        >
          {title}
        </Trigger>
        {inline ? children : null}
      </li>
    );
  }
}

const connected = connect<any, any, any>(
  ({ openKeys, activeKey, selectedKeys }, { eventKey, subMenuKey }) => ({
    isOpen: openKeys.indexOf(eventKey) > -1,
    active: activeKey[subMenuKey] === eventKey,
    selectedKeys,
  }),
)(SubMenu as any);

connected.isSubMenu = true;

export default connected;
