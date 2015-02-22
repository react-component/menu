webpackJsonp([1],[
/* 0 */
/*!************************!*\
  !*** multi scrollable ***!
  \************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(/*! ./examples/scrollable.js */3);


/***/ },
/* 1 */,
/* 2 */,
/* 3 */
/*!********************************!*\
  !*** ./examples/scrollable.js ***!
  \********************************/
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */
	var React = __webpack_require__(/*! react */ 4);
	var Menu = __webpack_require__(/*! rc-menu */ 5);
	var SubMenu = Menu.SubMenu;
	var MenuItem = Menu.Item;
	
	__webpack_require__(/*! rc-menu/assets/index.css */ 6);
	__webpack_require__(/*! font-awesome/css/font-awesome.css */ 8);
	
	var children = [];
	for (var i = 0; i < 20; i++) {
	  children.push(React.createElement(MenuItem, null, i));
	}
	var style = '.rc-menu {\
	height: 200px;\
	width:200px;\
	overflow:auto;\
	}';
	React.render(React.createElement("div", null, 
	  React.createElement("h1", null, "keyboard scrollable menu"), 
	  React.createElement("style", null, style), 
	  React.createElement(Menu, null, children)
	), document.getElementById('__react-content'));


/***/ }
]);
//# sourceMappingURL=scrollable.js.map