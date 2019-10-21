import * as React from 'react';
import { menuAllProps } from './util';
import { MenuClickEventHandler } from './interface';

export interface MenuItemGroupProps {
  disabled?: boolean;
  renderMenuItem?: (
    item: React.ReactElement,
    index: number,
    key: string,
  ) => React.ReactElement;
  index?: number;
  className?: string;
  subMenuKey?: string;
  rootPrefixCls?: string;
  title?: string;
  onClick?: MenuClickEventHandler;
}

class MenuItemGroup extends React.Component<MenuItemGroupProps> {
  static isMenuItemGroup = true;

  static defaultProps = {
    disabled: true,
  };

  renderInnerMenuItem = (item: React.ReactElement) => {
    const { renderMenuItem, index } = this.props;
    return renderMenuItem(item, index, this.props.subMenuKey);
  };

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
      <li
        {...(props as any)}
        className={`${className} ${rootPrefixCls}-item-group`}
      >
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

export default MenuItemGroup;
