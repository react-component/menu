webpackJsonp([0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _react = __webpack_require__(2);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDom = __webpack_require__(33);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _rcMenu = __webpack_require__(179);
	
	var _rcMenu2 = _interopRequireDefault(_rcMenu);
	
	__webpack_require__(289);
	
	var _cssAnimation = __webpack_require__(274);
	
	var _cssAnimation2 = _interopRequireDefault(_cssAnimation);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function handleSelect(info) {
	  console.log(info);
	  console.log('selected ' + info.key);
	} /* eslint no-console:0 */
	
	var animation = {
	  enter: function enter(node, done) {
	    var height = void 0;
	    return (0, _cssAnimation2.default)(node, 'rc-menu-collapse', {
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
	    return (0, _cssAnimation2.default)(node, 'rc-menu-collapse', {
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
	
	var nestSubMenu = _react2.default.createElement(
	  _rcMenu.SubMenu,
	  { title: _react2.default.createElement(
	      'span',
	      null,
	      'sub menu 2'
	    ), key: '4' },
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
	      title: _react2.default.createElement(
	        'span',
	        null,
	        'sub menu 3'
	      )
	    },
	    _react2.default.createElement(
	      _rcMenu.SubMenu,
	      { title: 'sub 4-2-0', key: '4-2-0' },
	      _react2.default.createElement(
	        _rcMenu.Item,
	        { key: '4-2-0-1' },
	        'inner inner'
	      ),
	      _react2.default.createElement(
	        _rcMenu.Item,
	        { key: '4-2-0-2' },
	        'inner inner2'
	      )
	    ),
	    _react2.default.createElement(
	      _rcMenu.Item,
	      { key: '4-2-1' },
	      'inn'
	    ),
	    _react2.default.createElement(
	      _rcMenu.SubMenu,
	      { title: _react2.default.createElement(
	          'span',
	          null,
	          'sub menu 4'
	        ), key: '4-2-2' },
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
	    ),
	    _react2.default.createElement(
	      _rcMenu.SubMenu,
	      { title: 'sub 4-2-3', key: '4-2-3' },
	      _react2.default.createElement(
	        _rcMenu.Item,
	        { key: '4-2-3-1' },
	        'inner inner'
	      ),
	      _react2.default.createElement(
	        _rcMenu.Item,
	        { key: '4-2-3-2' },
	        'inner inner2'
	      )
	    )
	  )
	);
	
	function onOpenChange(value) {
	  console.log('onOpenChange', value);
	}
	var commonMenu = _react2.default.createElement(
	  _rcMenu2.default,
	  { onSelect: handleSelect, onOpenChange: onOpenChange },
	  _react2.default.createElement(
	    _rcMenu.SubMenu,
	    { title: _react2.default.createElement(
	        'span',
	        null,
	        'sub menu'
	      ), key: '1' },
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
	  nestSubMenu,
	  _react2.default.createElement(
	    _rcMenu.Item,
	    { key: '2' },
	    '1'
	  ),
	  _react2.default.createElement(
	    _rcMenu.Item,
	    { key: '3' },
	    'outer'
	  ),
	  _react2.default.createElement(
	    _rcMenu.Item,
	    { disabled: true },
	    'disabled'
	  ),
	  _react2.default.createElement(
	    _rcMenu.Item,
	    { key: '5' },
	    'outer3'
	  )
	);
	
	var subMenus = _react2.default.createElement(
	  _rcMenu2.default,
	  { onSelect: handleSelect },
	  _react2.default.createElement(
	    _rcMenu.SubMenu,
	    { title: _react2.default.createElement(
	        'span',
	        null,
	        'sub menu'
	      ), key: '1' },
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
	    _rcMenu.SubMenu,
	    { title: _react2.default.createElement(
	        'span',
	        null,
	        'sub menu 1'
	      ), key: '2' },
	    _react2.default.createElement(
	      _rcMenu.Item,
	      { key: '2-1' },
	      '2-1'
	    ),
	    _react2.default.createElement(
	      _rcMenu.Item,
	      { key: '2-2' },
	      '2-2'
	    )
	  ),
	  nestSubMenu
	);
	
	function render(container) {
	  var horizontalMenu = _react2.default.cloneElement(commonMenu, {
	    mode: 'horizontal',
	    // use openTransition for antd
	    openAnimation: 'slide-up'
	  });
	
	  var horizontalMenu2 = _react2.default.cloneElement(commonMenu, {
	    mode: 'horizontal',
	    openAnimation: 'slide-up',
	    closeSubMenuOnMouseLeave: false
	  });
	
	  var verticalMenu = _react2.default.cloneElement(commonMenu, {
	    mode: 'vertical',
	    openAnimation: 'zoom'
	  });
	
	  var inlineMenu = _react2.default.cloneElement(commonMenu, {
	    mode: 'inline',
	    defaultOpenKeys: ['1'],
	    openAnimation: animation
	  });
	
	  var ClickToHideMenu = _react2.default.createClass({
	    displayName: 'ClickToHideMenu',
	    getInitialState: function getInitialState() {
	      return {
	        openKeys: []
	      };
	    },
	    onOpenChange: function onOpenChange(openKeys) {
	      this.setState({
	        openKeys: openKeys
	      });
	    },
	    render: function render() {
	      return _react2.default.cloneElement(subMenus, {
	        onOpenChange: this.onOpenChange,
	        openKeys: this.state.openKeys,
	        mode: 'horizontal',
	        openAnimation: 'slide-up',
	        openSubMenuOnMouseEnter: false,
	        closeSubMenuOnMouseLeave: false
	      });
	    }
	  });
	
	  _reactDom2.default.render(_react2.default.createElement(
	    'div',
	    { style: { margin: 20 } },
	    _react2.default.createElement(
	      'h2',
	      null,
	      'antd menu'
	    ),
	    _react2.default.createElement(
	      'div',
	      null,
	      _react2.default.createElement(
	        'h3',
	        null,
	        'horizontal'
	      ),
	      _react2.default.createElement(
	        'div',
	        { style: { margin: 20, width: 800 } },
	        horizontalMenu
	      ),
	      _react2.default.createElement(
	        'h3',
	        null,
	        'horizontal keep open'
	      ),
	      _react2.default.createElement(
	        'div',
	        { style: { margin: 20, width: 800 } },
	        horizontalMenu2
	      ),
	      _react2.default.createElement(
	        'h3',
	        null,
	        'horizontal and click'
	      ),
	      _react2.default.createElement(
	        'div',
	        { style: { margin: 20, width: 800 } },
	        _react2.default.createElement(ClickToHideMenu, null)
	      ),
	      _react2.default.createElement(
	        'h3',
	        null,
	        'vertical'
	      ),
	      _react2.default.createElement(
	        'div',
	        { style: { margin: 20, width: 200 } },
	        verticalMenu
	      ),
	      _react2.default.createElement(
	        'h3',
	        null,
	        'inline'
	      ),
	      _react2.default.createElement(
	        'div',
	        { style: { margin: 20, width: 400 } },
	        inlineMenu
	      )
	    )
	  ), container);
	}
	
	render(reactContainer);

/***/ }
]);
//# sourceMappingURL=antd.js.map