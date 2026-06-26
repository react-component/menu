<div align="center">
  <h1>@rc-component/menu</h1>
  <img alt="Ant Design" height="32" src="https://gw.alipayobjects.com/zos/bmw-prod/ae669a89-0c24-40ff-a91d-2b83497170f6.svg" />
  <p>🧭 Accessible React menu primitives for navigation, command surfaces, and nested item trees.</p>
</div>

<div align="center">

[![NPM version][npm-image]][npm-url] [![npm download][download-image]][download-url] [![build status][github-actions-image]][github-actions-url] [![Codecov][codecov-image]][codecov-url] [![bundle size][bundlephobia-image]][bundlephobia-url] [![dumi][dumi-image]][dumi-url]

</div>

<div align="center">
  <sub>
    Part of the <a href="https://ant.design">Ant Design</a> ecosystem
    <img
      alt="Ant Design"
      height="14"
      src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
    />
  </sub>
</div>

## Highlights

- Horizontal, vertical, and inline menu modes.
- Controlled and uncontrolled selection, open keys, and active key state.
- `items` configuration API with legacy children support.
- Sub menus, item groups, dividers, icons, overflow, popup rendering, and keyboard focus helpers.
- TypeScript definitions and semantic `classNames` / `styles` slots.
- Used by Ant Design as the shared menu foundation.

## Install

```bash
npm install @rc-component/menu
```

## Usage

```tsx | pure
import Menu, { type MenuProps } from '@rc-component/menu';

const items: MenuProps['items'] = [
  { key: 'home', label: 'Home' },
  {
    key: 'docs',
    label: 'Docs',
    children: [
      { key: 'quick-start', label: 'Quick start' },
      { key: 'api', label: 'API' },
    ],
  },
];

export default () => (
  <Menu mode="inline" items={items} defaultSelectedKeys={['home']} defaultOpenKeys={['docs']} />
);
```

```tsx | pure
import Menu, { MenuItem, SubMenu } from '@rc-component/menu';

export default () => (
  <Menu>
    <MenuItem key="1">Item 1</MenuItem>
    <SubMenu key="2" title="More">
      <MenuItem key="2-1">Item 2-1</MenuItem>
    </SubMenu>
  </Menu>
);
```

## Examples

Run the examples locally:

```bash
npm install
npm start
```

Then open the dumi dev server in your browser.

## API

### Menu

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| activeKey | `string` | - | Controlled active item key. |
| builtinPlacements | `Record<string, any>` | - | Popup alignment placements for sub menus. |
| className | `string` | - | Class name for the root menu. |
| classNames | `Partial<Record<'list' \| 'listTitle', string>>` | - | Semantic class names for menu slots. |
| defaultActiveFirst | `boolean` | `false` | Focus the first enabled item when active key is absent. |
| defaultOpenKeys | `string[]` | `[]` | Initial open sub menu keys. |
| defaultSelectedKeys | `string[]` | `[]` | Initial selected item keys. |
| defaultMotions | `Partial<Record<MenuMode \| 'other', CSSMotionProps>>` | - | Motion config by menu mode. |
| direction | `'ltr' \| 'rtl'` | - | Layout direction. |
| disabled | `boolean` | `false` | Disable all menu interactions. |
| disabledOverflow | `boolean` | `false` | Disable overflow measurement. |
| expandIcon | `ReactNode \| (props: RenderIconInfo) => ReactNode` | - | Custom sub menu expand icon. |
| forceSubMenuRender | `boolean` | `false` | Render popup sub menus before they are opened. |
| getPopupContainer | `(node: HTMLElement) => HTMLElement` | - | Container for popup sub menus. |
| inlineCollapsed | `boolean` | - | Collapse inline menu layout. |
| inlineIndent | `number` | `24` | Indent width for inline mode. |
| itemIcon | `ReactNode \| (props: RenderIconInfo) => ReactNode` | - | Custom item icon. |
| items | `ItemType[]` | - | Menu item configuration. |
| mode | `'horizontal' \| 'vertical' \| 'inline'` | `vertical` | Menu display mode. |
| motion | `CSSMotionProps` | - | Motion config for menu transitions. |
| multiple | `boolean` | `false` | Allow multiple selected items. |
| openKeys | `string[]` | - | Controlled open sub menu keys. |
| overflowedIndicator | `ReactNode` | `"..."` | Indicator rendered for overflowed items. |
| popupRender | `(node, info) => ReactNode` | - | Customize popup menu rendering. |
| prefixCls | `string` | `rc-menu` | Class name prefix. |
| rootClassName | `string` | - | Class name for the root wrapper. |
| selectable | `boolean` | `true` | Allow item selection. |
| selectedKeys | `string[]` | - | Controlled selected item keys. |
| styles | `Partial<Record<'list' \| 'listTitle', CSSProperties>>` | - | Semantic styles for menu slots. |
| subMenuCloseDelay | `number` | `0.1` | Delay in seconds before closing popup sub menus. |
| subMenuOpenDelay | `number` | `0.1` | Delay in seconds before opening popup sub menus. |
| triggerSubMenuAction | `'click' \| 'hover'` | `hover` | Interaction that opens sub menus. |
| onClick | `(info: MenuInfo) => void` | - | Triggered when an item is clicked. |
| onDeselect | `(info: SelectInfo) => void` | - | Triggered when an item is deselected. |
| onOpenChange | `(openKeys: string[]) => void` | - | Triggered when open keys change. |
| onSelect | `(info: SelectInfo) => void` | - | Triggered when an item is selected. |

### ItemType

```ts
type ItemType =
  | {
      type?: 'item';
      // Item keys accept React.Key and are normalized to strings in event info.
      key: React.Key;
      label?: React.ReactNode;
      disabled?: boolean;
      itemIcon?: RenderIconType;
      extra?: React.ReactNode;
    }
  | {
      type?: 'submenu';
      // Sub menu keys are strings to match openKeys/defaultOpenKeys.
      key: string;
      label?: React.ReactNode;
      children: ItemType[];
      disabled?: boolean;
    }
  | {
      type: 'group';
      label?: React.ReactNode;
      children?: ItemType[];
    }
  | {
      type: 'divider';
    };
```

### Ref

| Method | Type | Description |
| --- | --- | --- |
| `focus` | `(options?: FocusOptions) => void` | Focus the active item or first enabled item. |
| `findItem` | `({ key: string }) => HTMLElement \| null` | Find the DOM element for an item key. |
| `list` | `HTMLUListElement` | Root menu list element. |

## Development

```bash
npm install
npm start
npm test
npm run tsc
npm run compile
npm run build
```

## Release

The package is published with [`@rc-component/np`](https://github.com/react-component/np):

```bash
npm run prepublishOnly
```

This runs the package build before the release helper. The `postpublish` script also syncs `@rc-component/menu` to tnpm after publishing.

## License

`@rc-component/menu` is released under the MIT license.

[npm-image]: https://img.shields.io/npm/v/@rc-component/menu.svg?style=flat-square
[npm-url]: https://npmjs.org/package/@rc-component/menu
[github-actions-image]: https://github.com/react-component/menu/actions/workflows/react-component-ci.yml/badge.svg
[github-actions-url]: https://github.com/react-component/menu/actions/workflows/react-component-ci.yml
[codecov-image]: https://img.shields.io/codecov/c/github/react-component/menu/master.svg?style=flat-square
[codecov-url]: https://app.codecov.io/gh/react-component/menu
[download-image]: https://img.shields.io/npm/dm/@rc-component/menu.svg?style=flat-square
[download-url]: https://npmjs.org/package/@rc-component/menu
[bundlephobia-url]: https://bundlephobia.com/package/@rc-component/menu
[bundlephobia-image]: https://img.shields.io/bundlephobia/minzip/@rc-component/menu?style=flat-square
[dumi-url]: https://github.com/umijs/dumi
[dumi-image]: https://img.shields.io/badge/docs%20by-dumi-blue?style=flat-square
