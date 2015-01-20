# rc-menu
---

react menu component. port from https://github.com/kissyteam/menu


[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![gemnasium deps][gemnasium-image]][gemnasium-url]
[![node version][node-image]][node-url]
[![npm download][download-image]][download-url]
[![Sauce Test Status](https://saucelabs.com/buildstatus/rc-menu)](https://saucelabs.com/u/rc-menu)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/rc-menu.svg)](https://saucelabs.com/u/rc-menu)

[npm-image]: http://img.shields.io/npm/v/rc-menu.svg?style=flat-square
[npm-url]: http://npmjs.org/package/rc-menu
[travis-image]: https://img.shields.io/travis/react-component/menu.svg?style=flat-square
[travis-url]: https://travis-ci.org/react-component/menu
[coveralls-image]: https://img.shields.io/coveralls/react-component/menu.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/react-component/menu?branch=master
[gemnasium-image]: http://img.shields.io/gemnasium/react-component/menu.svg?style=flat-square
[gemnasium-url]: https://gemnasium.com/react-component/menu
[node-image]: https://img.shields.io/badge/node.js-%3E=_0.10-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/rc-menu.svg?style=flat-square
[download-url]: https://npmjs.org/package/rc-menu


## Screenshot

![alt](https://tfsimg.alipay.com/images/T19vReXg0oXXXXXXXX.png)


## Usage

```js
var Menu = require('rc-menu');
var SubMenu = Menu.SubMenu;
var MenuItem = Menu.Item;
React.render(<Menu><MenuItem>1</MenuItem><SubMenu title="2"><MenuItem>2-1</MenuItem></SubMenu></Menu>, container);
```

## install

[![rc-menu](https://nodei.co/npm/rc-menu.png)](https://npmjs.org/package/rc-menu)

## API

### menu props

<table class="table table-bordered table-striped">
    <thead>
    <tr>
        <th style="width: 100px;">name</th>
        <th style="width: 50px;">type</th>
        <th style="width: 50px;">default</th>
        <th>description</th>
    </tr>
    </thead>
    <tbody>
        <tr>
          <td>className</td>
          <td>String</td>
          <td></td>
          <td>additional css class of root dom node</td>
        </tr>
        <tr>
            <td>activeKey</td>
            <td>Object</td>
            <th>first active item's key</th>
            <td>same with active tabPanel's key</td>
        </tr>
        <tr>
            <td>onSelect</td>
            <td>Function(key:String)</td>
            <th></th>
            <td>function called with selected menu item's key as param</td>
        </tr>
    </tbody>
</table>

### menu item props

<table class="table table-bordered table-striped">
    <thead>
    <tr>
        <th style="width: 100px;">name</th>
        <th style="width: 50px;">type</th>
        <th style="width: 50px;">default</th>
        <th>description</th>
    </tr>
    </thead>
    <tbody>
        <tr>
          <td>className</td>
          <td>String</td>
          <td></td>
          <td>additional css class of root dom node</td>
        </tr>
        <tr>
            <td>disabled</td>
            <td>Boolean</td>
            <th>false</th>
            <td>no effect for click or keydown for this item</td>
        </tr>
        <tr>
            <td>key</td>
            <td>Object</td>
            <th></th>
            <td>corresponding to activeKey</td>
        </tr>
    </tbody>
</table>


### sub menu props

<table class="table table-bordered table-striped">
    <thead>
    <tr>
        <th style="width: 100px;">name</th>
        <th style="width: 50px;">type</th>
        <th style="width: 50px;">default</th>
        <th>description</th>
    </tr>
    </thead>
    <tbody>
        <tr>
          <td>className</td>
          <td>String</td>
          <td></td>
          <td>additional css class of root dom node</td>
        </tr>
        <tr>
          <td>title</td>
          <td>String/ReactElement</td>
          <td></td>
          <td>sub menu's content</td>
        </tr>
        <tr>
            <td>key</td>
            <td>Object</td>
            <th></th>
            <td>corresponding to activeKey</td>
        </tr>
        <tr>
            <td>disabled</td>
            <td>Boolean</td>
            <th>false</th>
            <td>no effect for click or keydown for this item</td>
        </tr>
        <tr>
            <td>openOnHover</td>
            <td>Boolean</td>
            <th>true</th>
            <td>whether show second sub menu on hover</td>
        </tr>
    </tbody>
</table>

## Development

```
npm install
npm start
```

## Example

http://localhost:8001/examples/index.md

online example: http://spmjs.io/docs/rc-menu/examples/


## Test Case

http://localhost:8000/tests/runner.html?coverage

## Coverage

http://localhost:8000/node_modules/rc-server/node_modules/node-jscover/lib/front-end/jscoverage.html?w=http://localhost:8000/tests/runner.html?coverage

## License

rc-menu is released under the MIT license.