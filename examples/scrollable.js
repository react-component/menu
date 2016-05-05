webpackJsonp([5],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(218);


/***/ },

/***/ 216:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },

/***/ 218:
/***/ function(module, exports, __webpack_require__) {

	/* eslint no-console:0 */
	
	'use strict';
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _react = __webpack_require__(2);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDom = __webpack_require__(33);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _rcMenu = __webpack_require__(167);
	
	var _rcMenu2 = _interopRequireDefault(_rcMenu);
	
	__webpack_require__(212);
	
	__webpack_require__(216);
	
	var children = [];
	for (var i = 0; i < 20; i++) {
	  children.push(_react2['default'].createElement(
	    _rcMenu.Item,
	    { key: i + '' },
	    i
	  ));
	}
	
	var menuStyle = {
	  width: 200,
	  height: 200,
	  overflow: 'auto'
	};
	_reactDom2['default'].render(_react2['default'].createElement(
	  'div',
	  null,
	  _react2['default'].createElement(
	    'h2',
	    null,
	    'keyboard scrollable menu'
	  ),
	  _react2['default'].createElement(
	    _rcMenu2['default'],
	    { style: menuStyle },
	    children
	  )
	), document.getElementById('__react-content'));

/***/ }

});
//# sourceMappingURL=scrollable.js.map