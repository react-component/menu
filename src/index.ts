import Menu, { MenuProps } from './Menu';
import MenuItem, { MenuItemProps } from './MenuItem';
import SubMenu, { SubMenuProps } from './SubMenu';
import MenuItemGroup, { MenuItemGroupProps } from './MenuItemGroup';
import Divider from './Divider';

export {
  SubMenu,
  MenuItem as Item,
  MenuItem,
  MenuItemGroup,
  MenuItemGroup as ItemGroup,
  Divider,
  MenuProps,
  SubMenuProps,
  MenuItemProps,
  MenuItemGroupProps,
};

type MenuType = typeof Menu & {
  Item: typeof MenuItem;
  SubMenu: typeof SubMenu;
  ItemGroup: typeof MenuItemGroup;
  Divider: typeof Divider;
};

const ExportMenu = Menu as MenuType;

ExportMenu.Item = MenuItem;
ExportMenu.SubMenu = SubMenu;
ExportMenu.ItemGroup = MenuItemGroup;
ExportMenu.Divider = Divider;

export default ExportMenu;
