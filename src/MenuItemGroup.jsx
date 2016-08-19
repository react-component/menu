import React, { PropTypes } from 'react';

const MenuItemGroup = React.createClass({
  propTypes: {
    renderMenuItem: PropTypes.func,
    index: PropTypes.number,
    className: PropTypes.string,
    rootPrefixCls: PropTypes.string,
  },

  getDefaultProps() {
    return {
      disabled: true,
    };
  },

  renderInnerMenuItem(item, subIndex) {
    const { renderMenuItem, index } = this.props;
    return renderMenuItem(item, index, subIndex);
  },

  render() {
    const props = this.props;
    const { className = '', rootPrefixCls } = props;
    const titleClassName = `${rootPrefixCls}-item-group-title`;
    const listClassName = `${rootPrefixCls}-item-group-list`;
    return (<li className={`${className} ${rootPrefixCls}-item-group`}>
      <div className={titleClassName}>{props.title}</div>
      <ul className={listClassName}>
        {React.Children.map(props.children, this.renderInnerMenuItem)}
      </ul>
    </li>);
  },
});

MenuItemGroup.isMenuItemGroup = true;

export default MenuItemGroup;
