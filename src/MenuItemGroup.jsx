import React, { PropTypes } from 'react';

const MenuItemGroup = React.createClass({
  propTypes: {
    className: PropTypes.string,
  },

  contextTypes: {
    saveRef: PropTypes.func,
    rootPrefixCls: PropTypes.string,
  },

  componentWillMount() {
    this.context.saveRef(this);
  },

  componentWillUpdate() {
    this.context.saveRef(this);
  },

  render() {
    const props = this.props;
    const { className = '', title, children } = props;
    const { rootPrefixCls } = this.context;
    const titleClassName = `${rootPrefixCls}-item-group-title`;
    const listClassName = `${rootPrefixCls}-item-group-list`;
    return (<li className={`${className} ${rootPrefixCls}-item-group`}>
      <div className={titleClassName}>{title}</div>
      <ul className={listClassName}>
        {children}
      </ul>
    </li>);
  },
});

MenuItemGroup.isMenuItemGroup = true;

export default MenuItemGroup;
