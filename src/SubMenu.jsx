import Menu from './Menu';
import React from 'react';
import {classSet, createChainedFunction, KeyCode, guid} from 'rc-util';

const SubMenu = React.createClass({
  propTypes: {
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
    if (!nextProps.active) {
      this.setOpenState(false);
    }
  },

  getDefaultProps() {
    return {
      openOnHover: true,
      align: {
        points: ['lt', 'rt'],
      },
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
    if (props.openOnHover) {
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
    this.setOpenState(true);
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
    if (!this.state.open) {
      // prevent destroy
      return this._cacheMenu || null;
    }
    const childrenCount = React.Children.count(children);
    const baseProps = {
      sub: true,
      focusable: false,
      onClick: this.onSubMenuClick,
      onSelect: this.onSelect,
      onDeselect: this.onDeselect,
      activeFirst: this.state.activeFirst,
      multiple: this.props.multiple,
      prefixCls: this.props.rootPrefixCls,
      id: this._menuId,
      ref: this.saveMenuInstance,
    };
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
    const classes = {
      [props.className]: !!props.className,
    };
    const prefixCls = this.getPrefixCls();
    classes[this.getOpenClassName()] = this.state.open;
    classes[this.getActiveClassName()] = props.active;
    classes[this.getDisabledClassName()] = props.disabled;
    this._menuId = this._menuId || guid();
    classes[prefixCls] = true;
    if (props.align) {
      classes[prefixCls + '-' + props.align.points.join('-')] = 1;
    }
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
    return (
      <li className={classSet(classes)}  {...mouseEvents}>
        <div
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
