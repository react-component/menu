webpackJsonp([3],{

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(309);


/***/ }),

/***/ 309:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var _react = __webpack_require__(2);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDom = __webpack_require__(38);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _rcMenu = __webpack_require__(185);
	
	var _rcMenu2 = _interopRequireDefault(_rcMenu);
	
	__webpack_require__(306);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/* eslint no-console:0 */
	
	function handleSelect(info) {
	  console.log('selected ', info);
	}
	
	function handleDeselect(info) {
	  console.log('deselect ', info);
	}
	
	var titleRight = _react2.default.createElement(
	  'span',
	  null,
	  'sub menu'
	);
	var titleRight1 = _react2.default.createElement(
	  'span',
	  null,
	  'sub menu 1'
	);
	var titleRight2 = _react2.default.createElement(
	  'span',
	  null,
	  'sub menu 2'
	);
	var titleRight3 = _react2.default.createElement(
	  'span',
	  null,
	  'sub menu 3'
	);
	
	function render(container) {
	  function destroy() {
	    _reactDom2.default.unmountComponentAtNode(container);
	  }
	
	  var leftMenu = _react2.default.createElement(
	    _rcMenu2.default,
	    {
	      multiple: true,
	      onSelect: handleSelect,
	      onDeselect: handleDeselect,
	      defaultSelectedKeys: ['2', '1-1']
	    },
	    _react2.default.createElement(
	      _rcMenu.SubMenu,
	      { title: titleRight, key: '1' },
	      _react2.default.createElement(
	        _rcMenu.Item,
	        { key: '1-1' },
	        '0-1'
	      ),
	      _react2.default.createElement(
	        _rcMenu.Item,
	        { key: '1-2' },
	        '0-2'
	      )
	    ),
	    _react2.default.createElement(
	      _rcMenu.Item,
	      { key: '2', disabled: true },
	      'can not deselect me,i\'m disabled'
	    ),
	    _react2.default.createElement(
	      _rcMenu.Item,
	      { key: '3' },
	      'outer'
	    ),
	    _react2.default.createElement(
	      _rcMenu.SubMenu,
	      { title: titleRight1, key: '4' },
	      _react2.default.createElement(
	        _rcMenu.Item,
	        { key: '4-1' },
	        'inner inner'
	      ),
	      _react2.default.createElement(_rcMenu.Divider, null),
	      _react2.default.createElement(
	        _rcMenu.SubMenu,
	        {
	          key: '4-2',
	          title: titleRight2
	        },
	        _react2.default.createElement(
	          _rcMenu.Item,
	          { key: '4-2-1' },
	          'inn'
	        ),
	        _react2.default.createElement(
	          _rcMenu.SubMenu,
	          { title: titleRight3, key: '4-2-2' },
	          _react2.default.createElement(
	            _rcMenu.Item,
	            { key: '4-2-2-1' },
	            'inner inner'
	          ),
	          _react2.default.createElement(
	            _rcMenu.Item,
	            { key: '4-2-2-2' },
	            'inner inner2'
	          )
	        )
	      )
	    ),
	    _react2.default.createElement(
	      _rcMenu.Item,
	      { disabled: true, key: 'disabled' },
	      'disabled'
	    ),
	    _react2.default.createElement(
	      _rcMenu.Item,
	      { key: '4-3' },
	      'outer3'
	    )
	  );
	  _reactDom2.default.render(_react2.default.createElement(
	    'div',
	    null,
	    _react2.default.createElement(
	      'h2',
	      null,
	      'multiple selectable menu'
	    ),
	    _react2.default.createElement(
	      'p',
	      null,
	      _react2.default.createElement(
	        'button',
	        { onClick: destroy },
	        'destroy'
	      )
	    ),
	    _react2.default.createElement(
	      'div',
	      { style: { width: 400 } },
	      leftMenu
	    )
	  ), container);
	}
	
	var container = document.getElementById('__react-content');
	
	render(container);

/***/ })

});
//# sourceMappingURL=multiple.js.map