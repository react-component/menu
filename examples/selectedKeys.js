webpackJsonp([1],{

/***/ 188:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(189);


/***/ }),

/***/ 189:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_dom__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react_dom__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rc_menu__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rc_menu___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rc_menu__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_create_react_class__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_create_react_class___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_create_react_class__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rc_menu_assets_index_less__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rc_menu_assets_index_less___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rc_menu_assets_index_less__);
/* eslint no-console:0 */








var Test = __WEBPACK_IMPORTED_MODULE_3_create_react_class___default()({
  displayName: 'Test',
  getInitialState: function getInitialState() {
    return {
      destroyed: false,
      selectedKeys: [],
      openKeys: []
    };
  },
  onSelect: function onSelect(info) {
    console.log('selected ', info);
    this.setState({
      selectedKeys: info.selectedKeys
    });
  },
  onDeselect: function onDeselect(info) {
    console.log('deselect ', info);
  },
  onOpenChange: function onOpenChange(openKeys) {
    console.log('onOpenChange ', openKeys);
    this.setState({
      openKeys: openKeys
    });
  },
  onCheck: function onCheck(e) {
    var value = e.target.value;
    if (e.target.checked) {
      this.setState({
        selectedKeys: this.state.selectedKeys.concat(value)
      });
    } else {
      var selectedKeys = this.state.selectedKeys.concat();
      var index = selectedKeys.indexOf(value);
      if (value !== -1) {
        selectedKeys.splice(index, 1);
      }
      this.setState({
        selectedKeys: selectedKeys
      });
    }
  },
  onOpenCheck: function onOpenCheck(e) {
    var value = e.target.value;
    if (e.target.checked) {
      this.setState({
        openKeys: this.state.openKeys.concat(value)
      });
    } else {
      var openKeys = this.state.openKeys.concat();
      var index = openKeys.indexOf(value);
      if (value !== -1) {
        openKeys.splice(index, 1);
      }
      this.setState({
        openKeys: openKeys
      });
    }
  },
  getMenu: function getMenu() {
    return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
      __WEBPACK_IMPORTED_MODULE_2_rc_menu___default.a,
      {
        multiple: true,
        onSelect: this.onSelect,
        onDeselect: this.onDeselect,
        onOpenChange: this.onOpenChange,
        openKeys: this.state.openKeys,
        selectedKeys: this.state.selectedKeys
      },
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
        __WEBPACK_IMPORTED_MODULE_2_rc_menu__["SubMenu"],
        { key: '1', title: 'submenu1' },
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
          __WEBPACK_IMPORTED_MODULE_2_rc_menu__["Item"],
          { key: '1-1' },
          'item1-1'
        ),
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
          __WEBPACK_IMPORTED_MODULE_2_rc_menu__["Item"],
          { key: '1-2' },
          'item1-2'
        )
      ),
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
        __WEBPACK_IMPORTED_MODULE_2_rc_menu__["SubMenu"],
        { key: '2', title: 'submenu2' },
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
          __WEBPACK_IMPORTED_MODULE_2_rc_menu__["Item"],
          { key: '2-1' },
          'item2-1'
        ),
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
          __WEBPACK_IMPORTED_MODULE_2_rc_menu__["Item"],
          { key: '2-2' },
          'item2-2'
        )
      ),
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
        __WEBPACK_IMPORTED_MODULE_2_rc_menu__["Item"],
        { key: '3' },
        'item3'
      )
    );
  },
  destroy: function destroy() {
    this.setState({
      destroyed: true
    });
  },
  render: function render() {
    var _this = this;

    if (this.state.destroyed) {
      return null;
    }
    var allSelectedKeys = ['1-1', '1-2', '2-1', '2-2', '3'];
    var allOpenKeys = ['1', '2'];
    var selectedKeys = this.state.selectedKeys;
    var openKeys = this.state.openKeys;

    return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
      'div',
      null,
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
        'h2',
        null,
        'multiple selectable menu'
      ),
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
        'p',
        null,
        'selectedKeys: \xA0\xA0\xA0',
        allSelectedKeys.map(function (k) {
          return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            'label',
            { key: k },
            k,
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('input', {
              value: k,
              key: k,
              type: 'checkbox',
              onChange: _this.onCheck,
              checked: selectedKeys.indexOf(k) !== -1
            })
          );
        })
      ),
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
        'p',
        null,
        'openKeys: \xA0\xA0\xA0',
        allOpenKeys.map(function (k) {
          return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            'label',
            { key: k },
            k,
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('input', {
              value: k,
              type: 'checkbox',
              onChange: _this.onOpenCheck,
              checked: openKeys.indexOf(k) !== -1
            })
          );
        })
      ),
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
        'div',
        { style: { width: 400 } },
        this.getMenu()
      )
    );
  }
});

__WEBPACK_IMPORTED_MODULE_1_react_dom___default.a.render(__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(Test, null), document.getElementById('__react-content'));

/***/ })

},[188]);
//# sourceMappingURL=selectedKeys.js.map