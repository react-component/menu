webpackJsonp([0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _react = __webpack_require__(2);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _rcMenu = __webpack_require__(3);
	
	var _rcMenu2 = _interopRequireDefault(_rcMenu);
	
	__webpack_require__(26);
	
	function handleSelect(selectedKey) {
	  console.log('selected ' + selectedKey);
	}
	
	function handleDeselect(selectedKey) {
	  console.log('deselect ' + selectedKey);
	}
	
	var titleRight = _react2['default'].createElement(
	  'span',
	  null,
	  'sub menu'
	);
	var titleRight1 = _react2['default'].createElement(
	  'span',
	  null,
	  'sub menu 1'
	);
	var titleRight2 = _react2['default'].createElement(
	  'span',
	  null,
	  'sub menu 2'
	);
	var titleRight3 = _react2['default'].createElement(
	  'span',
	  null,
	  'sub menu 3'
	);
	var container = document.getElementById('__react-content');
	
	render(container);
	
	function render(container) {
	  var topAlign = {
	    points: ['lt', 'lb']
	  };
	  var leftMenu = _react2['default'].createElement(
	    _rcMenu2['default'],
	    { onSelect: handleSelect, onDeselect: handleDeselect, horizontal: true },
	    _react2['default'].createElement(
	      _rcMenu.SubMenu,
	      { title: titleRight, key: '1', align: topAlign },
	      _react2['default'].createElement(
	        _rcMenu.Item,
	        { key: '1-1' },
	        '0-1'
	      ),
	      _react2['default'].createElement(
	        _rcMenu.Item,
	        { key: '1-2' },
	        '0-2'
	      )
	    ),
	    _react2['default'].createElement(
	      _rcMenu.Item,
	      { key: '2' },
	      '1'
	    ),
	    _react2['default'].createElement(
	      _rcMenu.Item,
	      { key: '3' },
	      'outer'
	    ),
	    _react2['default'].createElement(
	      _rcMenu.SubMenu,
	      { title: titleRight1, key: '4', align: topAlign },
	      _react2['default'].createElement(
	        _rcMenu.Item,
	        { key: '4-1' },
	        'inner inner'
	      ),
	      _react2['default'].createElement(_rcMenu2['default'].Divider, null),
	      _react2['default'].createElement(
	        _rcMenu.SubMenu,
	        {
	          openOnHover: false,
	          key: '4-2',
	          title: titleRight2
	        },
	        _react2['default'].createElement(
	          _rcMenu.Item,
	          { key: '4-2-1' },
	          'inn'
	        ),
	        _react2['default'].createElement(
	          _rcMenu.SubMenu,
	          { title: titleRight3, key: '4-2-2' },
	          _react2['default'].createElement(
	            _rcMenu2['default'],
	            null,
	            _react2['default'].createElement(
	              _rcMenu.Item,
	              { key: '4-2-2-1' },
	              'inner inner'
	            ),
	            _react2['default'].createElement(
	              _rcMenu.Item,
	              { key: '4-2-2-2' },
	              'inner inner2'
	            )
	          )
	        )
	      )
	    ),
	    _react2['default'].createElement(
	      _rcMenu.Item,
	      { disabled: true },
	      'disabled'
	    ),
	    _react2['default'].createElement(
	      _rcMenu.Item,
	      { key: '4-3' },
	      'outer3'
	    )
	  );
	  _react2['default'].render(_react2['default'].createElement(
	    'div',
	    null,
	    _react2['default'].createElement(
	      'h2',
	      null,
	      'single selectable menu'
	    ),
	    _react2['default'].createElement(
	      'div',
	      { style: { width: 800, margin: 20 } },
	      leftMenu
	    )
	  ), container);
	}

/***/ }
]);
//# sourceMappingURL=antd.js.map