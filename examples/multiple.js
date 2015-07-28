webpackJsonp([1],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(38);


/***/ },

/***/ 38:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var React = __webpack_require__(2);
	var Menu = __webpack_require__(3);
	var SubMenu = Menu.SubMenu;
	var MenuItem = Menu.Item;
	var pkg = __webpack_require__(26);
	
	__webpack_require__(27);
	__webpack_require__(31);
	
	function handleSelect(selectedKey, item, e) {
	  console.log('selected ' + selectedKey, item, e);
	}
	
	function handleDeselect(selectedKey, item, e) {
	  console.log('deselect ' + selectedKey, item, e);
	}
	
	var titleRight = React.createElement(
	  'span',
	  null,
	  'sub menu',
	  React.createElement('i', { className: "fa fa-caret-right pull-right" })
	);
	var titleRight1 = React.createElement(
	  'span',
	  null,
	  'sub menu 1',
	  React.createElement('i', { className: "fa fa-caret-right pull-right" })
	);
	var titleRight2 = React.createElement(
	  'span',
	  null,
	  'sub menu 2',
	  React.createElement('i', { className: "fa fa-caret-right pull-right" })
	);
	var titleRight3 = React.createElement(
	  'span',
	  null,
	  'sub menu 3',
	  React.createElement('i', { className: "fa fa-caret-right pull-right" })
	);
	var container = document.getElementById('__react-content');
	
	render(container);
	
	function save(c) {
	  console.log('getRef');
	  console.log(React.findDOMNode(c));
	}
	
	function render(container) {
	  var leftMenu = React.createElement(
	    Menu,
	    { multiple: true, onSelect: handleSelect, onDeselect: handleDeselect, selectedKeys: ['2', '4-3'] },
	    React.createElement(
	      SubMenu,
	      { title: titleRight, key: "1" },
	      React.createElement(
	        MenuItem,
	        { key: "1-1" },
	        '0-1'
	      ),
	      React.createElement(
	        MenuItem,
	        { key: "1-2" },
	        '0-2'
	      )
	    ),
	    React.createElement(
	      MenuItem,
	      { key: "2", disabled: true },
	      'can not deselect me,i\'m disabled'
	    ),
	    React.createElement(
	      MenuItem,
	      { key: "3" },
	      'outer'
	    ),
	    React.createElement(
	      SubMenu,
	      { title: titleRight1, key: "4" },
	      React.createElement(
	        MenuItem,
	        { key: "4-1" },
	        'inner inner'
	      ),
	      React.createElement(Menu.Divider, null),
	      React.createElement(
	        SubMenu,
	        {
	          openOnHover: false,
	          key: "4-2",
	          title: titleRight2
	        },
	        React.createElement(
	          MenuItem,
	          { key: "4-2-1" },
	          'inn'
	        ),
	        React.createElement(
	          SubMenu,
	          { title: titleRight3, key: "4-2-2" },
	          React.createElement(
	            Menu,
	            null,
	            React.createElement(
	              MenuItem,
	              { key: "4-2-2-1" },
	              'inner inner'
	            ),
	            React.createElement(
	              MenuItem,
	              { key: "4-2-2-2" },
	              'inner inner2'
	            )
	          )
	        )
	      )
	    ),
	    React.createElement(
	      MenuItem,
	      { disabled: true, key: "disabled" },
	      'disabled'
	    ),
	    React.createElement(
	      MenuItem,
	      { key: "4-3" },
	      'outer3'
	    )
	  );
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
	      'multiple selectable menu'
	    ),
	    React.createElement(
	      'p',
	      null,
	      React.createElement(
	        'button',
	        { onClick: destroy },
	        'destroy'
	      )
	    ),
	    React.createElement(
	      'div',
	      { style: { width: 400 } },
	      leftMenu
	    )
	  ), container);
	
	  function destroy() {
	    React.unmountComponentAtNode(container);
	  }
	}

/***/ }

});
//# sourceMappingURL=multiple.js.map