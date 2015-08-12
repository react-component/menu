import SubPopupMenu from './SubPopupMenu';
import React from 'react';
import {classSet, KeyCode, guid} from 'rc-util';

const SubMenu = React.createClass({
  propTypes: {
    title: React.PropTypes.node,
    onClick: React.PropTypes.func,
    onExpandedChange: React.PropTypes.func,
    parent: React.PropTypes.object,
    rootPrefixCls: React.PropTypes.string,
    eventKey: React.PropTypes.string,
    multiple: React.PropTypes.bool,
    expanded: React.PropTypes.bool,
    onSelect: React.PropTypes.func,
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
      if (this.props.expanded) {
        menu.onKeyDown(e);
      } else {
        this.triggerExpandedChange(true);
        this.setState({
          defaultActiveFirst: true,
        });
      }
      return true;
    }
    if (keyCode === KeyCode.LEFT) {
      let handled;
      if (this.props.expanded) {
        handled = menu.onKeyDown(e);
      } else {
        return undefined;
      }
      if (!handled) {
        this.triggerExpandedChange(false);
        handled = true;
      }
      return handled;
    }

    if (this.props.expanded && (keyCode === KeyCode.UP || keyCode === KeyCode.DOWN)) {
      return menu.onKeyDown(e);
    }
  },

  onSubTreeMouseEnter() {
    if (this.props.parent.leaveTimer) {
      clearTimeout(this.props.parent.leaveTimer);
      this.props.parent.leaveTimer = null;
    }
  },

  onExpandedChange(e) {
    this.props.onExpandedChange(e);
  },

  onMouseEnter() {
    if (this.props.parent.leaveTimer) {
      clearTimeout(this.props.parent.leaveTimer);
      this.props.parent.leaveTimer = null;
    }
    const props = this.props;
    props.onItemHover({
      key: this.props.eventKey,
      item: this,
      hover: true,
      trigger: 'mouseenter',
    });
    this.triggerExpandedChange(true, 'mouseenter');
    this.setState({
      defaultActiveFirst: false,
    });
  },

  onMouseLeave() {
    this.props.parent.leaveTimer = setTimeout(()=> {
      this.props.parent.leaveTimer = null;
      this.props.onItemHover({
        key: this.props.eventKey,
        item: this,
        hover: false,
        trigger: 'mouseleave',
      });
      this.triggerExpandedChange(false, 'mouseleave');
    }, 100);
  },

  onClick() {
    this.triggerExpandedChange(!this.props.expanded, 'click');
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

  getExpandedClassName() {
    return this.props.rootPrefixCls + '-submenu-expanded';
  },

  renderChildren(children) {
    const props = this.props;
    const baseProps = {
      mode: props.mode === 'horizontal' ? 'vertical' : props.mode,
      visible: this.props.expanded,
      level: props.level + 1,
      inlineIndent: props.inlineIndent,
      focusable: false,
      onClick: this.onSubMenuClick,
      onSelect: this.onSelect,
      onDeselect: this.onDeselect,
      onDestroy: this.onDestroy,
      selectedKeys: props.selectedKeys,
      expandedKeys: props.expandedKeys,
      onExpandedChange: this.onExpandedChange,
      openSubMenuOnMouseEnter: props.openSubMenuOnMouseEnter,
      defaultActiveFirst: this.state.defaultActiveFirst,
      multiple: props.multiple,
      prefixCls: props.rootPrefixCls,
      id: this._menuId,
      ref: this.saveMenuInstance,
    };
    return <SubPopupMenu {...baseProps}>{children}</SubPopupMenu>;
  },

  render() {
    this.haveOpened = this.haveOpened || this.props.expanded;
    const props = this.props;
    const prefixCls = this.getPrefixCls();
    const classes = {
      [props.className]: !!props.className,
      [`${prefixCls}-${props.mode}`]: 1,
    };

    classes[this.getExpandedClassName()] = this.props.expanded;
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
          aria-expanded={props.expanded}
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

  triggerExpandedChange(expanded, type) {
    this.onExpandedChange({
      key: this.props.eventKey,
      parent: this.props.parent,
      item: this,
      trigger: type,
      expanded: expanded,
    });
  },
});

export default SubMenu;
