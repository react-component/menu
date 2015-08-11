import SubPopupMenu from './SubPopupMenu';
import React from 'react';
import {classSet, KeyCode, guid} from 'rc-util';

const SubMenu = React.createClass({
  propTypes: {
    closeSubMenuOnDeactive: React.PropTypes.bool,
    deactiveSubMenuOnMouseLeave: React.PropTypes.bool,
    openSubMenuOnMouseEnter: React.PropTypes.bool,
    title: React.PropTypes.node,
    onClick: React.PropTypes.func,
    parent: React.PropTypes.object,
    rootPrefixCls: React.PropTypes.string,
    multiple: React.PropTypes.bool,
    onSelect: React.PropTypes.func,
    onDeselect: React.PropTypes.func,
    onDestroy:React.PropTypes.func,
    onHover: React.PropTypes.func,
  },

  mixins: [require('./SubMenuStateMixin')],

  getInitialState() {
    return {
      defaultActiveFirst: false,
    };
  },

  componentWillReceiveProps(nextProps) {
    if ('open' in nextProps) {
      this.setOpenState(nextProps.open);
    }
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

  onDestroy(key){
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

  onSubTreeMouseEnter() {
    if (this.props.parent.leaveTimer) {
      clearTimeout(this.props.parent.leaveTimer);
      this.props.parent.leaveTimer = null;
    }
  },

  onMouseEnter() {
    if (this.props.parent.leaveTimer) {
      clearTimeout(this.props.parent.leaveTimer);
      this.props.parent.leaveTimer = null;
    }
    const props = this.props;
    props.onHover(props.eventKey);
    if (props.openSubMenuOnMouseEnter) {
      this.setOpenState(true);
      this.setState({
        defaultActiveFirst: false,
      });
    }
  },

  onMouseLeave() {
    this.props.parent.leaveTimer = setTimeout(()=> {
      this.props.parent.leaveTimer = null;
      if (this.props.deactiveSubMenuOnMouseLeave) {
        this.props.onHover(null);
      }
    }, 100);
  },

  onClick() {
    if (!this.props.openSubMenuOnMouseEnter) {
      this.setOpenState(!this.state.open);
      this.setState({
        defaultActiveFirst: false,
      });
    }
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
    const baseProps = {
      mode: props.mode === 'horizontal' ? 'vertical' : props.mode,
      visible: this.state.open,
      level: props.level + 1,
      inlineIndent: props.inlineIndent,
      focusable: false,
      onClick: this.onSubMenuClick,
      closeSubMenuOnDeactive: props.closeSubMenuOnDeactive,
      deactiveSubMenuOnMouseLeave: props.deactiveSubMenuOnMouseLeave,
      openSubMenuOnMouseEnter: props.openSubMenuOnMouseEnter,
      onSelect: this.onSelect,
      onDeselect: this.onDeselect,
      onDestroy: this.onDestroy,
      selectedKeys: props.selectedKeys,
      defaultActiveFirst: this.state.defaultActiveFirst,
      multiple: props.multiple,
      prefixCls: props.rootPrefixCls,
      id: this._menuId,
      ref: this.saveMenuInstance,
    };
    return <SubPopupMenu {...baseProps}>{children}</SubPopupMenu>;
  },

  render() {
    this.haveOpened = this.haveOpened || this.state.open;
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
});

export default SubMenu;
