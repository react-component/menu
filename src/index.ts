import Menu from './Menu';
import MenuItem from './MenuItem';
import SubMenu from './SubMenu';
import MenuItemGroup from './MenuItemGroup';
import { useFullPath as useOriginFullPath } from './context/PathContext';
import Divider from './Divider';
import type { MenuProps } from './Menu';
import type { MenuItemProps } from './MenuItem';
import type { SubMenuProps } from './SubMenu';
import type { MenuItemGroupProps } from './MenuItemGroup';
import type { MenuRef } from './interface';

/** @private Only used for antd internal. Do not use in your production. */
const useFullPath = useOriginFullPath;

export {
  SubMenu,
  MenuItem as Item,
  MenuItem,
  MenuItemGroup,
  MenuItemGroup as ItemGroup,
  Divider,
  useFullPath,
};

export type {
  MenuProps,
  SubMenuProps,
  MenuItemProps,
  MenuItemGroupProps,
  MenuRef,
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
