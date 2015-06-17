webpackJsonp([3],{

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
	var pkg = __webpack_require__(25);
	
	__webpack_require__(26);
	__webpack_require__(30);
	
	function handleSelect(selectedKey) {
	  console.log('selected ' + selectedKey);
	}
	
	function handleClick(selectedKey) {
	  console.log('click ' + selectedKey);
	}
	
	function handleDeselect(selectedKey) {
	  console.log(' deselect ' + selectedKey);
	}
	
	var titleRight = React.createElement(
	  'span',
	  null,
	  'sub menu',
	  React.createElement('i', { className: 'fa fa-caret-right pull-right' })
	);
	var titleRight1 = React.createElement(
	  'span',
	  null,
	  'sub menu 1',
	  React.createElement('i', { className: 'fa fa-caret-right pull-right' })
	);
	var titleRight2 = React.createElement(
	  'span',
	  null,
	  'sub menu 2',
	  React.createElement('i', { className: 'fa fa-caret-right pull-right' })
	);
	var titleRight3 = React.createElement(
	  'span',
	  null,
	  'sub menu 3',
	  React.createElement('i', { className: 'fa fa-caret-right pull-right' })
	);
	var container = document.getElementById('__react-content');
	
	render(container);
	
	function render(container) {
	  var leftMenu = React.createElement(
	    Menu,
	    { onSelect: handleSelect,
	      onClick: handleClick,
	      onDeselect: handleDeselect },
	    React.createElement(
	      SubMenu,
	      { title: titleRight, key: '1' },
	      React.createElement(
	        MenuItem,
	        { key: '1-1' },
	        '0-1'
	      ),
	      React.createElement(
	        MenuItem,
	        { key: '1-2' },
	        '0-2'
	      )
	    ),
	    React.createElement(
	      MenuItem,
	      null,
	      React.createElement(
	        'a',
	        { href: 'http://taobao.com', target: '_blank' },
	        'i do not need key'
	      )
	    ),
	    React.createElement(
	      MenuItem,
	      { key: '3' },
	      'outer'
	    ),
	    React.createElement(
	      SubMenu,
	      { title: titleRight1, key: '4' },
	      React.createElement(
	        MenuItem,
	        { key: '4-1' },
	        'inner inner'
	      ),
	      React.createElement(Menu.Divider, null),
	      React.createElement(
	        SubMenu,
	        {
	          openOnHover: false,
	          key: '4-2',
	          title: titleRight2
	        },
	        React.createElement(
	          MenuItem,
	          { key: '4-2-1' },
	          'inn'
	        ),
	        React.createElement(
	          SubMenu,
	          { title: titleRight3, key: '4-2-2' },
	          React.createElement(
	            Menu,
	            null,
	            React.createElement(
	              MenuItem,
	              { key: '4-2-2-1' },
	              'inner inner'
	            ),
	            React.createElement(
	              MenuItem,
	              { key: '4-2-2-2' },
	              'inner inner2'
	            )
	          )
	        )
	      )
	    ),
	    React.createElement(
	      MenuItem,
	      { disabled: true },
	      'disabled'
	    ),
	    React.createElement(
	      MenuItem,
	      { key: '4-3' },
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
	      'single selectable menu'
	    ),
	    React.createElement(
	      'div',
	      { style: { width: 400 } },
	      leftMenu
	    )
	  ), container);
	}

/***/ }

});
//# sourceMappingURL=single.js.map