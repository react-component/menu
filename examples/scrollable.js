webpackJsonp([2],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(39);


/***/ },

/***/ 39:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var React = __webpack_require__(2);
	var Menu = __webpack_require__(3);
	var SubMenu = Menu.SubMenu;
	var MenuItem = Menu.Item;
	var pkg = __webpack_require__(26);
	
	__webpack_require__(27);
	__webpack_require__(31);
	
	var children = [];
	for (var i = 0; i < 20; i++) {
	  children.push(React.createElement(
	    MenuItem,
	    { key: i + "" },
	    i
	  ));
	}
	var style = '.rc-menu {\
	height: 200px;\
	width:200px;\
	overflow:auto;\
	}';
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
	    'keyboard scrollable menu'
	  ),
	  React.createElement(
	    'style',
	    null,
	    style
	  ),
	  React.createElement(
	    Menu,
	    null,
	    children
	  )
	), document.getElementById('__react-content'));

/***/ }

});
//# sourceMappingURL=scrollable.js.map