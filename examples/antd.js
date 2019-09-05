webpackJsonp([8],{

/***/ 76:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(77);


/***/ }),

/***/ 77:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_possibleConstructorReturn__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_possibleConstructorReturn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_possibleConstructorReturn__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_inherits__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_inherits___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_inherits__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_react_dom__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_react_dom__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_prop_types__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rc_menu__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rc_menu___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_rc_menu__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rc_menu_assets_index_less__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rc_menu_assets_index_less___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_rc_menu_assets_index_less__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_css_animation__ = __webpack_require__(50);



/* eslint no-console:0 */








function handleClick(info) {
  console.log('clicked ' + info.key);
  console.log(info);
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

var reactContainer = document.getElementById('__react-content');

var nestSubMenu = __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
  __WEBPACK_IMPORTED_MODULE_6_rc_menu__["SubMenu"],
  {
    title: __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
      'span',
      { className: 'submenu-title-wrapper' },
      'offset sub menu 2'
    ),
    key: '4',
    popupOffset: [10, 15]
  },
  __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
    __WEBPACK_IMPORTED_MODULE_6_rc_menu__["Item"],
    { key: '4-1' },
    'inner inner'
  ),
  __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_6_rc_menu__["Divider"], null),
  __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
    __WEBPACK_IMPORTED_MODULE_6_rc_menu__["SubMenu"],
    {
      key: '4-2',
      title: __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
        'span',
        { className: 'submenu-title-wrapper' },
        'sub menu 1'
      )
    },
    __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
      __WEBPACK_IMPORTED_MODULE_6_rc_menu__["SubMenu"],
      { title: __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
          'span',
          { className: 'submenu-title-wrapper' },
          'sub 4-2-0'
        ), key: '4-2-0' },
      __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
        __WEBPACK_IMPORTED_MODULE_6_rc_menu__["Item"],
        { key: '4-2-0-1' },
        'inner inner'
      ),
      __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
        __WEBPACK_IMPORTED_MODULE_6_rc_menu__["Item"],
        { key: '4-2-0-2' },
        'inner inner2'
      )
    ),
    __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
      __WEBPACK_IMPORTED_MODULE_6_rc_menu__["Item"],
      { key: '4-2-1' },
      'inn'
    ),
    __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
      __WEBPACK_IMPORTED_MODULE_6_rc_menu__["SubMenu"],
      { title: __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
          'span',
          { className: 'submenu-title-wrapper' },
          'sub menu 4'
        ), key: '4-2-2' },
      __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
        __WEBPACK_IMPORTED_MODULE_6_rc_menu__["Item"],
        { key: '4-2-2-1' },
        'inner inner'
      ),
      __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
        __WEBPACK_IMPORTED_MODULE_6_rc_menu__["Item"],
        { key: '4-2-2-2' },
        'inner inner2'
      )
    ),
    __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
      __WEBPACK_IMPORTED_MODULE_6_rc_menu__["SubMenu"],
      { title: __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
          'span',
          { className: 'submenu-title-wrapper' },
          'sub menu 3'
        ), key: '4-2-3' },
      __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
        __WEBPACK_IMPORTED_MODULE_6_rc_menu__["Item"],
        { key: '4-2-3-1' },
        'inner inner'
      ),
      __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
        __WEBPACK_IMPORTED_MODULE_6_rc_menu__["Item"],
        { key: '4-2-3-2' },
        'inner inner2'
      )
    )
  )
);

function onOpenChange(value) {
  console.log('onOpenChange', value);
}

var children1 = [__WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
  __WEBPACK_IMPORTED_MODULE_6_rc_menu__["SubMenu"],
  { title: __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
      'span',
      { className: 'submenu-title-wrapper' },
      'sub menu'
    ), key: '1' },
  __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
    __WEBPACK_IMPORTED_MODULE_6_rc_menu__["Item"],
    { key: '1-1' },
    '0-1'
  ),
  __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
    __WEBPACK_IMPORTED_MODULE_6_rc_menu__["Item"],
    { key: '1-2' },
    '0-2'
  )
), nestSubMenu, __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
  __WEBPACK_IMPORTED_MODULE_6_rc_menu__["Item"],
  { key: '2' },
  '1'
), __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
  __WEBPACK_IMPORTED_MODULE_6_rc_menu__["Item"],
  { key: '3' },
  'outer'
), __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
  __WEBPACK_IMPORTED_MODULE_6_rc_menu__["Item"],
  { key: '5', disabled: true },
  'disabled'
), __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
  __WEBPACK_IMPORTED_MODULE_6_rc_menu__["Item"],
  { key: '6' },
  'outer3'
)];

var children2 = [__WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
  __WEBPACK_IMPORTED_MODULE_6_rc_menu__["SubMenu"],
  { title: __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
      'span',
      { className: 'submenu-title-wrapper' },
      'sub menu'
    ), key: '1' },
  __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
    __WEBPACK_IMPORTED_MODULE_6_rc_menu__["Item"],
    { key: '1-1' },
    '0-1'
  ),
  __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
    __WEBPACK_IMPORTED_MODULE_6_rc_menu__["Item"],
    { key: '1-2' },
    '0-2'
  )
), __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
  __WEBPACK_IMPORTED_MODULE_6_rc_menu__["Item"],
  { key: '2' },
  '1'
), __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
  __WEBPACK_IMPORTED_MODULE_6_rc_menu__["Item"],
  { key: '3' },
  'outer'
)];

var customizeIndicator = __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
  'span',
  null,
  'Add More Items'
);

var CommonMenu = function (_React$Component) {
  __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_inherits___default()(CommonMenu, _React$Component);

  function CommonMenu() {
    var _temp, _this, _ret;

    __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck___default()(this, CommonMenu);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_possibleConstructorReturn___default()(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.state = {
      children: children1,
      overflowedIndicator: undefined
    }, _this.toggleChildren = function () {
      _this.setState({
        children: _this.state.children === children1 ? children2 : children1
      });
    }, _this.toggleOverflowedIndicator = function () {
      _this.setState({
        overflowedIndicator: _this.state.overflowedIndicator === undefined ? customizeIndicator : undefined
      });
    }, _temp), __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_possibleConstructorReturn___default()(_this, _ret);
  }

  CommonMenu.prototype.render = function render() {
    var triggerSubMenuAction = this.props.triggerSubMenuAction;
    var _state = this.state,
        children = _state.children,
        overflowedIndicator = _state.overflowedIndicator;

    return __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
      'div',
      null,
      this.props.updateChildrenAndOverflowedIndicator && __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
        'div',
        null,
        __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
          'button',
          { onClick: this.toggleChildren },
          'toggle children'
        ),
        __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
          'button',
          { onClick: this.toggleOverflowedIndicator },
          'toggle overflowedIndicator'
        )
      ),
      __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
        __WEBPACK_IMPORTED_MODULE_6_rc_menu___default.a,
        {
          onClick: handleClick,
          triggerSubMenuAction: triggerSubMenuAction,
          onOpenChange: onOpenChange,
          selectedKeys: ['3'],
          mode: this.props.mode,
          openAnimation: this.props.openAnimation,
          defaultOpenKeys: this.props.defaultOpenKeys,
          overflowedIndicator: overflowedIndicator
        },
        children
      )
    );
  };

  return CommonMenu;
}(__WEBPACK_IMPORTED_MODULE_3_react___default.a.Component);

CommonMenu.propTypes = {
  mode: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.string,
  openAnimation: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.oneOfType([__WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.string, __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.object]),
  triggerSubMenuAction: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.string,
  defaultOpenKeys: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.arrayOf(__WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.string),
  updateChildrenAndOverflowedIndicator: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.bool
};

function render(container) {
  var horizontalMenu = __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(CommonMenu, {
    mode: 'horizontal'
    // use openTransition for antd
    , openAnimation: 'slide-up'
  });

  var horizontalMenu2 = __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(CommonMenu, {
    mode: 'horizontal'
    // use openTransition for antd
    , openAnimation: 'slide-up',
    triggerSubMenuAction: 'click',
    updateChildrenAndOverflowedIndicator: true
  });

  var verticalMenu = __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(CommonMenu, {
    mode: 'vertical',
    openAnimation: 'zoom'
  });

  var inlineMenu = __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(CommonMenu, {
    mode: 'inline',
    defaultOpenKeys: ['1'],
    openAnimation: animation
  });

  __WEBPACK_IMPORTED_MODULE_4_react_dom___default.a.render(__WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
    'div',
    { style: { margin: 20 } },
    __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
      'h2',
      null,
      'antd menu'
    ),
    __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
      'div',
      null,
      __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
        'h3',
        null,
        'horizontal'
      ),
      __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
        'div',
        { style: { margin: 20 } },
        horizontalMenu
      ),
      __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
        'h3',
        null,
        'horizontal and click'
      ),
      __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
        'div',
        { style: { margin: 20 } },
        horizontalMenu2
      ),
      __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
        'h3',
        null,
        'vertical'
      ),
      __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
        'div',
        { style: { margin: 20, width: 200 } },
        verticalMenu
      ),
      __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
        'h3',
        null,
        'inline'
      ),
      __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
        'div',
        { style: { margin: 20, width: 400 } },
        inlineMenu
      )
    )
  ), container);
}

render(reactContainer);

/***/ })

},[76]);
//# sourceMappingURL=antd.js.map