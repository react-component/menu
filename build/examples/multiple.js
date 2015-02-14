webpackJsonp([1],[
/* 0 */
/*!**********************!*\
  !*** multi multiple ***!
  \**********************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(/*! ./examples/multiple.js */2);


/***/ },
/* 1 */,
/* 2 */
/*!******************************!*\
  !*** ./examples/multiple.js ***!
  \******************************/
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */
	var React = __webpack_require__(/*! react */ 5);
	var Menu = __webpack_require__(/*! rc-menu */ 4);
	var SubMenu = Menu.SubMenu;
	var MenuItem = Menu.Item;
	
	__webpack_require__(/*! rc-menu/assets/index.css */ 6);
	__webpack_require__(/*! font-awesome/css/font-awesome.css */ 8);
	
	function handleSelect(selectedKey) {
	  console.log('selected ' + selectedKey);
	}
	
	function handleDeselect(selectedKey) {
	  console.log('deselect ' + selectedKey);
	}
	
	var titleRight = React.createElement("span", null, "sub menu ", React.createElement("i", {className: "fa fa-caret-right pull-right"}));
	var titleRight1 = React.createElement("span", null, "sub menu 1 ", React.createElement("i", {className: "fa fa-caret-right pull-right"}));
	var titleRight2 = React.createElement("span", null, "sub menu 2 ", React.createElement("i", {className: "fa fa-caret-right pull-right"}));
	var titleRight3 = React.createElement("span", null, "sub menu 3 ", React.createElement("i", {className: "fa fa-caret-right pull-right"}));
	var container = document.getElementById('__react-content');
	
	render(container);
	
	function render(container){
	  var leftMenu = (
	    React.createElement(Menu, {multiple: true, onSelect: handleSelect, onDeselect: handleDeselect}, 
	      React.createElement(SubMenu, {title: titleRight}, 
	        React.createElement(MenuItem, null, "0-1"), 
	        React.createElement(MenuItem, null, "0-2")
	      ), 
	      React.createElement(MenuItem, {key: "10"}, "1"), 
	      React.createElement(MenuItem, {key: "31"}, "outer"), 
	      React.createElement(SubMenu, {title: titleRight1}, 
	        React.createElement(MenuItem, {key: "31"}, "inner inner"), 
	        React.createElement(MenuItem, {disabled: true, className: "rc-menu-item-divider"}), 
	        React.createElement(SubMenu, {
	          openOnHover: false, 
	          key: "110", 
	          title: titleRight2
	        }, 
	          React.createElement(MenuItem, {key: "231"}, "inn"), 
	          React.createElement(SubMenu, {title: titleRight3}, 
	            React.createElement(Menu, null, 
	              React.createElement(MenuItem, {key: "231"}, "inner inner"), 
	              React.createElement(MenuItem, {key: "242"}, "inner inner2")
	            )
	          )
	        )
	      ), 
	      React.createElement(MenuItem, {disabled: true}, "disabled"), 
	      React.createElement(MenuItem, {key: "2311"}, "outer3")
	    )
	  );
	  React.render(React.createElement("div", null, React.createElement("h1", null, "multiple selectable menu"), React.createElement("div", {style: {width:400}}, leftMenu)), container);
	}


/***/ }
]);
//# sourceMappingURL=multiple.js.map