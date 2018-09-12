webpackJsonp([7],{

/***/ 182:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(183);


/***/ }),

/***/ 183:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_inherits__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_inherits___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_inherits__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react_dom__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_react_dom__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rc_menu__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rc_menu___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_rc_menu__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rc_menu_assets_index_less__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rc_menu_assets_index_less___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_rc_menu_assets_index_less__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_css_animation__ = __webpack_require__(53);




/* eslint no-console:0 */






var getSvgIcon = function getSvgIcon() {
  var style = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var text = arguments[1];

  if (text) {
    return __WEBPACK_IMPORTED_MODULE_4_react__["createElement"](
      'i',
      { style: style },
      text
    );
  }
  var path = 'M869 487.8L491.2 159.9c-2.9-2.5-6.6-3.9-10.5-3.9h' + '-88.5c-7.4 0-10.8 9.2-5.2 14l350.2 304H152c-4.4 0-8 3.6-8 8v' + '60c0 4.4 3.6 8 8 8h585.1L386.9 854c-5.6 4.9-2.2 14 5.2 14h91' + '.5c1.9 0 3.8-0.7 5.2-2L869 536.2c14.7-12.8 14.7-35.6 0-48.4z';
  return __WEBPACK_IMPORTED_MODULE_4_react__["createElement"](
    'i',
    { style: style },
    __WEBPACK_IMPORTED_MODULE_4_react__["createElement"](
      'svg',
      {
        viewBox: '0 0 1024 1024',
        width: '1em',
        height: '1em',
        fill: 'currentColor',
        style: { verticalAlign: '-.125em' }
      },
      __WEBPACK_IMPORTED_MODULE_4_react__["createElement"]('path', { d: path })
    )
  );
};

function itemIcon(props) {
  return getSvgIcon({
    position: 'absolute',
    right: '1rem',
    color: props.isSelected ? 'pink' : 'inherit'
  });
}

function expandIcon(props) {
  return getSvgIcon({
    position: 'absolute',
    right: '1rem',
    color: 'lightblue',
    transform: 'rotate(' + (props.isOpen ? 90 : 0) + 'deg)'
  });
}

var animation = {
  enter: function enter(node, done) {
    var height = void 0;
    return Object(__WEBPACK_IMPORTED_MODULE_8_css_animation__["a" /* default */])(node, 'rc-menu-collapse', {
      start: function start() {
        height = node.offsetHeight;
        node.style.height = 0;
      },
      active: function active() {
        node.style.height = height + 'px';
      },
      end: function end() {
        node.style.height = '';
        done();
      }
    });
  },
  appear: function appear() {
    return this.enter.apply(this, arguments);
  },
  leave: function leave(node, done) {
    return Object(__WEBPACK_IMPORTED_MODULE_8_css_animation__["a" /* default */])(node, 'rc-menu-collapse', {
      start: function start() {
        node.style.height = node.offsetHeight + 'px';
      },
      active: function active() {
        node.style.height = 0;
      },
      end: function end() {
        node.style.height = '';
        done();
      }
    });
  }
};

var Demo = function (_React$Component) {
  __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_inherits___default()(Demo, _React$Component);

  function Demo() {
    var _temp, _this, _ret;

    __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default()(this, Demo);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn___default()(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.onOpenChange = function (value) {
      console.log('onOpenChange', value);
    }, _this.handleClick = function (info) {
      console.log('clicked ' + info.key);
      console.log(info);
    }, _this.renderNestSubMenu = function () {
      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      return __WEBPACK_IMPORTED_MODULE_4_react__["createElement"](
        __WEBPACK_IMPORTED_MODULE_6_rc_menu__["SubMenu"],
        __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({ title: __WEBPACK_IMPORTED_MODULE_4_react__["createElement"](
            'span',
            null,
            'offset sub menu 2'
          ), key: '4', popupOffset: [10, 15] }, props),
        __WEBPACK_IMPORTED_MODULE_4_react__["createElement"](
          __WEBPACK_IMPORTED_MODULE_6_rc_menu__["Item"],
          { key: '4-1' },
          'inner inner'
        ),
        __WEBPACK_IMPORTED_MODULE_4_react__["createElement"](__WEBPACK_IMPORTED_MODULE_6_rc_menu__["Divider"], null),
        __WEBPACK_IMPORTED_MODULE_4_react__["createElement"](
          __WEBPACK_IMPORTED_MODULE_6_rc_menu__["SubMenu"],
          {
            key: '4-2',
            title: __WEBPACK_IMPORTED_MODULE_4_react__["createElement"](
              'span',
              null,
              'sub menu 3'
            )
          },
          __WEBPACK_IMPORTED_MODULE_4_react__["createElement"](
            __WEBPACK_IMPORTED_MODULE_6_rc_menu__["SubMenu"],
            { title: 'sub 4-2-0', key: '4-2-0' },
            __WEBPACK_IMPORTED_MODULE_4_react__["createElement"](
              __WEBPACK_IMPORTED_MODULE_6_rc_menu__["Item"],
              { key: '4-2-0-1' },
              'inner inner'
            ),
            __WEBPACK_IMPORTED_MODULE_4_react__["createElement"](
              __WEBPACK_IMPORTED_MODULE_6_rc_menu__["Item"],
              { key: '4-2-0-2' },
              'inner inner2'
            )
          ),
          __WEBPACK_IMPORTED_MODULE_4_react__["createElement"](
            __WEBPACK_IMPORTED_MODULE_6_rc_menu__["Item"],
            { key: '4-2-1' },
            'inn'
          ),
          __WEBPACK_IMPORTED_MODULE_4_react__["createElement"](
            __WEBPACK_IMPORTED_MODULE_6_rc_menu__["SubMenu"],
            { title: __WEBPACK_IMPORTED_MODULE_4_react__["createElement"](
                'span',
                null,
                'sub menu 4'
              ), key: '4-2-2' },
            __WEBPACK_IMPORTED_MODULE_4_react__["createElement"](
              __WEBPACK_IMPORTED_MODULE_6_rc_menu__["Item"],
              { key: '4-2-2-1' },
              'inner inner'
            ),
            __WEBPACK_IMPORTED_MODULE_4_react__["createElement"](
              __WEBPACK_IMPORTED_MODULE_6_rc_menu__["Item"],
              { key: '4-2-2-2' },
              'inner inner2'
            )
          ),
          __WEBPACK_IMPORTED_MODULE_4_react__["createElement"](
            __WEBPACK_IMPORTED_MODULE_6_rc_menu__["SubMenu"],
            { title: 'sub 4-2-3', key: '4-2-3' },
            __WEBPACK_IMPORTED_MODULE_4_react__["createElement"](
              __WEBPACK_IMPORTED_MODULE_6_rc_menu__["Item"],
              { key: '4-2-3-1' },
              'inner inner'
            ),
            __WEBPACK_IMPORTED_MODULE_4_react__["createElement"](
              __WEBPACK_IMPORTED_MODULE_6_rc_menu__["Item"],
              { key: '4-2-3-2' },
              'inner inner2'
            )
          )
        )
      );
    }, _this.renderCommonMenu = function () {
      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      return __WEBPACK_IMPORTED_MODULE_4_react__["createElement"](
        __WEBPACK_IMPORTED_MODULE_6_rc_menu___default.a,
        __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({ onClick: _this.handleClick, onOpenChange: _this.onOpenChange }, props),
        __WEBPACK_IMPORTED_MODULE_4_react__["createElement"](
          __WEBPACK_IMPORTED_MODULE_6_rc_menu__["SubMenu"],
          { title: __WEBPACK_IMPORTED_MODULE_4_react__["createElement"](
              'span',
              null,
              'sub menu'
            ), key: '1' },
          __WEBPACK_IMPORTED_MODULE_4_react__["createElement"](
            __WEBPACK_IMPORTED_MODULE_6_rc_menu__["Item"],
            { key: '1-1' },
            '0-1'
          ),
          __WEBPACK_IMPORTED_MODULE_4_react__["createElement"](
            __WEBPACK_IMPORTED_MODULE_6_rc_menu__["Item"],
            { key: '1-2' },
            '0-2'
          )
        ),
        _this.renderNestSubMenu(),
        __WEBPACK_IMPORTED_MODULE_4_react__["createElement"](
          __WEBPACK_IMPORTED_MODULE_6_rc_menu__["Item"],
          { key: '2' },
          '1'
        ),
        __WEBPACK_IMPORTED_MODULE_4_react__["createElement"](
          __WEBPACK_IMPORTED_MODULE_6_rc_menu__["Item"],
          { key: '3' },
          'outer'
        ),
        __WEBPACK_IMPORTED_MODULE_4_react__["createElement"](
          __WEBPACK_IMPORTED_MODULE_6_rc_menu__["Item"],
          { disabled: true },
          'disabled'
        ),
        __WEBPACK_IMPORTED_MODULE_4_react__["createElement"](
          __WEBPACK_IMPORTED_MODULE_6_rc_menu__["Item"],
          { key: '5' },
          'outer3'
        )
      );
    }, _temp), __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn___default()(_this, _ret);
  }

  Demo.prototype.render = function render() {
    var verticalMenu = this.renderCommonMenu({
      mode: 'vertical',
      openAnimation: 'zoom',
      itemIcon: itemIcon,
      expandIcon: expandIcon
    });

    var inlineMenu = this.renderCommonMenu({
      mode: 'inline',
      defaultOpenKeys: ['1'],
      openAnimation: animation,
      itemIcon: itemIcon,
      expandIcon: expandIcon
    });

    return __WEBPACK_IMPORTED_MODULE_4_react__["createElement"](
      'div',
      { style: { margin: 20 } },
      __WEBPACK_IMPORTED_MODULE_4_react__["createElement"](
        'h2',
        null,
        'Antd menu - Custom icon'
      ),
      __WEBPACK_IMPORTED_MODULE_4_react__["createElement"](
        'div',
        null,
        __WEBPACK_IMPORTED_MODULE_4_react__["createElement"](
          'h3',
          null,
          'vertical'
        ),
        __WEBPACK_IMPORTED_MODULE_4_react__["createElement"](
          'div',
          { style: { margin: 20, width: 200 } },
          verticalMenu
        ),
        __WEBPACK_IMPORTED_MODULE_4_react__["createElement"](
          'h3',
          null,
          'inline'
        ),
        __WEBPACK_IMPORTED_MODULE_4_react__["createElement"](
          'div',
          { style: { margin: 20, width: 400 } },
          inlineMenu
        )
      )
    );
  };

  return Demo;
}(__WEBPACK_IMPORTED_MODULE_4_react__["Component"]);

__WEBPACK_IMPORTED_MODULE_5_react_dom___default.a.render(__WEBPACK_IMPORTED_MODULE_4_react__["createElement"](Demo, null), document.getElementById('__react-content'));

/***/ })

},[182]);
//# sourceMappingURL=custom-icon.js.map