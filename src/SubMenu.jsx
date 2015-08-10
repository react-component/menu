import Menu from './Menu';
import React from 'react';
import {classSet, createChainedFunction, KeyCode, guid} from 'rc-util';

const SubMenu = React.createClass({
  propTypes: {
    closeOnDeactive: React.PropTypes.bool,
    closeSubMenuOnDeactive: React.PropTypes.bool,
    openOnHover: React.PropTypes.bool,
    openSubMenuOnHover: React.PropTypes.bool,
    title: React.PropTypes.node,
    onClick: React.PropTypes.func,
    rootPrefixCls: React.PropTypes.string,
    multiple: React.PropTypes.bool,
    onSelect: React.PropTypes.func,
    onDeselect: React.PropTypes.func,
    onHover: React.PropTypes.func,
  },

  mixins: [require('./SubMenuStateMixin')],

  getInitialState() {
    return {
      defaultActiveFirst: false,
    };
  },

  componentWillReceiveProps(nextProps) {
    if (!nextProps.active && this.isCloseOnDeactive()) {
      this.setOpenState(false);
    }
  },

  getDefaultProps() {
    return {
      onMouseEnter() {
      },
      title: '',
    };
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
      if (this.state.open) {
        menu.onKeyDown(e);
      } else {
        this.setOpenState(true);
        this.setState({
          defaultActiveFirst: true,
        });
      }
      return true;
    }
    if (keyCode === KeyCode.LEFT) {
      let handled;
      if (this.state.open) {
        handled = menu.onKeyDown(e);
      } else {
        return undefined;
      }
      if (!handled) {
        this.setOpenState(false);
        handled = true;
      }
      return handled;
    }

    if (this.state.open && (keyCode === KeyCode.UP || keyCode === KeyCode.DOWN)) {
      return menu.onKeyDown(e);
    }
  },

  onMouseEnter() {
    const props = this.props;
    props.onHover(props.eventKey);
    let openOnHover = props.openOnHover;
    if (openOnHover === undefined) {
      openOnHover = props.openSubMenuOnHover;
    }
    if (openOnHover === undefined) {
      openOnHover = true;
    }
    if (openOnHover) {
      this.setOpenState(true);
      this.setState({
        defaultActiveFirst: false,
      });
    }
  },

  onMouseLeave() {
    if (!this.state.open) {
      this.props.onHover(null);
    }
  },

  onClick() {
    if (this.isCloseOnDeactive()) {
      this.setOpenState(true);
    } else {
      this.setOpenState(!this.state.open);
    }
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

  renderChildren(children) {
    const props = this.props;
    const childrenCount = React.Children.count(children);
    let mode = props.mode;
    if (mode !== 'inline') {
      mode = undefined;
    }
    const baseProps = {
      sub: true,
      visible: this.state.open,
      level: props.level + 1,
      inlineIndent: props.inlineIndent,
      openSubMenuOnHover: props.openSubMenuOnHover,
      closeSubMenuOnDeactive: props.closeSubMenuOnDeactive,
      focusable: false,
      onClick: this.onSubMenuClick,
      onSelect: this.onSelect,
      onDeselect: this.onDeselect,
      selectedKeys: props.selectedKeys,
      defaultActiveFirst: this.state.defaultActiveFirst,
      multiple: props.multiple,
      prefixCls: props.rootPrefixCls,
      id: this._menuId,
      ref: this.saveMenuInstance,
    };
    if (mode) {
      baseProps.mode = mode;
    }
    if (childrenCount === 1 && children.type === Menu) {
      const menu = children;
      baseProps.ref = createChainedFunction(menu.ref, this.saveMenuInstance);
      baseProps.onClick = createChainedFunction(menu.props.onClick, this.onSubMenuClick);
      return React.cloneElement(menu, baseProps);
    }
    return <Menu {...baseProps}>{children}</Menu>;
  },

  render() {
    this.haveOpened = this.haveOpened || this.state.opened;
    const props = this.props;
    const prefixCls = this.getPrefixCls();
    const classes = {
      [props.className]: !!props.className,
      [`${prefixCls}-${props.mode}`]: 1,
    };

    classes[this.getOpenClassName()] = this.state.open;
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
          aria-expanded={props.active}
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

  isCloseOnDeactive() {
    let closeOnDeactive = this.props.closeOnDeactive;
    if (closeOnDeactive === undefined) {
      closeOnDeactive = this.props.closeSubMenuOnDeactive;
    }
    if (closeOnDeactive === undefined) {
      closeOnDeactive = true;
    }
    return closeOnDeactive;
  },
});

export default SubMenu;
