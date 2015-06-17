webpackJsonp([0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var React = __webpack_require__(2);
	var Menu = __webpack_require__(3);
	var SubMenu = Menu.SubMenu;
	var MenuItem = Menu.Item;
	var MenuItemGroup = Menu.ItemGroup;
	var pkg = __webpack_require__(25);
	
	__webpack_require__(26);
	__webpack_require__(30);
	
	React.render(React.createElement(
	  'div',
	  null,
	  React.createElement(
	    'h1',
	    null,
	    pkg.name,
	    '@',
	    pkg.version
	  ),
	  React.createElement(
	    'h2',
	    null,
	    'menu item group'
	  ),
	  React.createElement(
	    Menu,
	    { style: { margin: 20, width: 300 } },
	    React.createElement(
	      MenuItemGroup,
	      { title: 'group 1', key: '2' },
	      React.createElement(
	        MenuItem,
	        { key: '21' },
	        '2'
	      ),
	      React.createElement(
	        MenuItem,
	        { key: '22' },
	        '3'
	      )
	    ),
	    React.createElement(
	      MenuItemGroup,
	      { title: 'group 2', key: '3' },
	      React.createElement(
	        MenuItem,
	        { key: '31' },
	        '4'
	      ),
	      React.createElement(
	        MenuItem,
	        { key: '32' },
	        '5'
	      )
	    )
	  )
	), document.getElementById('__react-content'));

/***/ }
]);
//# sourceMappingURL=menuItemGroup.js.map