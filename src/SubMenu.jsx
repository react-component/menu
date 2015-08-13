import SubPopupMenu from './SubPopupMenu';
import React from 'react';
import {classSet, KeyCode, guid} from 'rc-util';

const SubMenu = React.createClass({
  propTypes: {
    title: React.PropTypes.node,
    onClick: React.PropTypes.func,
    onOpenedChange: React.PropTypes.func,
    rootPrefixCls: React.PropTypes.string,
    eventKey: React.PropTypes.string,
    multiple: React.PropTypes.bool,
    active: React.PropTypes.bool,
    opened: React.PropTypes.bool,
    onSelect: React.PropTypes.func,
    closeSubMenuOnMouseLeave: React.PropTypes.bool,
    onDeselect: React.PropTypes.func,
    onDestroy: React.PropTypes.func,
    onItemHover: React.PropTypes.func,
  },

  mixins: [require('./SubMenuStateMixin')],

  getInitialState() {
    this.isSubMenu = 1;
    return {
      defaultActiveFirst: false,
    };
  },

  getDefaultProps() {
    return {
      onMouseEnter() {
      },
      title: '',
    };
  },

  componentWillUnmount() {
    const props = this.props;
    if (props.onDestroy) {
      props.onDestroy(props.eventKey);
    }
  },

  onDestroy(key) {
    this.props.onDestroy(key);
  },

  onKeyDown(e) {
    const keyCode = e.keyCode;
    const menu = this.menuInstance;

    if (keyCode === KeyCode.ENTER) {
      this.onClick(e);
      this.setState({
        defaultActiveFirst: true,
      });
      return true;
    }

    if (keyCode === KeyCode.RIGHT) {
      if (this.props.opened) {
        menu.onKeyDown(e);
      } else {
        this.triggerOpenedChange(true);
        this.setState({
          defaultActiveFirst: true,
        });
      }
      return true;
    }
    if (keyCode === KeyCode.LEFT) {
      let handled;
      if (this.props.opened) {
        handled = menu.onKeyDown(e);
      } else {
        return undefined;
      }
      if (!handled) {
        this.triggerOpenedChange(false);
        handled = true;
      }
      return handled;
    }

    if (this.props.opened && (keyCode === KeyCode.UP || keyCode === KeyCode.DOWN)) {
      return menu.onKeyDown(e);
    }
  },

  onSubTreeMouseEnter() {
    if (this.leaveTimer) {
      clearTimeout(this.leaveTimer);
      this.leaveTimer = null;
    }
  },

  onOpenedChange(e) {
    this.props.onOpenedChange(e);
  },

  onMouseEnter() {
    if (this.leaveTimer) {
      clearTimeout(this.leaveTimer);
      this.leaveTimer = null;
    }
    const props = this.props;
    props.onItemHover({
      key: this.props.eventKey,
      item: this,
      hover: true,
      trigger: 'mouseenter',
    });
    if (props.openSubMenuOnMouseEnter) {
      this.triggerOpenedChange(true);
    }
    this.setState({
      defaultActiveFirst: false,
    });
  },

  onMouseLeave() {
    // prevent popmenu and submenu gap
    this.leaveTimer = setTimeout(()=> {
      // leave whole sub tree
      // still active
      if (this.isMounted() && this.props.active) {
        this.props.onItemHover({
          key: this.props.eventKey,
          item: this,
          hover: false,
          trigger: 'mouseleave',
        });
      }
      if (this.isMounted() && this.props.opened) {
        if (this.props.closeSubMenuOnMouseLeave) {
          this.triggerOpenedChange(false);
        }
      }
    }, 100);
  },

  onClick() {
    this.triggerOpenedChange(!this.props.opened, 'click');
    this.setState({
      defaultActiveFirst: false,
    });
  },

  onSubMenuClick(info) {
    this.props.onClick(info);
  },

  onSelect(info) {
    this.props.onSelect(info);
  },

  onDeselect(info) {
    this.props.onDeselect(info);
  },

  getPrefixCls() {
    return this.props.rootPrefixCls + '-submenu';
  },

  getActiveClassName() {
    return this.getPrefixCls() + '-active';
  },

  getDisabledClassName() {
    return this.getPrefixCls() + '-disabled';
  },

  getOpenedClassName() {
    return this.props.rootPrefixCls + '-submenu-opened';
  },

  renderChildren(children) {
    const props = this.props;
    const baseProps = {
      mode: props.mode === 'horizontal' ? 'vertical' : props.mode,
      visible: this.props.opened,
      level: props.level + 1,
      inlineIndent: props.inlineIndent,
      focusable: false,
      onClick: this.onSubMenuClick,
      onSelect: this.onSelect,
      onDeselect: this.onDeselect,
      onDestroy: this.onDestroy,
      selectedKeys: props.selectedKeys,
      openedKeys: props.openedKeys,
      onOpenedChange: this.onOpenedChange,
      closeSubMenuOnMouseLeave: props.closeSubMenuOnMouseLeave,
      defaultActiveFirst: this.state.defaultActiveFirst,
      multiple: props.multiple,
      prefixCls: props.rootPrefixCls,
      id: this._menuId,
      ref: this.saveMenuInstance,
    };
    return <SubPopupMenu {...baseProps}>{children}</SubPopupMenu>;
  },

  render() {
    this.haveOpened = this.haveOpened || this.props.opened;
    const props = this.props;
    const prefixCls = this.getPrefixCls();
    const classes = {
      [props.className]: !!props.className,
      [`${prefixCls}-${props.mode}`]: 1,
    };

    classes[this.getOpenedClassName()] = this.props.opened;
    classes[this.getActiveClassName()] = props.active;
    classes[this.getDisabledClassName()] = props.disabled;
    this._menuId = this._menuId || guid();
    classes[prefixCls] = true;
    classes[prefixCls + '-' + props.mode] = 1;
    let clickEvents = {};
    let mouseEvents = {};
    let titleMouseEvents = {};
    if (!props.disabled) {
      clickEvents = {
        onClick: this.onClick,
      };
      mouseEvents = {
        onMouseLeave: this.onMouseLeave,
        onMouseEnter: this.onSubTreeMouseEnter,
      };
      // only works in title, not outer li
      titleMouseEvents = {
        onMouseEnter: this.onMouseEnter,
      };
    }
    const style = {};
    if (props.mode === 'inline') {
      style.paddingLeft = props.inlineIndent * props.level;
    }
    return (
      <li className={classSet(classes)}  {...mouseEvents}>
        <div
          style={style}
          className={prefixCls + '-title'}
          {...titleMouseEvents}
          {...clickEvents}
          aria-opened={props.opened}
          aria-owns={this._menuId}
          aria-haspopup="true"
          >
          {props.title}
        </div>
        {this.renderChildren(props.children)}
      </li>
    );
  },

  saveMenuInstance(c) {
    this.menuInstance = c;
  },

  triggerOpenedChange(opened, type) {
    this.onOpenedChange({
      key: this.props.eventKey,
      item: this,
      trigger: type,
      opened: opened,
    });
  },
});

export default SubMenu;
