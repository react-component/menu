import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Trigger from 'rc-trigger';
import KeyCode from 'rc-util/lib/KeyCode';
import classNames from 'classnames';
import { connect } from 'mini-store';
import SubPopupMenu from './SubPopupMenu';
import placements from './placements';
import Animate from 'rc-animate';
import {
  noop,
  loopMenuItemRecursively,
  getMenuIdFromSubMenuEventKey,
  menuAllProps,
} from './util';

let guid = 0;

const popupPlacementMap = {
  horizontal: 'bottomLeft',
  vertical: 'rightTop',
  'vertical-left': 'rightTop',
  'vertical-right': 'leftTop',
};

const updateDefaultActiveFirst = (store, eventKey, defaultActiveFirst) => {
  const menuId = getMenuIdFromSubMenuEventKey(eventKey);
  const state = store.getState();
  store.setState({
    defaultActiveFirst: {
      ...state.defaultActiveFirst,
      [menuId]: defaultActiveFirst,
    },
  });
};

export class SubMenu extends React.Component {
  static propTypes = {
    parentMenu: PropTypes.object,
    title: PropTypes.node,
    children: PropTypes.any,
    selectedKeys: PropTypes.array,
    openKeys: PropTypes.array,
    onClick: PropTypes.func,
    onOpenChange: PropTypes.func,
    rootPrefixCls: PropTypes.string,
    eventKey: PropTypes.string,
    multiple: PropTypes.bool,
    active: PropTypes.bool, // TODO: remove
    onItemHover: PropTypes.func,
    onSelect: PropTypes.func,
    triggerSubMenuAction: PropTypes.string,
    onDeselect: PropTypes.func,
    onDestroy: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    onTitleMouseEnter: PropTypes.func,
    onTitleMouseLeave: PropTypes.func,
    onTitleClick: PropTypes.func,
    popupOffset: PropTypes.array,
    isOpen: PropTypes.bool,
    store: PropTypes.object,
    mode: PropTypes.oneOf([
      'horizontal',
      'vertical',
      'vertical-left',
      'vertical-right',
      'inline',
    ]),
    manualRef: PropTypes.func,
    itemIcon: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
    expandIcon: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  };

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

  constructor(props) {
    super(props);
    const store = props.store;
    const eventKey = props.eventKey;
    const defaultActiveFirst = store.getState().defaultActiveFirst;

    this.isRootMenu = false;

    let value = false;

    if (defaultActiveFirst) {
      value = defaultActiveFirst[eventKey];
    }

    updateDefaultActiveFirst(store, eventKey, value);
  }

  componentDidMount() {
    this.componentDidUpdate();
  }

  componentDidUpdate() {
    const { mode, parentMenu, manualRef } = this.props;

    // invoke customized ref to expose component to mixin
    if (manualRef) {
      manualRef(this);
    }

    if (mode !== 'horizontal' || !parentMenu.isRootMenu || !this.props.isOpen) {
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
  }

  onDestroy = key => {
    this.props.onDestroy(key);
  };

  onKeyDown = e => {
    const keyCode = e.keyCode;
    const menu = this.menuInstance;
    const { isOpen, store } = this.props;

    if (keyCode === KeyCode.ENTER) {
      this.onTitleClick(e);
      updateDefaultActiveFirst(store, this.props.eventKey, true);
      return true;
    }

    if (keyCode === KeyCode.RIGHT) {
      if (isOpen) {
        menu.onKeyDown(e);
      } else {
        this.triggerOpenChange(true);
        // need to update current menu's defaultActiveFirst value
        updateDefaultActiveFirst(store, this.props.eventKey, true);
      }
      return true;
    }
    if (keyCode === KeyCode.LEFT) {
      let handled;
      if (isOpen) {
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

    if (isOpen && (keyCode === KeyCode.UP || keyCode === KeyCode.DOWN)) {
      return menu.onKeyDown(e);
    }
  };

  onOpenChange = e => {
    this.props.onOpenChange(e);
  };

  onPopupVisibleChange = visible => {
    this.triggerOpenChange(visible, visible ? 'mouseenter' : 'mouseleave');
  };

  onMouseEnter = e => {
    const { eventKey: key, onMouseEnter, store } = this.props;
    updateDefaultActiveFirst(store, this.props.eventKey, false);
    onMouseEnter({
      key,
      domEvent: e,
    });
  };

  onMouseLeave = e => {
    const { parentMenu, eventKey, onMouseLeave } = this.props;
    parentMenu.subMenuInstance = this;
    onMouseLeave({
      key: eventKey,
      domEvent: e,
    });
  };

  onTitleMouseEnter = domEvent => {
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

  onTitleMouseLeave = e => {
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

  onTitleClick = e => {
    const { props } = this;
    props.onTitleClick({
      key: props.eventKey,
      domEvent: e,
    });
    if (props.triggerSubMenuAction === 'hover') {
      return;
    }
    this.triggerOpenChange(!props.isOpen, 'click');
    updateDefaultActiveFirst(props.store, this.props.eventKey, false);
  };

  onSubMenuClick = info => {
    // in the case of overflowed submenu
    // onClick is not copied over
    if (typeof this.props.onClick === 'function') {
      this.props.onClick(this.addKeyPath(info));
    }
  };

  onSelect = info => {
    this.props.onSelect(info);
  };

  onDeselect = info => {
    this.props.onDeselect(info);
  };

  getPrefixCls = () => {
    return `${this.props.rootPrefixCls}-submenu`;
  };

  getActiveClassName = () => {
    return `${this.getPrefixCls()}-active`;
  };

  getDisabledClassName = () => {
    return `${this.getPrefixCls()}-disabled`;
  };

  getSelectedClassName = () => {
    return `${this.getPrefixCls()}-selected`;
  };

  getOpenClassName = () => {
    return `${this.props.rootPrefixCls}-submenu-open`;
  };

  saveMenuInstance = c => {
    // children menu instance
    this.menuInstance = c;
  };

  addKeyPath = info => {
    return {
      ...info,
      keyPath: (info.keyPath || []).concat(this.props.eventKey),
    };
  };

  triggerOpenChange = (open, type) => {
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

  isOpen = () => {
    return this.props.openKeys.indexOf(this.props.eventKey) !== -1;
  };

  adjustWidth = () => {
    /* istanbul ignore if */
    if (!this.subMenuTitle || !this.menuInstance) {
      return;
    }
    const popupMenu = ReactDOM.findDOMNode(this.menuInstance);
    if (popupMenu.offsetWidth >= this.subMenuTitle.offsetWidth) {
      return;
    }

    /* istanbul ignore next */
    popupMenu.style.minWidth = `${this.subMenuTitle.offsetWidth}px`;
  };

  saveSubMenuTitle = subMenuTitle => {
    this.subMenuTitle = subMenuTitle;
  };

  renderChildren(children) {
    const props = this.props;
    const baseProps = {
      mode: props.mode === 'horizontal' ? 'vertical' : props.mode,
      visible: this.props.isOpen,
      level: props.level + 1,
      inlineIndent: props.inlineIndent,
      focusable: false,
      onClick: this.onSubMenuClick,
      onSelect: this.onSelect,
      onDeselect: this.onDeselect,
      onDestroy: this.onDestroy,
      selectedKeys: props.selectedKeys,
      eventKey: `${props.eventKey}-menu-`,
      openKeys: props.openKeys,
      openTransitionName: props.openTransitionName,
      openAnimation: props.openAnimation,
      onOpenChange: this.onOpenChange,
      subMenuOpenDelay: props.subMenuOpenDelay,
      parentMenu: this,
      subMenuCloseDelay: props.subMenuCloseDelay,
      forceSubMenuRender: props.forceSubMenuRender,
      triggerSubMenuAction: props.triggerSubMenuAction,
      builtinPlacements: props.builtinPlacements,
      defaultActiveFirst: props.store.getState().defaultActiveFirst[
        getMenuIdFromSubMenuEventKey(props.eventKey)
      ],
      multiple: props.multiple,
      prefixCls: props.rootPrefixCls,
      id: this._menuId,
      manualRef: this.saveMenuInstance,
      itemIcon: props.itemIcon,
      expandIcon: props.expandIcon,
    };

    const haveRendered = this.haveRendered;
    this.haveRendered = true;

    this.haveOpened =
      this.haveOpened || baseProps.visible || baseProps.forceSubMenuRender;
    // never rendered not planning to, don't render
    if (!this.haveOpened) {
      return <div />;
    }

    // don't show transition on first rendering (no animation for opened menu)
    // show appear transition if it's not visible (not sure why)
    // show appear transition if it's not inline mode
    const transitionAppear =
      haveRendered || !baseProps.visible || baseProps.mode !== 'inline';

    baseProps.className = ` ${baseProps.prefixCls}-sub`;
    const animProps = {};

    if (baseProps.openTransitionName) {
      animProps.transitionName = baseProps.openTransitionName;
    } else if (typeof baseProps.openAnimation === 'object') {
      animProps.animation = { ...baseProps.openAnimation };
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
        <SubPopupMenu {...baseProps} id={this._menuId}>
          {children}
        </SubPopupMenu>
      </Animate>
    );
  }

  render() {
    const props = { ...this.props };
    const isOpen = props.isOpen;
    const prefixCls = this.getPrefixCls();
    const isInlineMode = props.mode === 'inline';
    const className = classNames(prefixCls, `${prefixCls}-${props.mode}`, {
      [props.className]: !!props.className,
      [this.getOpenClassName()]: isOpen,
      [this.getActiveClassName()]: props.active || (isOpen && !isInlineMode),
      [this.getDisabledClassName()]: props.disabled,
      [this.getSelectedClassName()]: this.isChildrenSelected(),
    });

    if (!this._menuId) {
      if (props.eventKey) {
        this._menuId = `${props.eventKey}$Menu`;
      } else {
        this._menuId = `$__$${++guid}$Menu`;
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

    const style = {};
    if (isInlineMode) {
      style.paddingLeft = props.inlineIndent * props.level;
    }

    let ariaOwns = {};
    // only set aria-owns when menu is open
    // otherwise it would be an invalid aria-owns value
    // since corresponding node cannot be found
    if (this.props.isOpen) {
      ariaOwns = {
        'aria-owns': this._menuId,
      };
    }

    // expand custom icon should NOT be displayed in menu with horizontal mode.
    let icon = null;
    if (props.mode !== 'horizontal') {
      icon = this.props.expandIcon; // ReactNode
      if (typeof this.props.expandIcon === 'function') {
        icon = React.createElement(this.props.expandIcon, { ...this.props });
      }
    }

    const title = (
      <div
        ref={this.saveSubMenuTitle}
        style={style}
        className={`${prefixCls}-title`}
        {...titleMouseEvents}
        {...titleClickEvents}
        aria-expanded={isOpen}
        {...ariaOwns}
        aria-haspopup="true"
        title={typeof props.title === 'string' ? props.title : undefined}
      >
        {props.title}
        {icon || <i className={`${prefixCls}-arrow`} />}
      </div>
    );
    const children = this.renderChildren(props.children);

    const getPopupContainer = props.parentMenu.isRootMenu
      ? props.parentMenu.props.getPopupContainer
      : triggerNode => triggerNode.parentNode;
    const popupPlacement = popupPlacementMap[props.mode];
    const popupAlign = props.popupOffset ? { offset: props.popupOffset } : {};
    const popupClassName = props.mode === 'inline' ? '' : props.popupClassName;
    const {
      disabled,
      triggerSubMenuAction,
      subMenuOpenDelay,
      forceSubMenuRender,
      subMenuCloseDelay,
      builtinPlacements,
    } = props;
    menuAllProps.forEach(key => delete props[key]);
    // Set onClick to null, to ignore propagated onClick event
    delete props.onClick;

    return (
      <li {...props} {...mouseEvents} className={className} role="menuitem">
        {isInlineMode && title}
        {isInlineMode && children}
        {!isInlineMode && (
          <Trigger
            prefixCls={prefixCls}
            popupClassName={`${prefixCls}-popup ${popupClassName}`}
            getPopupContainer={getPopupContainer}
            builtinPlacements={Object.assign({}, placements, builtinPlacements)}
            popupPlacement={popupPlacement}
            popupVisible={isOpen}
            popupAlign={popupAlign}
            popup={children}
            action={disabled ? [] : [triggerSubMenuAction]}
            mouseEnterDelay={subMenuOpenDelay}
            mouseLeaveDelay={subMenuCloseDelay}
            onPopupVisibleChange={this.onPopupVisibleChange}
            forceRender={forceSubMenuRender}
          >
            {title}
          </Trigger>
        )}
      </li>
    );
  }
}

const connected = connect(
  ({ openKeys, activeKey, selectedKeys }, { eventKey, subMenuKey }) => ({
    isOpen: openKeys.indexOf(eventKey) > -1,
    active: activeKey[subMenuKey] === eventKey,
    selectedKeys,
  }),
)(SubMenu);

connected.isSubMenu = true;

export default connected;
