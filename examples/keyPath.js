webpackJsonp([1],{

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(220);


/***/ }),

/***/ 220:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var _react = __webpack_require__(2);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDom = __webpack_require__(37);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _rcMenu = __webpack_require__(183);
	
	var _rcMenu2 = _interopRequireDefault(_rcMenu);
	
	var _createReactClass = __webpack_require__(188);
	
	var _createReactClass2 = _interopRequireDefault(_createReactClass);
	
	__webpack_require__(219);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/* eslint no-console:0 */
	
	_react2.default.createClass = _createReactClass2.default;
	
	var Test = _react2.default.createClass({
	  displayName: 'Test',
	  onClick: function onClick(info) {
	    console.log('click ', info);
	  },
	  getMenu: function getMenu() {
	    return _react2.default.createElement(
	      _rcMenu2.default,
	      {
	        onClick: this.onClick,
	        mode: 'inline'
	      },
	      _react2.default.createElement(
	        _rcMenu.SubMenu,
	        { key: '1', title: 'submenu1' },
	        _react2.default.createElement(
	          _rcMenu.Item,
	          { key: '1-1' },
	          'item1-1'
	        ),
	        _react2.default.createElement(
	          _rcMenu.Item,
	          { key: '1-2' },
	          'item1-2'
	        )
	      ),
	      _react2.default.createElement(
	        _rcMenu.SubMenu,
	        { key: '2', title: 'submenu2' },
	        _react2.default.createElement(
	          _rcMenu.Item,
	          { key: '2-1' },
	          'item2-1'
	        ),
	        _react2.default.createElement(
	          _rcMenu.Item,
	          { key: '2-2' },
	          'item2-2'
	        ),
	        _react2.default.createElement(
	          _rcMenu.SubMenu,
	          { key: '2-3', title: 'submenu2-3' },
	          _react2.default.createElement(
	            _rcMenu.Item,
	            { key: '2-3-1' },
	            'item2-3-1'
	          ),
	          _react2.default.createElement(
	            _rcMenu.Item,
	            { key: '2-3-2' },
	            'item2-3-2'
	          )
	        )
	      ),
	      _react2.default.createElement(
	        _rcMenu.Item,
	        { key: '3' },
	        'item3'
	      )
	    );
	  },
	  render: function render() {
	    return _react2.default.createElement(
	      'div',
	      null,
	      _react2.default.createElement(
	        'div',
	        { style: { width: 400 } },
	        this.getMenu()
	      )
	    );
	  }
	});
	
	_reactDom2.default.render(_react2.default.createElement(Test, null), document.getElementById('__react-content'));

/***/ })

});
//# sourceMappingURL=keyPath.js.map