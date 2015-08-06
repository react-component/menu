
import React from 'react';

class MenuItemGroup extends React.Component {
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
        {React.Children.map(props.children, props.renderMenuItem)}
      </ul>
    </li>);
  }
}

MenuItemGroup.defaultProps = {
  // skip key down loop
  disabled: true,
};

export default MenuItemGroup;
