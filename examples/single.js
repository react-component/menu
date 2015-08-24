webpackJsonp([5],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(45);


/***/ },

/***/ 42:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },

/***/ 45:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _react = __webpack_require__(2);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _rcMenu = __webpack_require__(3);
	
	var _rcMenu2 = _interopRequireDefault(_rcMenu);
	
	__webpack_require__(39);
	
	__webpack_require__(42);
	
	function handleSelect(info) {
	  console.log('selected ', info);
	}
	
	function handleClick(info) {
	  console.log('click ', info);
	}
	
	var titleRight = _react2['default'].createElement(
	  'span',
	  null,
	  'sub menu',
	  _react2['default'].createElement('i', { className: 'fa fa-caret-right pull-right' })
	);
	var titleRight1 = _react2['default'].createElement(
	  'span',
	  null,
	  'sub menu 1',
	  _react2['default'].createElement('i', { className: 'fa fa-caret-right pull-right' })
	);
	var titleRight2 = _react2['default'].createElement(
	  'span',
	  null,
	  'sub menu 2',
	  _react2['default'].createElement('i', { className: 'fa fa-caret-right pull-right' })
	);
	var titleRight3 = _react2['default'].createElement(
	  'span',
	  null,
	  'sub menu 3',
	  _react2['default'].createElement('i', { className: 'fa fa-caret-right pull-right' })
	);
	var container = document.getElementById('__react-content');
	
	render(container);
	
	function render(container) {
	  var leftMenu = _react2['default'].createElement(
	    _rcMenu2['default'],
	    { onSelect: handleSelect,
	      onClick: handleClick },
	    _react2['default'].createElement(
	      _rcMenu.SubMenu,
	      { title: titleRight, key: '1' },
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
	      null,
	      _react2['default'].createElement(
	        'a',
	        { href: 'http://taobao.com', target: '_blank' },
	        'i do not need key'
	      )
	    ),
	    _react2['default'].createElement(
	      _rcMenu.Item,
	      { key: '3' },
	      'outer'
	    ),
	    _react2['default'].createElement(
	      _rcMenu.SubMenu,
	      { title: titleRight1, key: '4' },
	      _react2['default'].createElement(
	        _rcMenu.Item,
	        { key: '4-1' },
	        'inner inner'
	      ),
	      _react2['default'].createElement(_rcMenu2['default'].Divider, null),
	      _react2['default'].createElement(
	        _rcMenu.SubMenu,
	        { key: '4-2',
	          title: titleRight2 },
	        _react2['default'].createElement(
	          _rcMenu.Item,
	          { key: '4-2-1' },
	          'inn'
	        ),
	        _react2['default'].createElement(
	          _rcMenu.SubMenu,
	          { title: titleRight3, key: '4-2-2' },
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
	      'p',
	      null,
	      _react2['default'].createElement(
	        'button',
	        { onClick: destroy },
	        'destroy'
	      ),
	      ' ',
	      _react2['default'].createElement(
	        'a',
	        { href: '#' },
	        'archor'
	      )
	    ),
	    _react2['default'].createElement(
	      'div',
	      { style: { width: 400 } },
	      leftMenu
	    )
	  ), container);
	
	  function destroy() {
	    _react2['default'].unmountComponentAtNode(container);
	  }
	}

/***/ }

});
//# sourceMappingURL=single.js.map