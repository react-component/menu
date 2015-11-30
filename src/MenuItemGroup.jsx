import React, {PropTypes} from 'react';


const MenuItemGroup = React.createClass({
  propTypes: {
    renderMenuItem: PropTypes.func,
    index: PropTypes.number,
  },

  getDefaultProps() {
    return {
      disabled: true,
    };
  },

  renderInnerMenuItem(item, subIndex) {
    const renderMenuItem = this.props.renderMenuItem;
    return renderMenuItem(item, this.props.index, subIndex);
  },

  render() {
    const props = this.props;
    let className = props.className || '';
    const rootPrefixCls = props.rootPrefixCls;

    className += ` ${rootPrefixCls}-item-group`;
    const titleClassName = `${rootPrefixCls}-item-group-title`;
    const listClassName = `${rootPrefixCls}-item-group-list`;
    return (<li className={className}>
      <div className={titleClassName}>{props.title}</div>
      <ul className={listClassName}>
        {React.Children.map(props.children, this.renderInnerMenuItem)}
      </ul>
    </li>);
  },
});

export default MenuItemGroup;
