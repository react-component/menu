webpackJsonp([1],{

/***/ 191:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(192);


/***/ }),

/***/ 192:
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rc_menu__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rc_menu___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rc_menu__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rc_menu_assets_index_less__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rc_menu_assets_index_less___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_rc_menu_assets_index_less__);



/* eslint no-console:0 */







var Test = function (_React$Component) {
  __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_inherits___default()(Test, _React$Component);

  function Test() {
    var _temp, _this, _ret;

    __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck___default()(this, Test);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_possibleConstructorReturn___default()(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.state = {
      destroyed: false,
      selectedKeys: [],
      openKeys: []
    }, _this.onSelect = function (info) {
      console.log('selected ', info);
      _this.setState({
        selectedKeys: info.selectedKeys
      });
    }, _this.onOpenChange = function (openKeys) {
      console.log('onOpenChange ', openKeys);
      _this.setState({
        openKeys: openKeys
      });
    }, _this.onCheck = function (e) {
      var value = e.target.value;
      if (e.target.checked) {
        _this.setState({
          selectedKeys: _this.state.selectedKeys.concat(value)
        });
      } else {
        var selectedKeys = _this.state.selectedKeys.concat();
        var index = selectedKeys.indexOf(value);
        if (value !== -1) {
          selectedKeys.splice(index, 1);
        }
        _this.setState({
          selectedKeys: selectedKeys
        });
      }
    }, _this.onOpenCheck = function (e) {
      var value = e.target.value;
      if (e.target.checked) {
        _this.setState({
          openKeys: _this.state.openKeys.concat(value)
        });
      } else {
        var openKeys = _this.state.openKeys.concat();
        var index = openKeys.indexOf(value);
        if (value !== -1) {
          openKeys.splice(index, 1);
        }
        _this.setState({
          openKeys: openKeys
        });
      }
    }, _temp), __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_possibleConstructorReturn___default()(_this, _ret);
  }

  Test.prototype.onDeselect = function onDeselect(info) {
    console.log('deselect ', info);
  };

  Test.prototype.getMenu = function getMenu() {
    return __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
      __WEBPACK_IMPORTED_MODULE_5_rc_menu___default.a,
      {
        multiple: true,
        onSelect: this.onSelect,
        onDeselect: this.onDeselect,
        onOpenChange: this.onOpenChange,
        openKeys: this.state.openKeys,
        selectedKeys: this.state.selectedKeys
      },
      __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
        __WEBPACK_IMPORTED_MODULE_5_rc_menu__["SubMenu"],
        { key: '1', title: 'submenu1' },
        __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
          __WEBPACK_IMPORTED_MODULE_5_rc_menu__["Item"],
          { key: '1-1' },
          'item1-1'
        ),
        __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
          __WEBPACK_IMPORTED_MODULE_5_rc_menu__["Item"],
          { key: '1-2' },
          'item1-2'
        )
      ),
      __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
        __WEBPACK_IMPORTED_MODULE_5_rc_menu__["SubMenu"],
        { key: '2', title: 'submenu2' },
        __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
          __WEBPACK_IMPORTED_MODULE_5_rc_menu__["Item"],
          { key: '2-1' },
          'item2-1'
        ),
        __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
          __WEBPACK_IMPORTED_MODULE_5_rc_menu__["Item"],
          { key: '2-2' },
          'item2-2'
        )
      ),
      __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
        __WEBPACK_IMPORTED_MODULE_5_rc_menu__["Item"],
        { key: '3' },
        'item3'
      )
    );
  };

  Test.prototype.destroy = function destroy() {
    this.setState({
      destroyed: true
    });
  };

  Test.prototype.render = function render() {
    var _this2 = this;

    if (this.state.destroyed) {
      return null;
    }
    var allSelectedKeys = ['1-1', '1-2', '2-1', '2-2', '3'];
    var allOpenKeys = ['1', '2'];
    var selectedKeys = this.state.selectedKeys;
    var openKeys = this.state.openKeys;

    return __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
      'div',
      null,
      __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
        'h2',
        null,
        'multiple selectable menu'
      ),
      __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
        'p',
        null,
        'selectedKeys: \xA0\xA0\xA0',
        allSelectedKeys.map(function (k) {
          return __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
            'label',
            { key: k },
            k,
            __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement('input', {
              value: k,
              key: k,
              type: 'checkbox',
              onChange: _this2.onCheck,
              checked: selectedKeys.indexOf(k) !== -1
            })
          );
        })
      ),
      __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
        'p',
        null,
        'openKeys: \xA0\xA0\xA0',
        allOpenKeys.map(function (k) {
          return __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
            'label',
            { key: k },
            k,
            __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement('input', {
              value: k,
              type: 'checkbox',
              onChange: _this2.onOpenCheck,
              checked: openKeys.indexOf(k) !== -1
            })
          );
        })
      ),
      __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
        'div',
        { style: { width: 400 } },
        this.getMenu()
      )
    );
  };

  return Test;
}(__WEBPACK_IMPORTED_MODULE_3_react___default.a.Component);

__WEBPACK_IMPORTED_MODULE_4_react_dom___default.a.render(__WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(Test, null), document.getElementById('__react-content'));

/***/ })

},[191]);
//# sourceMappingURL=selectedKeys.js.map