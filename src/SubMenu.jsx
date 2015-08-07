import Menu from './Menu';
import React from 'react';
import {classSet, createChainedFunction, KeyCode, guid} from 'rc-util';

const SubMenu = React.createClass({
  propTypes: {
    closeOnDeActive: React.PropTypes.bool,
    globalCloseOnDeActive: React.PropTypes.bool,
    openOnHover: React.PropTypes.bool,
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
      activeFirst: false,
    };
  },


  componentWillReceiveProps(nextProps) {
    if (!nextProps.active && this.isCloseOnDeActive()) {
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
        activeFirst: true,
      });
      return true;
    }

    if (keyCode === KeyCode.RIGHT) {
      if (this.state.open) {
        menu.onKeyDown(e);
      } else {
        this.setOpenState(true);
        this.setState({
          activeFirst: true,
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
      openOnHover = props.globalOpenOnHover;
    }
    if (openOnHover === undefined) {
      openOnHover = true;
    }
    if (openOnHover) {
      this.setOpenState(true);
      this.setState({
        activeFirst: false,
      });
    }
  },

  onMouseLeave() {
    if (!this.state.open) {
      this.props.onHover(null);
    }
  },

  onClick() {
    if (this.isCloseOnDeActive()) {
      this.setOpenState(true);
    } else {
      this.setOpenState(!this.state.open);
    }
    this.setState({
      activeFirst: false,
    });
  },

  onSubMenuClick(key, menuItem, e) {
    this.props.onClick(key, menuItem, e);
  },

  onSelect(childKey, child, e) {
    // propagate
    this.props.onSelect(childKey, child, e);
  },

  onDeselect() {
    this.props.onDeselect.apply(null, arguments);
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
    if (!this.state.open) {
      // prevent destroy
      return this._cacheMenu || null;
    }
    const childrenCount = React.Children.count(children);
    let mode = props.mode;
    if (mode !== 'inline') {
      mode = undefined;
    }
    const baseProps = {
      sub: true,
      level: props.level + 1,
      inlineIndent: props.inlineIndent,
      openOnHover: props.globalOpenOnHover,
      closeOnDeActive: props.globalCloseOnDeActive,
      focusable: false,
      onClick: this.onSubMenuClick,
      onSelect: this.onSelect,
      onDeselect: this.onDeselect,
      activeFirst: this.state.activeFirst,
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
      this._cacheMenu = React.cloneElement(menu, baseProps);
    } else {
      this._cacheMenu = <Menu {...baseProps}>{children}</Menu>;
    }
    return this._cacheMenu;
  },

  render() {
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

  isCloseOnDeActive() {
    let closeOnDeActive = this.props.closeOnDeActive;
    if (closeOnDeActive === undefined) {
      closeOnDeActive = this.props.globalCloseOnDeActive;
    }
    if (closeOnDeActive === undefined) {
      closeOnDeActive = true;
    }
    return closeOnDeActive;
  },
});

export default SubMenu;
