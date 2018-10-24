import React from 'react';
import PropTypes from 'prop-types';
import { menuAllProps } from './util';

class MenuItemGroup extends React.Component {
  static propTypes = {
    renderMenuItem: PropTypes.func,
    index: PropTypes.number,
    className: PropTypes.string,
    subMenuKey: PropTypes.string,
    rootPrefixCls: PropTypes.string,
  };

  static defaultProps = {
    disabled: true,
  };

  renderInnerMenuItem = (item) => {
    const { renderMenuItem, index } = this.props;
    return renderMenuItem(item, index, this.props.subMenuKey);
  }

  render() {
    const { ...props } = this.props;
    const { className = '', rootPrefixCls } = props;
    const titleClassName = `${rootPrefixCls}-item-group-title`;
    const listClassName = `${rootPrefixCls}-item-group-list`;
    const { title, children } = props;
    menuAllProps.forEach(key => delete props[key]);

    // Set onClick to null, to ignore propagated onClick event
    delete props.onClick;

    return (
      <li {...props} className={`${className} ${rootPrefixCls}-item-group`}>
        <div
          className={titleClassName}
          title={typeof title === 'string' ? title : undefined}
        >
          {title}
        </div>
        <ul className={listClassName}>
          {React.Children.map(children, this.renderInnerMenuItem)}
        </ul>
      </li>
    );
  }
}

MenuItemGroup.isMenuItemGroup = true;

export default MenuItemGroup;
