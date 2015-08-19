webpackJsonp([4],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(43);


/***/ },

/***/ 41:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },

/***/ 43:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _react = __webpack_require__(2);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _rcMenu = __webpack_require__(3);
	
	var _rcMenu2 = _interopRequireDefault(_rcMenu);
	
	__webpack_require__(38);
	
	__webpack_require__(41);
	
	var Test = _react2['default'].createClass({
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
	
	  onOpen: function onOpen(info) {
	    console.log('open ', info);
	    this.setState({
	      openKeys: info.openKeys
	    });
	  },
	
	  onClose: function onClose(info) {
	    console.log('open ', info);
	    this.setState({
	      openKeys: info.openKeys
	    });
	  },
	
	  getMenu: function getMenu() {
	    return _react2['default'].createElement(
	      _rcMenu2['default'],
	      { multiple: true,
	        onSelect: this.onSelect,
	        onDeselect: this.onDeselect,
	        onOpen: this.onOpen,
	        onClose: this.onClose,
	        openKeys: this.state.openKeys,
	        selectedKeys: this.state.selectedKeys },
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
	
	  render: function render() {
	    var _this = this;
	
	    if (this.state.destroyed) {
	      return null;
	    }
	    var allSelectedKeys = ["1-1", "1-2", "2-1", "2-2", "3"];
	    var allOpenKeys = ["1", "2"];
	    var selectedKeys = this.state.selectedKeys;
	    var openKeys = this.state.openKeys;
	
	    return _react2['default'].createElement(
	      'div',
	      null,
	      _react2['default'].createElement(
	        'h2',
	        null,
	        'multiple selectable menu'
	      ),
	      _react2['default'].createElement(
	        'p',
	        null,
	        'selectedKeys:    ',
	        allSelectedKeys.map(function (k) {
	          return _react2['default'].createElement(
	            'label',
	            { key: k },
	            k,
	            ' ',
	            _react2['default'].createElement('input', { value: k, key: k, type: 'checkbox', onChange: _this.onCheck,
	              checked: selectedKeys.indexOf(k) !== -1 })
	          );
	        })
	      ),
	      _react2['default'].createElement(
	        'p',
	        null,
	        'openKeys:    ',
	        allOpenKeys.map(function (k) {
	          return _react2['default'].createElement(
	            'label',
	            { key: k },
	            k,
	            ' ',
	            _react2['default'].createElement('input', { value: k, type: 'checkbox', onChange: _this.onOpenCheck,
	              checked: openKeys.indexOf(k) !== -1 })
	          );
	        })
	      ),
	      _react2['default'].createElement(
	        'div',
	        { style: { width: 400 } },
	        this.getMenu()
	      )
	    );
	  },
	
	  destroy: function destroy() {
	    this.setState({
	      destroyed: true
	    });
	  }
	});
	
	_react2['default'].render(_react2['default'].createElement(Test, null), document.getElementById('__react-content'));

/***/ }

});
//# sourceMappingURL=selectedKeys.js.map