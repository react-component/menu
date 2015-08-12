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
	
	__webpack_require__(30);
	
	function handleSelect(info) {
	  console.log(info);
	  console.log('selected ' + info.key);
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
	var titleRight4 = _react2['default'].createElement(
	  'span',
	  null,
	  'sub menu 4'
	);
	var container = document.getElementById('__react-content');
	
	var nestSubMenu = _react2['default'].createElement(
	  _rcMenu.SubMenu,
	  { title: titleRight2, key: '4' },
	  _react2['default'].createElement(
	    _rcMenu.Item,
	    { key: '4-1' },
	    'inner inner'
	  ),
	  _react2['default'].createElement(_rcMenu2['default'].Divider, null),
	  _react2['default'].createElement(
	    _rcMenu.SubMenu,
	    { key: '4-2',
	      title: titleRight3
	    },
	    _react2['default'].createElement(
	      _rcMenu.SubMenu,
	      { title: 'sub 4-2-0', key: '4-2-0' },
	      _react2['default'].createElement(
	        _rcMenu.Item,
	        { key: '4-2-0-1' },
	        'inner inner'
	      ),
	      _react2['default'].createElement(
	        _rcMenu.Item,
	        { key: '4-2-0-2' },
	        'inner inner2'
	      )
	    ),
	    _react2['default'].createElement(
	      _rcMenu.Item,
	      { key: '4-2-1' },
	      'inn'
	    ),
	    _react2['default'].createElement(
	      _rcMenu.SubMenu,
	      { title: titleRight4, key: '4-2-2' },
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
	    ),
	    _react2['default'].createElement(
	      _rcMenu.SubMenu,
	      { title: 'sub 4-2-3', key: '4-2-3' },
	      _react2['default'].createElement(
	        _rcMenu.Item,
	        { key: '4-2-3-1' },
	        'inner inner'
	      ),
	      _react2['default'].createElement(
	        _rcMenu.Item,
	        { key: '4-2-3-2' },
	        'inner inner2'
	      )
	    )
	  )
	);
	
	var commonMenu = _react2['default'].createElement(
	  _rcMenu2['default'],
	  { onSelect: handleSelect },
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
	    { key: '2' },
	    '1'
	  ),
	  _react2['default'].createElement(
	    _rcMenu.Item,
	    { key: '3' },
	    'outer'
	  ),
	  nestSubMenu,
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
	
	var subMenus = _react2['default'].createElement(
	  _rcMenu2['default'],
	  { onSelect: handleSelect },
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
	    _rcMenu.SubMenu,
	    { title: titleRight1, key: '2' },
	    _react2['default'].createElement(
	      _rcMenu.Item,
	      { key: '2-1' },
	      '2-1'
	    ),
	    _react2['default'].createElement(
	      _rcMenu.Item,
	      { key: '2-2' },
	      '2-2'
	    )
	  ),
	  nestSubMenu
	);
	
	render(container);
	
	function render(container) {
	  var horizontalMenu = _react2['default'].cloneElement(commonMenu, {
	    mode: 'horizontal'
	  });
	
	  var horizontalClickMenu = _react2['default'].cloneElement(subMenus, {
	    mode: 'horizontal',
	    openSubMenuOnMouseEnter: false
	  });
	
	  var verticalMenu = _react2['default'].cloneElement(commonMenu, {
	    mode: 'vertical'
	  });
	
	  var inlineMenu = _react2['default'].cloneElement(commonMenu, {
	    mode: 'inline'
	  });
	
	  _react2['default'].render(_react2['default'].createElement(
	    'div',
	    { style: { margin: 20 } },
	    _react2['default'].createElement(
	      'h2',
	      null,
	      'antd menu'
	    ),
	    _react2['default'].createElement(
	      'div',
	      null,
	      _react2['default'].createElement(
	        'h3',
	        null,
	        'horizontal'
	      ),
	      _react2['default'].createElement(
	        'div',
	        { style: { margin: 20, width: 800 } },
	        horizontalMenu
	      ),
	      _react2['default'].createElement(
	        'h3',
	        null,
	        'horizontal and click'
	      ),
	      _react2['default'].createElement(
	        'div',
	        { style: { margin: 20, width: 800 } },
	        horizontalClickMenu
	      ),
	      _react2['default'].createElement(
	        'h3',
	        null,
	        'vertical'
	      ),
	      _react2['default'].createElement(
	        'div',
	        { style: { margin: 20, width: 200 } },
	        verticalMenu
	      ),
	      _react2['default'].createElement(
	        'h3',
	        null,
	        'inline'
	      ),
	      _react2['default'].createElement(
	        'div',
	        { style: { margin: 20, width: 400 } },
	        inlineMenu
	      )
	    )
	  ), container);
	}

/***/ }
]);
//# sourceMappingURL=antd.js.map