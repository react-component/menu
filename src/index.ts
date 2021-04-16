import Menu, { MenuProps } from './Menu';
import MenuItem from './MenuItem';
import SubMenu from './SubMenu';
import MenuItemGroup from './MenuItemGroup';
import Divider from './sugar/Divider';

export {
  SubMenu,
  MenuItem as Item,
  MenuItem,
  MenuItemGroup,
  MenuItemGroup as ItemGroup,
  Divider,
  MenuProps,
  // SubMenuProps,
  // MenuItemProps,
  // MenuItemGroupProps,
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
