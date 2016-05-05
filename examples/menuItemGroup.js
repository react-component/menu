webpackJsonp([2],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(214);


/***/ },

/***/ 214:
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
	
	_reactDom2['default'].render(_react2['default'].createElement(
	  'div',
	  null,
	  _react2['default'].createElement(
	    'h2',
	    null,
	    'menu item group'
	  ),
	  _react2['default'].createElement(
	    _rcMenu2['default'],
	    { style: { margin: 20, width: 300 } },
	    _react2['default'].createElement(
	      _rcMenu.ItemGroup,
	      { title: 'group 1', key: '2' },
	      _react2['default'].createElement(
	        _rcMenu.Item,
	        { key: '21' },
	        '2'
	      ),
	      _react2['default'].createElement(
	        _rcMenu.Item,
	        { key: '22' },
	        '3'
	      )
	    ),
	    _react2['default'].createElement(
	      _rcMenu.ItemGroup,
	      { title: 'group 2', key: '3' },
	      _react2['default'].createElement(
	        _rcMenu.Item,
	        { key: '31' },
	        '4'
	      ),
	      _react2['default'].createElement(
	        _rcMenu.Item,
	        { key: '32' },
	        '5'
	      )
	    )
	  )
	), document.getElementById('__react-content'));

/***/ }

});
//# sourceMappingURL=menuItemGroup.js.map