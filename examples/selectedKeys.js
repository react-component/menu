webpackJsonp([6],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(294);


/***/ },

/***/ 294:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _react = __webpack_require__(2);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDom = __webpack_require__(33);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _rcMenu = __webpack_require__(179);
	
	var _rcMenu2 = _interopRequireDefault(_rcMenu);
	
	__webpack_require__(288);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/* eslint no-console:0 */
	
	var Test = _react2.default.createClass({
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
	    return _react2.default.createElement(
	      _rcMenu2.default,
	      {
	        multiple: true,
	        onSelect: this.onSelect,
	        onDeselect: this.onDeselect,
	        onOpenChange: this.onOpenChange,
	        openKeys: this.state.openKeys,
	        selectedKeys: this.state.selectedKeys
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
	        )
	      ),
	      _react2.default.createElement(
	        _rcMenu.Item,
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
	
	    return _react2.default.createElement(
	      'div',
	      null,
	      _react2.default.createElement('link', { href: '//cdn.bootcss.com/font-awesome/4.2.0/css/font-awesome.css', rel: 'stylesheet' }),
	      _react2.default.createElement(
	        'h2',
	        null,
	        'multiple selectable menu'
	      ),
	      _react2.default.createElement(
	        'p',
	        null,
	        'selectedKeys: \xA0\xA0\xA0',
	        allSelectedKeys.map(function (k) {
	          return _react2.default.createElement(
	            'label',
	            { key: k },
	            k,
	            _react2.default.createElement('input', {
	              value: k,
	              key: k,
	              type: 'checkbox',
	              onChange: _this.onCheck,
	              checked: selectedKeys.indexOf(k) !== -1
	            })
	          );
	        })
	      ),
	      _react2.default.createElement(
	        'p',
	        null,
	        'openKeys: \xA0\xA0\xA0',
	        allOpenKeys.map(function (k) {
	          return _react2.default.createElement(
	            'label',
	            { key: k },
	            k,
	            _react2.default.createElement('input', {
	              value: k,
	              type: 'checkbox',
	              onChange: _this.onOpenCheck,
	              checked: openKeys.indexOf(k) !== -1
	            })
	          );
	        })
	      ),
	      _react2.default.createElement(
	        'div',
	        { style: { width: 400 } },
	        this.getMenu()
	      )
	    );
	  }
	});
	
	_reactDom2.default.render(_react2.default.createElement(Test, null), document.getElementById('__react-content'));

/***/ }

});
//# sourceMappingURL=selectedKeys.js.map