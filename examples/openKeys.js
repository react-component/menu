webpackJsonp([3],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(201);


/***/ },

/***/ 201:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _react = __webpack_require__(2);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDom = __webpack_require__(159);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _rcMenu = __webpack_require__(160);
	
	var _rcMenu2 = _interopRequireDefault(_rcMenu);
	
	__webpack_require__(197);
	
	var Test = _react2['default'].createClass({
	  displayName: 'Test',
	
	  getInitialState: function getInitialState() {
	    return {
	      openKeys: []
	    };
	  },
	
	  onClick: function onClick(info) {
	    console.log('click ', info);
	    this.setState({
	      openKeys: info.keyPath.slice(1)
	    });
	  },
	
	  onOpen: function onOpen(info) {
	    console.log('onOpen', info);
	    this.setState({
	      openKeys: info.openKeys
	    });
	  },
	
	  onClose: function onClose(info) {
	    this.onOpen(info);
	  },
	
	  getMenu: function getMenu() {
	    return _react2['default'].createElement(
	      _rcMenu2['default'],
	      { onClick: this.onClick,
	        mode: 'inline',
	        onOpen: this.onOpen,
	        onClose: this.onClose,
	        openKeys: this.state.openKeys
	      },
	      _react2['default'].createElement(
	        _rcMenu.SubMenu,
	        { key: '1', title: 'submenu1' },
	        _react2['default'].createElement(
	          _rcMenu.Item,
	          { key: '1-1' },
	          'item1-1'
	        ),
	        _react2['default'].createElement(
	          _rcMenu.Item,
	          { key: '1-2' },
	          'item1-2'
	        )
	      ),
	      _react2['default'].createElement(
	        _rcMenu.SubMenu,
	        { key: '2', title: 'submenu2' },
	        _react2['default'].createElement(
	          _rcMenu.Item,
	          { key: '2-1' },
	          'item2-1'
	        ),
	        _react2['default'].createElement(
	          _rcMenu.Item,
	          { key: '2-2' },
	          'item2-2'
	        )
	      ),
	      _react2['default'].createElement(
	        _rcMenu.Item,
	        { key: '3' },
	        'item3'
	      )
	    );
	  },
	
	  render: function render() {
	    return _react2['default'].createElement(
	      'div',
	      null,
	      _react2['default'].createElement(
	        'div',
	        { style: { width: 400 } },
	        this.getMenu()
	      )
	    );
	  }
	});
	
	_reactDom2['default'].render(_react2['default'].createElement(Test, null), document.getElementById('__react-content'));

/***/ }

});
//# sourceMappingURL=openKeys.js.map