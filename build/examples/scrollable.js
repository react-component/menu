webpackJsonp([0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(2);


/***/ },
/* 1 */,
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */
	var React = __webpack_require__(5);
	var Menu = __webpack_require__(6);
	var SubMenu = Menu.SubMenu;
	var MenuItem = Menu.Item;

	__webpack_require__(10);
	__webpack_require__(12);

	var children = [];
	for (var i = 0; i < 20; i++) {
	  children.push(React.createElement(MenuItem, {key: i + ""}, i));
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