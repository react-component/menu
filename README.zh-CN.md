<div align="center">
  <h1>@rc-component/menu</h1>
  <p><sub><img alt="Ant Design" height="14" src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" style="vertical-align: -0.125em;" /> Ant Design 生态的一部分。</sub></p>
  <p>🧭 React 菜单组件，支持水平、垂直、内联、分组和子菜单。</p>
</div>

<p align="center"><a href="./README.md">English</a> | 简体中文</p>

<div align="center">

[![NPM version][npm-image]][npm-url] [![npm download][download-image]][download-url] [![build status][github-actions-image]][github-actions-url] [![Codecov][codecov-image]][codecov-url] [![bundle size][bundlephobia-image]][bundlephobia-url] [![dumi][dumi-image]][dumi-url]

</div>

## 特性

- 水平、垂直和内联菜单模式。
- 受控和非受控选择、打开键和活动键状态。
- `items` 配置 API 具有旧子支持。
- 子菜单、项目组、分隔线、图标、溢出、弹层渲染和键盘焦点助手。
- 提供 TypeScript 类型定义和语义化 `classNames` / `styles` 插槽。
- 被 Ant Design 用作共享的 menu 基础能力。

## 安装

```bash
npm install @rc-component/menu
```

## 使用

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

## 示例

运行本地 dumi 站点：

```bash
npm install
npm start
```

然后打开 `http://localhost:8000`。

## API

### Menu

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| activeKey | `string` | - | 受控活动项目键。 |
| builtinPlacements | `Record<string, any>` | - | 子菜单的弹层对齐位置。 |
| className | `string` | - | 根菜单的 className。 |
| classNames | `Partial<Record<'list' \| 'listTitle', string>>` | - | 菜单槽的语义 className。 |
| defaultActiveFirst | `boolean` | `false` | 当活动键不存在时，聚焦第一个启用的项目。 |
| defaultOpenKeys | `string[]` | `[]` | 初始打开子菜单键。 |
| defaultSelectedKeys | `string[]` | `[]` | 初始选定项目键。 |
| defaultMotions | `Partial<Record<MenuMode \| 'other', CSSMotionProps>>` | - | 通过菜单模式进行运动配置。 |
| direction | `'ltr' \| 'rtl'` | - | Layout direction. |
| disabled | `boolean` | `false` | 禁用所有菜单交互。 |
| disabledOverflow | `boolean` | `false` | 禁用溢出测量。 |
| expandIcon | `ReactNode \| (props: RenderIconInfo) => ReactNode` | - | 自定义子菜单展开图标。 |
| forceSubMenuRender | `boolean` | `false` | 在打开弹层子菜单之前渲染它们。 |
| getPopupContainer | `(node: HTMLElement) => HTMLElement` | - | 弹层子菜单的容器。 |
| inlineCollapsed | `boolean` | - | 折叠内联菜单布局。 |
| inlineIndent | `number` | `24` | 内联模式的缩进宽度。 |
| itemIcon | `ReactNode \| (props: RenderIconInfo) => ReactNode` | - | 自定义项目图标。 |
| items | `ItemType[]` | - | 菜单项配置。 |
| mode | `'horizontal' \| 'vertical' \| 'inline'` | `vertical` | 菜单展示模式。 |
| motion | `CSSMotionProps` | - | 菜单转换的运动配置。 |
| multiple | `boolean` | `false` | 允许选择多个项目。 |
| openKeys | `string[]` | - | 受控打开子菜单键。 |
| overflowedIndicator | `ReactNode` | `"..."` | 为溢出项目呈现的指示器。 |
| popupRender | `(node, info) => ReactNode` | - | 自定义弹层菜单渲染。 |
| prefixCls | `string` | `rc-menu` | className 前缀。 |
| rootClassName | `string` | - | 根包装器的 className。 |
| selectable | `boolean` | `true` | 允许选择项目。 |
| selectedKeys | `string[]` | - | 控制选定的项目键。 |
| styles | `Partial<Record<'list' \| 'listTitle', CSSProperties>>` | - | 菜单槽的语义样式。 |
| subMenuCloseDelay | `number` | `0.1` | 关闭弹层子菜单之前延迟几秒。 |
| subMenuOpenDelay | `number` | `0.1` | 打开弹层子菜单之前延迟几秒。 |
| triggerSubMenuAction | `'click' \| 'hover'` | `hover` | 打开子菜单的交互。 |
| onClick | `(info: MenuInfo) => void` | - | 单击某个项目时触发。 |
| onDeselect | `(info: SelectInfo) => void` | - | 取消选择某个项目时触发。 |
| onOpenChange | `(openKeys: string[]) => void` | - | 当打开键更改时触发。 |
| onSelect | `(info: SelectInfo) => void` | - | 选择项目时触发。 |

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

| Method     | 类型                                       | 说明                             |
| ---------- | ------------------------------------------ | -------------------------------- |
| `focus`    | `(options?: FocusOptions) => void`         | 聚焦活动项目或第一个启用的项目。 |
| `findItem` | `({ key: string }) => HTMLElement \| null` | 查找项目键的 DOM 元素。          |
| `list`     | `HTMLUListElement`                         | 根菜单列表元素。                 |

## 本地开发

```bash
npm install
npm start
npm test
npm run tsc
npm run compile
npm run build
```

## 发布

```bash
npm run prepublishOnly
```

包构建完成后，发布流程由 `@rc-component/np` 通过 `rc-np` 命令处理。

## 许可证

@rc-component/menu 基于 [MIT](./LICENSE) 许可证发布。

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
