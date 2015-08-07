/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	var parentJsonpFunction = window["webpackJsonp"];
/******/ 	window["webpackJsonp"] = function webpackJsonpCallback(chunkIds, moreModules) {
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, callbacks = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId])
/******/ 				callbacks.push.apply(callbacks, installedChunks[chunkId]);
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			modules[moduleId] = moreModules[moduleId];
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(chunkIds, moreModules);
/******/ 		while(callbacks.length)
/******/ 			callbacks.shift().call(null, __webpack_require__);
/******/ 		if(moreModules[0]) {
/******/ 			installedModules[0] = 0;
/******/ 			return __webpack_require__(0);
/******/ 		}
/******/ 	};
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// "0" means "already loaded"
/******/ 	// Array means "loading", array contains callbacks
/******/ 	var installedChunks = {
/******/ 		5:0
/******/ 	};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/ 	// This file contains only the entry chunk.
/******/ 	// The chunk loading function for additional chunks
/******/ 	__webpack_require__.e = function requireEnsure(chunkId, callback) {
/******/ 		// "0" is the signal for "already loaded"
/******/ 		if(installedChunks[chunkId] === 0)
/******/ 			return callback.call(null, __webpack_require__);
/******/
/******/ 		// an array means "currently loading".
/******/ 		if(installedChunks[chunkId] !== undefined) {
/******/ 			installedChunks[chunkId].push(callback);
/******/ 		} else {
/******/ 			// start chunk loading
/******/ 			installedChunks[chunkId] = [callback];
/******/ 			var head = document.getElementsByTagName('head')[0];
/******/ 			var script = document.createElement('script');
/******/ 			script.type = 'text/javascript';
/******/ 			script.charset = 'utf-8';
/******/ 			script.async = true;
/******/
/******/ 			script.src = __webpack_require__.p + "" + chunkId + "." + ({"0":"antd","1":"menuItemGroup","2":"multiple","3":"scrollable","4":"single"}[chunkId]||chunkId) + ".js";
/******/ 			head.appendChild(script);
/******/ 		}
/******/ 	};
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/ })
/************************************************************************/
/******/ ([
/* 0 */,
/* 1 */,
/* 2 */
/***/ function(module, exports) {

	module.exports = React;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	module.exports = __webpack_require__(4);

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _Menu = __webpack_require__(5);
	
	var _Menu2 = _interopRequireDefault(_Menu);
	
	var _SubMenu = __webpack_require__(21);
	
	var _SubMenu2 = _interopRequireDefault(_SubMenu);
	
	var _MenuItem = __webpack_require__(23);
	
	var _MenuItem2 = _interopRequireDefault(_MenuItem);
	
	var _MenuItemGroup = __webpack_require__(24);
	
	var _MenuItemGroup2 = _interopRequireDefault(_MenuItemGroup);
	
	var _Divider = __webpack_require__(25);
	
	var _Divider2 = _interopRequireDefault(_Divider);
	
	_Menu2['default'].SubMenu = _SubMenu2['default'];
	_Menu2['default'].Item = _MenuItem2['default'];
	_Menu2['default'].ItemGroup = _MenuItemGroup2['default'];
	_Menu2['default'].Divider = _Divider2['default'];
	
	exports['default'] = _Menu2['default'];
	module.exports = exports['default'];

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _react = __webpack_require__(2);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _rcUtil = __webpack_require__(6);
	
	var _domScrollIntoView = __webpack_require__(18);
	
	var _domScrollIntoView2 = _interopRequireDefault(_domScrollIntoView);
	
	function noop() {}
	
	var now = Date.now();
	
	function getChildIndexInChildren(child, children) {
	  var index = -1;
	  _react2['default'].Children.forEach(children, function (c, i) {
	    if (c === child) {
	      index = i;
	    }
	  });
	  return index;
	}
	
	function getKeyFromChildren(child, children) {
	  return child.key || 'rcMenuItem_' + now + '_' + getChildIndexInChildren(child, children);
	}
	
	function getKeyFromChildrenIndex(child, index) {
	  return child.key || 'rcMenuItem_' + now + '_' + index;
	}
	
	function getActiveKey(props) {
	  var activeKey = props.activeKey;
	  var children = props.children;
	  if (activeKey) {
	    var found = undefined;
	    _react2['default'].Children.forEach(children, function (c, i) {
	      if (!c.props.disabled && activeKey === getKeyFromChildrenIndex(c, i)) {
	        found = true;
	      }
	    });
	    if (found) {
	      return activeKey;
	    }
	  }
	  activeKey = null;
	  if (props.activeFirst) {
	    _react2['default'].Children.forEach(children, function (c, i) {
	      if (!activeKey && !c.props.disabled) {
	        activeKey = getKeyFromChildrenIndex(c, i);
	      }
	    });
	    return activeKey;
	  }
	  return activeKey;
	}
	
	function saveRef(name, c) {
	  if (c) {
	    this.instanceArray.push(c);
	  }
	}
	
	var Menu = (function (_React$Component) {
	  _inherits(Menu, _React$Component);
	
	  function Menu(props) {
	    var _this = this;
	
	    _classCallCheck(this, Menu);
	
	    _get(Object.getPrototypeOf(Menu.prototype), 'constructor', this).call(this, props);
	    var selectedKeys = props.defaultSelectedKeys;
	    if ('selectedKeys' in props) {
	      selectedKeys = props.selectedKeys;
	    }
	    this.state = {
	      activeKey: getActiveKey(props),
	      selectedKeys: selectedKeys || []
	    };
	    ['onItemHover', 'onDeselect', 'onSelect', 'onKeyDown', 'onDestroy', 'renderMenuItem'].forEach(function (m) {
	      _this[m] = _this[m].bind(_this);
	    });
	  }
	
	  _createClass(Menu, [{
	    key: 'componentWillReceiveProps',
	    value: function componentWillReceiveProps(nextProps) {
	      var props = {};
	      if ('activeKey' in nextProps) {
	        props.activeKey = getActiveKey(nextProps);
	      }
	      if ('selectedKeys' in nextProps) {
	        props.selectedKeys = nextProps.selectedKeys || [];
	      }
	      this.setState(props);
	    }
	
	    // all keyboard events callbacks run from here at first
	  }, {
	    key: 'onKeyDown',
	    value: function onKeyDown(e) {
	      var _this2 = this;
	
	      var keyCode = e.keyCode;
	      var handled = undefined;
	      this.instanceArray.forEach(function (obj) {
	        if (obj.props.active) {
	          handled = obj.onKeyDown(e);
	        }
	      });
	      if (handled) {
	        return 1;
	      }
	      var activeItem = undefined;
	      switch (keyCode) {
	        case _rcUtil.KeyCode.UP:
	          activeItem = this.step(-1);
	          break;
	        case _rcUtil.KeyCode.DOWN:
	          activeItem = this.step(1);
	          break;
	        default:
	      }
	      if (activeItem) {
	        e.preventDefault();
	        this.setState({
	          activeKey: activeItem.props.eventKey
	        }, function () {
	          (0, _domScrollIntoView2['default'])(_react2['default'].findDOMNode(activeItem), _react2['default'].findDOMNode(_this2), {
	            onlyScrollIfNeeded: true
	          });
	        });
	        return 1;
	      }
	    }
	  }, {
	    key: 'onItemHover',
	    value: function onItemHover(key) {
	      this.setState({
	        activeKey: key
	      });
	    }
	  }, {
	    key: 'onSelect',
	    value: function onSelect(key, child, e) {
	      var props = this.props;
	
	      if (!('selectedKeys' in props)) {
	        var state = this.state;
	        // not from submenu
	        // top menu
	        // TODO: remove sub judge
	        if (!props.sub) {
	          if (!props.multiple) {
	            var selectedDescendant = this.selectedDescendant;
	            if (selectedDescendant) {
	              if (selectedDescendant !== child) {
	                var selectedDescendantProps = selectedDescendant.props;
	                selectedDescendantProps.onDeselect(selectedDescendantProps.eventKey, selectedDescendant, e, child);
	              }
	            }
	            this.selectedDescendant = child;
	          }
	        }
	        // my child
	        if (this.instanceArray.indexOf(child) !== -1) {
	          var selectedKeys = undefined;
	          if (props.multiple) {
	            selectedKeys = state.selectedKeys.concat([key]);
	          } else {
	            selectedKeys = [key];
	          }
	          this.setState({
	            selectedKeys: selectedKeys
	          });
	        }
	      }
	
	      if (props.onSelect) {
	        props.onSelect(key, child, e);
	      }
	    }
	  }, {
	    key: 'onDeselect',
	    value: function onDeselect(key, child, e, __childToBeSelected) {
	      var props = this.props;
	      if (!('selectedKeys' in props)) {
	        var state = this.state;
	        var children = this.instanceArray;
	        // my children
	        if (children.indexOf(child) !== -1 && children.indexOf(__childToBeSelected) === -1) {
	          var selectedKeys = state.selectedKeys;
	          var index = selectedKeys.indexOf(key);
	          if (index !== -1) {
	            selectedKeys = selectedKeys.concat([]);
	            selectedKeys.splice(index, 1);
	            this.setState({
	              selectedKeys: selectedKeys
	            });
	          }
	        }
	      }
	      props.onDeselect.apply(null, arguments);
	    }
	  }, {
	    key: 'onDestroy',
	    value: function onDestroy(key) {
	      var state = this.state;
	      var selectedKeys = state.selectedKeys;
	      var index = selectedKeys.indexOf(key);
	      if (index !== -1) {
	        // selectedKeys = selectedKeys.concat([]);
	        selectedKeys.splice(index, 1);
	        // can not call setState in unmount, will cause render and update unmounted children
	        // https://github.com/facebook/react/pull/3795
	        // this.setState({
	        //   selectedKeys: selectedKeys
	        // });
	      }
	    }
	  }, {
	    key: 'renderMenuItem',
	    value: function renderMenuItem(child) {
	      var state = this.state;
	      var props = this.props;
	      var key = getKeyFromChildren(child, props.children);
	      var childProps = child.props;
	      return _react2['default'].cloneElement(child, {
	        mode: props.mode,
	        level: props.level,
	        inlineIndent: props.inlineIndent,
	        globalOpenOnHover: props.openOnHover,
	        globalCloseOnDeActive: props.closeOnDeActive,
	        renderMenuItem: this.renderMenuItem,
	        rootPrefixCls: props.prefixCls,
	        ref: (0, _rcUtil.createChainedFunction)(child.ref, saveRef.bind(this, key)),
	        eventKey: key,
	        onHover: this.onItemHover,
	        active: !childProps.disabled && key === state.activeKey,
	        multiple: props.multiple,
	        selected: state.selectedKeys.indexOf(key) !== -1,
	        onClick: props.onClick,
	        onDeselect: (0, _rcUtil.createChainedFunction)(childProps.onDeselect, this.onDeselect),
	        onDestroy: 'selectedKeys' in props ? noop : this.onDestroy,
	        onSelect: (0, _rcUtil.createChainedFunction)(childProps.onSelect, this.onSelect)
	      });
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _classes;
	
	      var props = this.props;
	      this.instanceArray = [];
	      var classes = (_classes = {}, _defineProperty(_classes, props.prefixCls, 1), _defineProperty(_classes, props.prefixCls + '-sub', !!props.sub), _defineProperty(_classes, props.prefixCls + '-' + props.mode, 1), _defineProperty(_classes, props.className, !!props.className), _classes);
	      var domProps = {
	        className: (0, _rcUtil.classSet)(classes),
	        role: 'menu',
	        'aria-activedescendant': ''
	      };
	      if (props.id) {
	        domProps.id = props.id;
	      }
	      if (props.focusable) {
	        domProps.tabIndex = '0';
	        domProps.onKeyDown = this.onKeyDown;
	      }
	      return _react2['default'].createElement(
	        'ul',
	        _extends({ style: props.style
	        }, domProps),
	        _react2['default'].Children.map(props.children, this.renderMenuItem)
	      );
	    }
	  }, {
	    key: 'step',
	    value: function step(direction) {
	      var children = this.instanceArray;
	      var activeKey = this.state.activeKey;
	      var len = children.length;
	      if (direction < 0) {
	        children = children.concat().reverse();
	      }
	      // find current activeIndex
	      var activeIndex = -1;
	      children.every(function (c, ci) {
	        if (c.props.eventKey === activeKey) {
	          activeIndex = ci;
	          return false;
	        }
	        return true;
	      });
	      var start = (activeIndex + 1) % len;
	      var i = start;
	      for (;;) {
	        var child = children[i];
	        if (child.props.disabled) {
	          i = (i + 1 + len) % len;
	          // complete a loop
	          if (i === start) {
	            return null;
	          }
	        } else {
	          return child;
	        }
	      }
	    }
	  }]);
	
	  return Menu;
	})(_react2['default'].Component);
	
	Menu.propTypes = {
	  focusable: _react2['default'].PropTypes.bool,
	  multiple: _react2['default'].PropTypes.bool,
	  onSelect: _react2['default'].PropTypes.func,
	  style: _react2['default'].PropTypes.object,
	  onDeselect: _react2['default'].PropTypes.func,
	  activeFirst: _react2['default'].PropTypes.bool,
	  openOnHover: _react2['default'].PropTypes.bool,
	  closeOnDeActive: _react2['default'].PropTypes.bool,
	  activeKey: _react2['default'].PropTypes.string,
	  selectedKeys: _react2['default'].PropTypes.arrayOf(_react2['default'].PropTypes.string),
	  defaultSelectedKeys: _react2['default'].PropTypes.arrayOf(_react2['default'].PropTypes.string)
	};
	
	Menu.defaultProps = {
	  prefixCls: 'rc-menu',
	  mode: 'vertical',
	  level: 1,
	  inlineIndent: 24,
	  focusable: true,
	  openOnHover: true,
	  closeOnDeActive: true,
	  style: {},
	  onSelect: noop,
	  onClick: noop,
	  onDeselect: noop
	};
	
	exports['default'] = Menu;
	module.exports = exports['default'];

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  guid: __webpack_require__(7),
	  classSet: __webpack_require__(8),
	  joinClasses: __webpack_require__(9),
	  KeyCode: __webpack_require__(10),
	  PureRenderMixin: __webpack_require__(11),
	  shallowEqual: __webpack_require__(12),
	  createChainedFunction: __webpack_require__(13),
	  Dom: {
	    addEventListener: __webpack_require__(14),
	    contains: __webpack_require__(15)
	  },
	  Children: {
	    toArray: __webpack_require__(16),
	    mapSelf: __webpack_require__(17)
	  }
	};


/***/ },
/* 7 */
/***/ function(module, exports) {

	var seed = 0;
	module.exports = function () {
	  return Date.now() + '_' + (seed++);
	};


/***/ },
/* 8 */
/***/ function(module, exports) {

	/**
	 * Copyright 2013-2014, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This file contains an unmodified version of:
	 * https://github.com/facebook/react/blob/v0.12.0/src/vendor/stubs/cx.js
	 *
	 * This source code is licensed under the BSD-style license found here:
	 * https://github.com/facebook/react/blob/v0.12.0/LICENSE
	 * An additional grant of patent rights can be found here:
	 * https://github.com/facebook/react/blob/v0.12.0/PATENTS
	 */
	
	/**
	 * This function is used to mark string literals representing CSS class names
	 * so that they can be transformed statically. This allows for modularization
	 * and minification of CSS class names.
	 *
	 * In static_upstream, this function is actually implemented, but it should
	 * eventually be replaced with something more descriptive, and the transform
	 * that is used in the main stack should be ported for use elsewhere.
	 *
	 * @param string|object className to modularize, or an object of key/values.
	 *                      In the object case, the values are conditions that
	 *                      determine if the className keys should be included.
	 * @param [string ...]  Variable list of classNames in the string case.
	 * @return string       Renderable space-separated CSS className.
	 */
	function cx(classNames) {
	  if (typeof classNames === 'object') {
	    return Object.keys(classNames).filter(function(className) {
	      return classNames[className];
	    }).join(' ');
	  } else {
	    return Array.prototype.join.call(arguments, ' ');
	  }
	}
	
	module.exports = cx;


/***/ },
/* 9 */
/***/ function(module, exports) {

	/**
	 * Copyright 2013-2014, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This file contains an unmodified version of:
	 * https://github.com/facebook/react/blob/v0.12.0/src/utils/joinClasses.js
	 *
	 * This source code is licensed under the BSD-style license found here:
	 * https://github.com/facebook/react/blob/v0.12.0/LICENSE
	 * An additional grant of patent rights can be found here:
	 * https://github.com/facebook/react/blob/v0.12.0/PATENTS
	 */
	
	"use strict";
	
	/**
	 * Combines multiple className strings into one.
	 * http://jsperf.com/joinclasses-args-vs-array
	 *
	 * @param {...?string} classes
	 * @return {string}
	 */
	
	function joinClasses(className /*, ... */ ) {
	  if (!className) {
	    className = '';
	  }
	  var nextClass;
	  var argLength = arguments.length;
	  if (argLength > 1) {
	    for (var ii = 1; ii < argLength; ii++) {
	      nextClass = arguments[ii];
	      if (nextClass) {
	        className = (className ? className + ' ' : '') + nextClass;
	      }
	    }
	  }
	  return className;
	}
	
	module.exports = joinClasses;


/***/ },
/* 10 */
/***/ function(module, exports) {

	/**
	 * @ignore
	 * some key-codes definition and utils from closure-library
	 * @author yiminghe@gmail.com
	 */
	
	var KeyCode = {
	  /**
	   * MAC_ENTER
	   */
	  MAC_ENTER: 3,
	  /**
	   * BACKSPACE
	   */
	  BACKSPACE: 8,
	  /**
	   * TAB
	   */
	  TAB: 9,
	  /**
	   * NUMLOCK on FF/Safari Mac
	   */
	  NUM_CENTER: 12, // NUMLOCK on FF/Safari Mac
	  /**
	   * ENTER
	   */
	  ENTER: 13,
	  /**
	   * SHIFT
	   */
	  SHIFT: 16,
	  /**
	   * CTRL
	   */
	  CTRL: 17,
	  /**
	   * ALT
	   */
	  ALT: 18,
	  /**
	   * PAUSE
	   */
	  PAUSE: 19,
	  /**
	   * CAPS_LOCK
	   */
	  CAPS_LOCK: 20,
	  /**
	   * ESC
	   */
	  ESC: 27,
	  /**
	   * SPACE
	   */
	  SPACE: 32,
	  /**
	   * PAGE_UP
	   */
	  PAGE_UP: 33, // also NUM_NORTH_EAST
	  /**
	   * PAGE_DOWN
	   */
	  PAGE_DOWN: 34, // also NUM_SOUTH_EAST
	  /**
	   * END
	   */
	  END: 35, // also NUM_SOUTH_WEST
	  /**
	   * HOME
	   */
	  HOME: 36, // also NUM_NORTH_WEST
	  /**
	   * LEFT
	   */
	  LEFT: 37, // also NUM_WEST
	  /**
	   * UP
	   */
	  UP: 38, // also NUM_NORTH
	  /**
	   * RIGHT
	   */
	  RIGHT: 39, // also NUM_EAST
	  /**
	   * DOWN
	   */
	  DOWN: 40, // also NUM_SOUTH
	  /**
	   * PRINT_SCREEN
	   */
	  PRINT_SCREEN: 44,
	  /**
	   * INSERT
	   */
	  INSERT: 45, // also NUM_INSERT
	  /**
	   * DELETE
	   */
	  DELETE: 46, // also NUM_DELETE
	  /**
	   * ZERO
	   */
	  ZERO: 48,
	  /**
	   * ONE
	   */
	  ONE: 49,
	  /**
	   * TWO
	   */
	  TWO: 50,
	  /**
	   * THREE
	   */
	  THREE: 51,
	  /**
	   * FOUR
	   */
	  FOUR: 52,
	  /**
	   * FIVE
	   */
	  FIVE: 53,
	  /**
	   * SIX
	   */
	  SIX: 54,
	  /**
	   * SEVEN
	   */
	  SEVEN: 55,
	  /**
	   * EIGHT
	   */
	  EIGHT: 56,
	  /**
	   * NINE
	   */
	  NINE: 57,
	  /**
	   * QUESTION_MARK
	   */
	  QUESTION_MARK: 63, // needs localization
	  /**
	   * A
	   */
	  A: 65,
	  /**
	   * B
	   */
	  B: 66,
	  /**
	   * C
	   */
	  C: 67,
	  /**
	   * D
	   */
	  D: 68,
	  /**
	   * E
	   */
	  E: 69,
	  /**
	   * F
	   */
	  F: 70,
	  /**
	   * G
	   */
	  G: 71,
	  /**
	   * H
	   */
	  H: 72,
	  /**
	   * I
	   */
	  I: 73,
	  /**
	   * J
	   */
	  J: 74,
	  /**
	   * K
	   */
	  K: 75,
	  /**
	   * L
	   */
	  L: 76,
	  /**
	   * M
	   */
	  M: 77,
	  /**
	   * N
	   */
	  N: 78,
	  /**
	   * O
	   */
	  O: 79,
	  /**
	   * P
	   */
	  P: 80,
	  /**
	   * Q
	   */
	  Q: 81,
	  /**
	   * R
	   */
	  R: 82,
	  /**
	   * S
	   */
	  S: 83,
	  /**
	   * T
	   */
	  T: 84,
	  /**
	   * U
	   */
	  U: 85,
	  /**
	   * V
	   */
	  V: 86,
	  /**
	   * W
	   */
	  W: 87,
	  /**
	   * X
	   */
	  X: 88,
	  /**
	   * Y
	   */
	  Y: 89,
	  /**
	   * Z
	   */
	  Z: 90,
	  /**
	   * META
	   */
	  META: 91, // WIN_KEY_LEFT
	  /**
	   * WIN_KEY_RIGHT
	   */
	  WIN_KEY_RIGHT: 92,
	  /**
	   * CONTEXT_MENU
	   */
	  CONTEXT_MENU: 93,
	  /**
	   * NUM_ZERO
	   */
	  NUM_ZERO: 96,
	  /**
	   * NUM_ONE
	   */
	  NUM_ONE: 97,
	  /**
	   * NUM_TWO
	   */
	  NUM_TWO: 98,
	  /**
	   * NUM_THREE
	   */
	  NUM_THREE: 99,
	  /**
	   * NUM_FOUR
	   */
	  NUM_FOUR: 100,
	  /**
	   * NUM_FIVE
	   */
	  NUM_FIVE: 101,
	  /**
	   * NUM_SIX
	   */
	  NUM_SIX: 102,
	  /**
	   * NUM_SEVEN
	   */
	  NUM_SEVEN: 103,
	  /**
	   * NUM_EIGHT
	   */
	  NUM_EIGHT: 104,
	  /**
	   * NUM_NINE
	   */
	  NUM_NINE: 105,
	  /**
	   * NUM_MULTIPLY
	   */
	  NUM_MULTIPLY: 106,
	  /**
	   * NUM_PLUS
	   */
	  NUM_PLUS: 107,
	  /**
	   * NUM_MINUS
	   */
	  NUM_MINUS: 109,
	  /**
	   * NUM_PERIOD
	   */
	  NUM_PERIOD: 110,
	  /**
	   * NUM_DIVISION
	   */
	  NUM_DIVISION: 111,
	  /**
	   * F1
	   */
	  F1: 112,
	  /**
	   * F2
	   */
	  F2: 113,
	  /**
	   * F3
	   */
	  F3: 114,
	  /**
	   * F4
	   */
	  F4: 115,
	  /**
	   * F5
	   */
	  F5: 116,
	  /**
	   * F6
	   */
	  F6: 117,
	  /**
	   * F7
	   */
	  F7: 118,
	  /**
	   * F8
	   */
	  F8: 119,
	  /**
	   * F9
	   */
	  F9: 120,
	  /**
	   * F10
	   */
	  F10: 121,
	  /**
	   * F11
	   */
	  F11: 122,
	  /**
	   * F12
	   */
	  F12: 123,
	  /**
	   * NUMLOCK
	   */
	  NUMLOCK: 144,
	  /**
	   * SEMICOLON
	   */
	  SEMICOLON: 186, // needs localization
	  /**
	   * DASH
	   */
	  DASH: 189, // needs localization
	  /**
	   * EQUALS
	   */
	  EQUALS: 187, // needs localization
	  /**
	   * COMMA
	   */
	  COMMA: 188, // needs localization
	  /**
	   * PERIOD
	   */
	  PERIOD: 190, // needs localization
	  /**
	   * SLASH
	   */
	  SLASH: 191, // needs localization
	  /**
	   * APOSTROPHE
	   */
	  APOSTROPHE: 192, // needs localization
	  /**
	   * SINGLE_QUOTE
	   */
	  SINGLE_QUOTE: 222, // needs localization
	  /**
	   * OPEN_SQUARE_BRACKET
	   */
	  OPEN_SQUARE_BRACKET: 219, // needs localization
	  /**
	   * BACKSLASH
	   */
	  BACKSLASH: 220, // needs localization
	  /**
	   * CLOSE_SQUARE_BRACKET
	   */
	  CLOSE_SQUARE_BRACKET: 221, // needs localization
	  /**
	   * WIN_KEY
	   */
	  WIN_KEY: 224,
	  /**
	   * MAC_FF_META
	   */
	  MAC_FF_META: 224, // Firefox (Gecko) fires this for the meta key instead of 91
	  /**
	   * WIN_IME
	   */
	  WIN_IME: 229
	};
	
	/*
	 whether text and modified key is entered at the same time.
	 */
	KeyCode.isTextModifyingKeyEvent = function (e) {
	  var keyCode = e.keyCode;
	  if (e.altKey && !e.ctrlKey || e.metaKey ||
	      // Function keys don't generate text
	    keyCode >= KeyCode.F1 && keyCode <= KeyCode.F12) {
	    return false;
	  }
	
	  // The following keys are quite harmless, even in combination with
	  // CTRL, ALT or SHIFT.
	  switch (keyCode) {
	    case KeyCode.ALT:
	    case KeyCode.CAPS_LOCK:
	    case KeyCode.CONTEXT_MENU:
	    case KeyCode.CTRL:
	    case KeyCode.DOWN:
	    case KeyCode.END:
	    case KeyCode.ESC:
	    case KeyCode.HOME:
	    case KeyCode.INSERT:
	    case KeyCode.LEFT:
	    case KeyCode.MAC_FF_META:
	    case KeyCode.META:
	    case KeyCode.NUMLOCK:
	    case KeyCode.NUM_CENTER:
	    case KeyCode.PAGE_DOWN:
	    case KeyCode.PAGE_UP:
	    case KeyCode.PAUSE:
	    case KeyCode.PRINT_SCREEN:
	    case KeyCode.RIGHT:
	    case KeyCode.SHIFT:
	    case KeyCode.UP:
	    case KeyCode.WIN_KEY:
	    case KeyCode.WIN_KEY_RIGHT:
	      return false;
	    default:
	      return true;
	  }
	};
	
	/*
	 whether character is entered.
	 */
	KeyCode.isCharacterKey = function (keyCode) {
	  if (keyCode >= KeyCode.ZERO &&
	    keyCode <= KeyCode.NINE) {
	    return true;
	  }
	
	  if (keyCode >= KeyCode.NUM_ZERO &&
	    keyCode <= KeyCode.NUM_MULTIPLY) {
	    return true;
	  }
	
	  if (keyCode >= KeyCode.A &&
	    keyCode <= KeyCode.Z) {
	    return true;
	  }
	
	  // Safari sends zero key code for non-latin characters.
	  if (window.navigation.userAgent.indexOf('WebKit') !== -1 && keyCode === 0) {
	    return true;
	  }
	
	  switch (keyCode) {
	    case KeyCode.SPACE:
	    case KeyCode.QUESTION_MARK:
	    case KeyCode.NUM_PLUS:
	    case KeyCode.NUM_MINUS:
	    case KeyCode.NUM_PERIOD:
	    case KeyCode.NUM_DIVISION:
	    case KeyCode.SEMICOLON:
	    case KeyCode.DASH:
	    case KeyCode.EQUALS:
	    case KeyCode.COMMA:
	    case KeyCode.PERIOD:
	    case KeyCode.SLASH:
	    case KeyCode.APOSTROPHE:
	    case KeyCode.SINGLE_QUOTE:
	    case KeyCode.OPEN_SQUARE_BRACKET:
	    case KeyCode.BACKSLASH:
	    case KeyCode.CLOSE_SQUARE_BRACKET:
	      return true;
	    default:
	      return false;
	  }
	};
	
	module.exports = KeyCode;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2014, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	* @providesModule ReactComponentWithPureRenderMixin
	*/
	
	"use strict";
	
	var shallowEqual = __webpack_require__(12);
	
	/**
	 * If your React component's render function is "pure", e.g. it will render the
	 * same result given the same props and state, provide this Mixin for a
	 * considerable performance boost.
	 *
	 * Most React components have pure render functions.
	 *
	 * Example:
	 *
	 *   var ReactComponentWithPureRenderMixin =
	 *     require('ReactComponentWithPureRenderMixin');
	 *   React.createClass({
	 *     mixins: [ReactComponentWithPureRenderMixin],
	 *
	 *     render: function() {
	 *       return <div className={this.props.className}>foo</div>;
	 *     }
	 *   });
	 *
	 * Note: This only checks shallow equality for props and state. If these contain
	 * complex data structures this mixin may have false-negatives for deeper
	 * differences. Only mixin to components which have simple props and state, or
	 * use `forceUpdate()` when you know deep data structures have changed.
	 */
	var ReactComponentWithPureRenderMixin = {
	  shouldComponentUpdate: function(nextProps, nextState) {
	    return !shallowEqual(this.props, nextProps) ||
	           !shallowEqual(this.state, nextState);
	  }
	};
	
	module.exports = ReactComponentWithPureRenderMixin;


/***/ },
/* 12 */
/***/ function(module, exports) {

	/**
	 * Copyright 2013-2014, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule shallowEqual
	 */
	
	"use strict";
	
	/**
	 * Performs equality by iterating through keys on an object and returning
	 * false when any key has values which are not strictly equal between
	 * objA and objB. Returns true when the values of all keys are strictly equal.
	 *
	 * @return {boolean}
	 */
	function shallowEqual(objA, objB) {
	  if (objA === objB) {
	    return true;
	  }
	  var key;
	  // Test for A's keys different from B.
	  for (key in objA) {
	    if (objA.hasOwnProperty(key) &&
	        (!objB.hasOwnProperty(key) || objA[key] !== objB[key])) {
	      return false;
	    }
	  }
	  // Test for B's keys missing from A.
	  for (key in objB) {
	    if (objB.hasOwnProperty(key) && !objA.hasOwnProperty(key)) {
	      return false;
	    }
	  }
	  return true;
	}
	
	module.exports = shallowEqual;


/***/ },
/* 13 */
/***/ function(module, exports) {

	/**
	 * Safe chained function
	 *
	 * Will only create a new function if needed,
	 * otherwise will pass back existing functions or null.
	 *
	 * @returns {function|null}
	 */
	function createChainedFunction() {
	  var args = arguments;
	
	  return function chainedFunction() {
	    for (var i = 0; i < args.length; i++) {
	      if (args[i] && args[i].apply) {
	        args[i].apply(this, arguments);
	      }
	    }
	  };
	}
	
	module.exports = createChainedFunction;


/***/ },
/* 14 */
/***/ function(module, exports) {

	module.exports = function (target, eventType, callback) {
	  if (target.addEventListener) {
	    target.addEventListener(eventType, callback, false);
	    return {
	      remove: function () {
	        target.removeEventListener(eventType, callback, false);
	      }
	    };
	  } else if (target.attachEvent) {
	    target.attachEvent('on' + eventType, callback);
	    return {
	      remove: function () {
	        target.detachEvent('on' + eventType, callback);
	      }
	    };
	  }
	};


/***/ },
/* 15 */
/***/ function(module, exports) {

	module.exports = function (root, node) {
	  while (node) {
	    if (node === root) {
	      return true;
	    }
	    node = node.parentNode;
	  }
	
	  return false;
	};


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var React = __webpack_require__(2);
	
	module.exports = function (children) {
	  var ret = [];
	  React.Children.forEach(children, function (c) {
	    ret.push(c);
	  });
	  return ret;
	};


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var React = __webpack_require__(2);
	
	function mirror(o) {
	  return o;
	}
	
	module.exports = function (children) {
	  // return ReactFragment
	  return React.Children.map(children, mirror);
	};


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(19);


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var util = __webpack_require__(20);
	
	function scrollIntoView(elem, container, config) {
	  config = config || {};
	  // document 归一化到 window
	  if (container.nodeType === 9) {
	    container = util.getWindow(container);
	  }
	
	  var allowHorizontalScroll = config.allowHorizontalScroll;
	  var onlyScrollIfNeeded = config.onlyScrollIfNeeded;
	  var alignWithTop = config.alignWithTop;
	  var alignWithLeft = config.alignWithLeft;
	
	  allowHorizontalScroll = allowHorizontalScroll === undefined ? true : allowHorizontalScroll;
	
	  var isWin = util.isWindow(container);
	  var elemOffset = util.offset(elem);
	  var eh = util.outerHeight(elem);
	  var ew = util.outerWidth(elem);
	  var containerOffset, ch, cw, containerScroll,
	    diffTop, diffBottom, win,
	    winScroll, ww, wh;
	
	  if (isWin) {
	    win = container;
	    wh = util.height(win);
	    ww = util.width(win);
	    winScroll = {
	      left: util.scrollLeft(win),
	      top: util.scrollTop(win)
	    };
	    // elem 相对 container 可视视窗的距离
	    diffTop = {
	      left: elemOffset.left - winScroll.left,
	      top: elemOffset.top - winScroll.top
	    };
	    diffBottom = {
	      left: elemOffset.left + ew - (winScroll.left + ww),
	      top: elemOffset.top + eh - (winScroll.top + wh)
	    };
	    containerScroll = winScroll;
	  } else {
	    containerOffset = util.offset(container);
	    ch = container.clientHeight;
	    cw = container.clientWidth;
	    containerScroll = {
	      left: container.scrollLeft,
	      top: container.scrollTop
	    };
	    // elem 相对 container 可视视窗的距离
	    // 注意边框, offset 是边框到根节点
	    diffTop = {
	      left: elemOffset.left - (containerOffset.left +
	      (parseFloat(util.css(container, 'borderLeftWidth')) || 0)),
	      top: elemOffset.top - (containerOffset.top +
	      (parseFloat(util.css(container, 'borderTopWidth')) || 0))
	    };
	    diffBottom = {
	      left: elemOffset.left + ew -
	      (containerOffset.left + cw +
	      (parseFloat(util.css(container, 'borderRightWidth')) || 0)),
	      top: elemOffset.top + eh -
	      (containerOffset.top + ch +
	      (parseFloat(util.css(container, 'borderBottomWidth')) || 0))
	    };
	  }
	
	  if (diffTop.top < 0 || diffBottom.top > 0) {
	    // 强制向上
	    if (alignWithTop === true) {
	      util.scrollTop(container, containerScroll.top + diffTop.top);
	    } else if (alignWithTop === false) {
	      util.scrollTop(container, containerScroll.top + diffBottom.top);
	    } else {
	      // 自动调整
	      if (diffTop.top < 0) {
	        util.scrollTop(container, containerScroll.top + diffTop.top);
	      } else {
	        util.scrollTop(container, containerScroll.top + diffBottom.top);
	      }
	    }
	  } else {
	    if (!onlyScrollIfNeeded) {
	      alignWithTop = alignWithTop === undefined ? true : !!alignWithTop;
	      if (alignWithTop) {
	        util.scrollTop(container, containerScroll.top + diffTop.top);
	      } else {
	        util.scrollTop(container, containerScroll.top + diffBottom.top);
	      }
	    }
	  }
	
	  if (allowHorizontalScroll) {
	    if (diffTop.left < 0 || diffBottom.left > 0) {
	      // 强制向上
	      if (alignWithLeft === true) {
	        util.scrollLeft(container, containerScroll.left + diffTop.left);
	      } else if (alignWithLeft === false) {
	        util.scrollLeft(container, containerScroll.left + diffBottom.left);
	      } else {
	        // 自动调整
	        if (diffTop.left < 0) {
	          util.scrollLeft(container, containerScroll.left + diffTop.left);
	        } else {
	          util.scrollLeft(container, containerScroll.left + diffBottom.left);
	        }
	      }
	    } else {
	      if (!onlyScrollIfNeeded) {
	        alignWithLeft = alignWithLeft === undefined ? true : !!alignWithLeft;
	        if (alignWithLeft) {
	          util.scrollLeft(container, containerScroll.left + diffTop.left);
	        } else {
	          util.scrollLeft(container, containerScroll.left + diffBottom.left);
	        }
	      }
	    }
	  }
	}
	
	module.exports = scrollIntoView;


/***/ },
/* 20 */
/***/ function(module, exports) {

	var RE_NUM = /[\-+]?(?:\d*\.|)\d+(?:[eE][\-+]?\d+|)/.source;
	
	function getClientPosition(elem) {
	  var box, x, y;
	  var doc = elem.ownerDocument;
	  var body = doc.body;
	  var docElem = doc && doc.documentElement;
	  // 根据 GBS 最新数据，A-Grade Browsers 都已支持 getBoundingClientRect 方法，不用再考虑传统的实现方式
	  box = elem.getBoundingClientRect();
	
	  // 注：jQuery 还考虑减去 docElem.clientLeft/clientTop
	  // 但测试发现，这样反而会导致当 html 和 body 有边距/边框样式时，获取的值不正确
	  // 此外，ie6 会忽略 html 的 margin 值，幸运地是没有谁会去设置 html 的 margin
	
	  x = box.left;
	  y = box.top;
	
	  // In IE, most of the time, 2 extra pixels are added to the top and left
	  // due to the implicit 2-pixel inset border.  In IE6/7 quirks mode and
	  // IE6 standards mode, this border can be overridden by setting the
	  // document element's border to zero -- thus, we cannot rely on the
	  // offset always being 2 pixels.
	
	  // In quirks mode, the offset can be determined by querying the body's
	  // clientLeft/clientTop, but in standards mode, it is found by querying
	  // the document element's clientLeft/clientTop.  Since we already called
	  // getClientBoundingRect we have already forced a reflow, so it is not
	  // too expensive just to query them all.
	
	  // ie 下应该减去窗口的边框吧，毕竟默认 absolute 都是相对窗口定位的
	  // 窗口边框标准是设 documentElement ,quirks 时设置 body
	  // 最好禁止在 body 和 html 上边框 ，但 ie < 9 html 默认有 2px ，减去
	  // 但是非 ie 不可能设置窗口边框，body html 也不是窗口 ,ie 可以通过 html,body 设置
	  // 标准 ie 下 docElem.clientTop 就是 border-top
	  // ie7 html 即窗口边框改变不了。永远为 2
	  // 但标准 firefox/chrome/ie9 下 docElem.clientTop 是窗口边框，即使设了 border-top 也为 0
	
	  x -= docElem.clientLeft || body.clientLeft || 0;
	  y -= docElem.clientTop || body.clientTop || 0;
	
	  return {left: x, top: y};
	}
	
	function getScroll(w, top) {
	  var ret = w['page' + (top ? 'Y' : 'X') + 'Offset'];
	  var method = 'scroll' + (top ? 'Top' : 'Left');
	  if (typeof ret !== 'number') {
	    var d = w.document;
	    //ie6,7,8 standard mode
	    ret = d.documentElement[method];
	    if (typeof ret !== 'number') {
	      //quirks mode
	      ret = d.body[method];
	    }
	  }
	  return ret;
	}
	
	function getScrollLeft(w) {
	  return getScroll(w);
	}
	
	function getScrollTop(w) {
	  return getScroll(w, true);
	}
	
	function getOffset(el) {
	  var pos = getClientPosition(el);
	  var doc = el.ownerDocument;
	  var w = doc.defaultView || doc.parentWindow;
	  pos.left += getScrollLeft(w);
	  pos.top += getScrollTop(w);
	  return pos;
	}
	function _getComputedStyle(elem, name, computedStyle) {
	  var val = '';
	  var d = elem.ownerDocument;
	
	  // https://github.com/kissyteam/kissy/issues/61
	  if ((computedStyle = (computedStyle || d.defaultView.getComputedStyle(elem, null)))) {
	    val = computedStyle.getPropertyValue(name) || computedStyle[name];
	  }
	
	  return val;
	}
	
	var _RE_NUM_NO_PX = new RegExp('^(' + RE_NUM + ')(?!px)[a-z%]+$', 'i');
	var RE_POS = /^(top|right|bottom|left)$/,
	  CURRENT_STYLE = 'currentStyle',
	  RUNTIME_STYLE = 'runtimeStyle',
	  LEFT = 'left',
	  PX = 'px';
	
	function _getComputedStyleIE(elem, name) {
	  // currentStyle maybe null
	  // http://msdn.microsoft.com/en-us/library/ms535231.aspx
	  var ret = elem[CURRENT_STYLE] && elem[CURRENT_STYLE][name];
	
	  // 当 width/height 设置为百分比时，通过 pixelLeft 方式转换的 width/height 值
	  // 一开始就处理了! CUSTOM_STYLE.height,CUSTOM_STYLE.width ,cssHook 解决@2011-08-19
	  // 在 ie 下不对，需要直接用 offset 方式
	  // borderWidth 等值也有问题，但考虑到 borderWidth 设为百分比的概率很小，这里就不考虑了
	
	  // From the awesome hack by Dean Edwards
	  // http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291
	  // If we're not dealing with a regular pixel number
	  // but a number that has a weird ending, we need to convert it to pixels
	  // exclude left right for relativity
	  if (_RE_NUM_NO_PX.test(ret) && !RE_POS.test(name)) {
	    // Remember the original values
	    var style = elem.style,
	      left = style[LEFT],
	      rsLeft = elem[RUNTIME_STYLE][LEFT];
	
	    // prevent flashing of content
	    elem[RUNTIME_STYLE][LEFT] = elem[CURRENT_STYLE][LEFT];
	
	    // Put in the new values to get a computed value out
	    style[LEFT] = name === 'fontSize' ? '1em' : (ret || 0);
	    ret = style.pixelLeft + PX;
	
	    // Revert the changed values
	    style[LEFT] = left;
	
	    elem[RUNTIME_STYLE][LEFT] = rsLeft;
	  }
	  return ret === '' ? 'auto' : ret;
	}
	
	var getComputedStyleX;
	if (typeof window !== 'undefined') {
	  getComputedStyleX = window.getComputedStyle ? _getComputedStyle : _getComputedStyleIE;
	}
	
	// 设置 elem 相对 elem.ownerDocument 的坐标
	function setOffset(elem, offset) {
	  // set position first, in-case top/left are set even on static elem
	  if (css(elem, 'position') === 'static') {
	    elem.style.position = 'relative';
	  }
	
	  var old = getOffset(elem),
	    ret = {},
	    current, key;
	
	  for (key in offset) {
	    current = parseFloat(css(elem, key)) || 0;
	    ret[key] = current + offset[key] - old[key];
	  }
	  css(elem, ret);
	}
	
	function each(arr, fn) {
	  for (var i = 0; i < arr.length; i++) {
	    fn(arr[i]);
	  }
	}
	
	function isBorderBoxFn(elem) {
	  return getComputedStyleX(elem, 'boxSizing') === 'border-box';
	}
	
	var BOX_MODELS = ['margin', 'border', 'padding'],
	  CONTENT_INDEX = -1,
	  PADDING_INDEX = 2,
	  BORDER_INDEX = 1,
	  MARGIN_INDEX = 0;
	
	function swap(elem, options, callback) {
	  var old = {},
	    style = elem.style,
	    name;
	
	  // Remember the old values, and insert the new ones
	  for (name in options) {
	    old[name] = style[name];
	    style[name] = options[name];
	  }
	
	  callback.call(elem);
	
	  // Revert the old values
	  for (name in options) {
	    style[name] = old[name];
	  }
	}
	
	function getPBMWidth(elem, props, which) {
	  var value = 0, prop, j, i;
	  for (j = 0; j < props.length; j++) {
	    prop = props[j];
	    if (prop) {
	      for (i = 0; i < which.length; i++) {
	        var cssProp;
	        if (prop === 'border') {
	          cssProp = prop + which[i] + 'Width';
	        } else {
	          cssProp = prop + which[i];
	        }
	        value += parseFloat(getComputedStyleX(elem, cssProp)) || 0;
	      }
	    }
	  }
	  return value;
	}
	
	/**
	 * A crude way of determining if an object is a window
	 * @member util
	 */
	function isWindow(obj) {
	  // must use == for ie8
	  /*jshint eqeqeq:false*/
	  return obj != null && obj == obj.window;
	}
	
	var domUtils = {};
	
	each(['Width', 'Height'], function (name) {
	  domUtils['doc' + name] = function (refWin) {
	    var d = refWin.document;
	    return Math.max(
	      //firefox chrome documentElement.scrollHeight< body.scrollHeight
	      //ie standard mode : documentElement.scrollHeight> body.scrollHeight
	      d.documentElement['scroll' + name],
	      //quirks : documentElement.scrollHeight 最大等于可视窗口多一点？
	      d.body['scroll' + name],
	      domUtils['viewport' + name](d));
	  };
	
	  domUtils['viewport' + name] = function (win) {
	    // pc browser includes scrollbar in window.innerWidth
	    var prop = 'client' + name,
	      doc = win.document,
	      body = doc.body,
	      documentElement = doc.documentElement,
	      documentElementProp = documentElement[prop];
	    // 标准模式取 documentElement
	    // backcompat 取 body
	    return doc.compatMode === 'CSS1Compat' && documentElementProp ||
	      body && body[prop] || documentElementProp;
	  };
	});
	
	/*
	 得到元素的大小信息
	 @param elem
	 @param name
	 @param {String} [extra]  'padding' : (css width) + padding
	 'border' : (css width) + padding + border
	 'margin' : (css width) + padding + border + margin
	 */
	function getWH(elem, name, extra) {
	  if (isWindow(elem)) {
	    return name === 'width' ? domUtils.viewportWidth(elem) : domUtils.viewportHeight(elem);
	  } else if (elem.nodeType === 9) {
	    return name === 'width' ? domUtils.docWidth(elem) : domUtils.docHeight(elem);
	  }
	  var which = name === 'width' ? ['Left', 'Right'] : ['Top', 'Bottom'],
	    borderBoxValue = name === 'width' ? elem.offsetWidth : elem.offsetHeight;
	  var computedStyle = getComputedStyleX(elem);
	  var isBorderBox = isBorderBoxFn(elem, computedStyle);
	  var cssBoxValue = 0;
	  if (borderBoxValue == null || borderBoxValue <= 0) {
	    borderBoxValue = undefined;
	    // Fall back to computed then un computed css if necessary
	    cssBoxValue = getComputedStyleX(elem, name);
	    if (cssBoxValue == null || (Number(cssBoxValue)) < 0) {
	      cssBoxValue = elem.style[name] || 0;
	    }
	    // Normalize '', auto, and prepare for extra
	    cssBoxValue = parseFloat(cssBoxValue) || 0;
	  }
	  if (extra === undefined) {
	    extra = isBorderBox ? BORDER_INDEX : CONTENT_INDEX;
	  }
	  var borderBoxValueOrIsBorderBox = borderBoxValue !== undefined || isBorderBox;
	  var val = borderBoxValue || cssBoxValue;
	  if (extra === CONTENT_INDEX) {
	    if (borderBoxValueOrIsBorderBox) {
	      return val - getPBMWidth(elem, ['border', 'padding'],
	          which, computedStyle);
	    } else {
	      return cssBoxValue;
	    }
	  } else if (borderBoxValueOrIsBorderBox) {
	    return val + (extra === BORDER_INDEX ? 0 :
	        (extra === PADDING_INDEX ?
	          -getPBMWidth(elem, ['border'], which, computedStyle) :
	          getPBMWidth(elem, ['margin'], which, computedStyle)));
	  } else {
	    return cssBoxValue + getPBMWidth(elem, BOX_MODELS.slice(extra),
	        which, computedStyle);
	  }
	}
	
	var cssShow = {position: 'absolute', visibility: 'hidden', display: 'block'};
	
	// fix #119 : https://github.com/kissyteam/kissy/issues/119
	function getWHIgnoreDisplay(elem) {
	  var val, args = arguments;
	  // in case elem is window
	  // elem.offsetWidth === undefined
	  if (elem.offsetWidth !== 0) {
	    val = getWH.apply(undefined, args);
	  } else {
	    swap(elem, cssShow, function () {
	      val = getWH.apply(undefined, args);
	    });
	  }
	  return val;
	}
	
	each(['width', 'height'], function (name) {
	  var first = name.charAt(0).toUpperCase() + name.slice(1);
	  domUtils['outer' + first] = function (el, includeMargin) {
	    return el && getWHIgnoreDisplay(el, name, includeMargin ? MARGIN_INDEX : BORDER_INDEX);
	  };
	  var which = name === 'width' ? ['Left', 'Right'] : ['Top', 'Bottom'];
	
	  domUtils[name] = function (elem, val) {
	    if (val !== undefined) {
	      if (elem) {
	        var computedStyle = getComputedStyleX(elem);
	        var isBorderBox = isBorderBoxFn(elem);
	        if (isBorderBox) {
	          val += getPBMWidth(elem, ['padding', 'border'], which, computedStyle);
	        }
	        return css(elem, name, val);
	      }
	      return;
	    }
	    return elem && getWHIgnoreDisplay(elem, name, CONTENT_INDEX);
	  };
	});
	
	function css(el, name, value) {
	  if (typeof name === 'object') {
	    for (var i in name) {
	      css(el, i, name[i]);
	    }
	    return;
	  }
	  if (typeof value !== 'undefined') {
	    if (typeof value === 'number') {
	      value = value + 'px';
	    }
	    el.style[name] = value;
	  } else {
	    return getComputedStyleX(el, name);
	  }
	}
	
	function mix(to, from) {
	  for (var i in from) {
	    to[i] = from[i];
	  }
	  return to;
	}
	
	var utils = module.exports = {
	  getWindow: function (node) {
	    var doc = node.ownerDocument || node;
	    return doc.defaultView || doc.parentWindow;
	  },
	  offset: function (el, value) {
	    if (typeof value !== 'undefined') {
	      setOffset(el, value);
	    } else {
	      return getOffset(el);
	    }
	  },
	  isWindow: isWindow,
	  each: each,
	  css: css,
	  clone: function (obj) {
	    var ret = {};
	    for (var i in obj) {
	      ret[i] = obj[i];
	    }
	    var overflow = obj.overflow;
	    if (overflow) {
	      for (i in obj) {
	        ret.overflow[i] = obj.overflow[i];
	      }
	    }
	    return ret;
	  },
	  mix: mix,
	  scrollLeft: function (w, v) {
	    if (isWindow(w)) {
	      if (v === undefined) {
	        return getScrollLeft(w);
	      } else {
	        window.scrollTo(v, getScrollTop(w));
	      }
	    } else {
	      if (v === undefined) {
	        return w.scrollLeft;
	      } else {
	        w.scrollLeft = v;
	      }
	    }
	  },
	  scrollTop: function (w, v) {
	    if (isWindow(w)) {
	      if (v === undefined) {
	        return getScrollTop(w);
	      } else {
	        window.scrollTo(getScrollLeft(w), v);
	      }
	    } else {
	      if (v === undefined) {
	        return w.scrollTop;
	      } else {
	        w.scrollTop = v;
	      }
	    }
	  },
	  merge: function () {
	    var ret = {};
	    for (var i = 0; i < arguments.length; i++) {
	      utils.mix(ret, arguments[i]);
	    }
	    return ret;
	  },
	  viewportWidth: 0,
	  viewportHeight: 0
	};
	
	mix(utils, domUtils);


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	
	var _Menu = __webpack_require__(5);
	
	var _Menu2 = _interopRequireDefault(_Menu);
	
	var _react = __webpack_require__(2);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _rcUtil = __webpack_require__(6);
	
	var SubMenu = _react2['default'].createClass({
	  displayName: 'SubMenu',
	
	  propTypes: {
	    closeOnDeActive: _react2['default'].PropTypes.bool,
	    globalCloseOnDeActive: _react2['default'].PropTypes.bool,
	    openOnHover: _react2['default'].PropTypes.bool,
	    title: _react2['default'].PropTypes.node,
	    onClick: _react2['default'].PropTypes.func,
	    rootPrefixCls: _react2['default'].PropTypes.string,
	    multiple: _react2['default'].PropTypes.bool,
	    onSelect: _react2['default'].PropTypes.func,
	    onDeselect: _react2['default'].PropTypes.func,
	    onHover: _react2['default'].PropTypes.func
	  },
	
	  mixins: [__webpack_require__(22)],
	
	  getInitialState: function getInitialState() {
	    return {
	      activeFirst: false
	    };
	  },
	
	  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
	    if (!nextProps.active && this.isCloseOnDeActive()) {
	      this.setOpenState(false);
	    }
	  },
	
	  getDefaultProps: function getDefaultProps() {
	    return {
	      onMouseEnter: function onMouseEnter() {},
	      title: ''
	    };
	  },
	
	  onKeyDown: function onKeyDown(e) {
	    var keyCode = e.keyCode;
	    var menu = this.menuInstance;
	
	    if (keyCode === _rcUtil.KeyCode.ENTER) {
	      this.onClick(e);
	      this.setState({
	        activeFirst: true
	      });
	      return true;
	    }
	
	    if (keyCode === _rcUtil.KeyCode.RIGHT) {
	      if (this.state.open) {
	        menu.onKeyDown(e);
	      } else {
	        this.setOpenState(true);
	        this.setState({
	          activeFirst: true
	        });
	      }
	      return true;
	    }
	    if (keyCode === _rcUtil.KeyCode.LEFT) {
	      var handled = undefined;
	      if (this.state.open) {
	        handled = menu.onKeyDown(e);
	      } else {
	        return undefined;
	      }
	      if (!handled) {
	        this.setOpenState(false);
	        handled = true;
	      }
	      return handled;
	    }
	
	    if (this.state.open && (keyCode === _rcUtil.KeyCode.UP || keyCode === _rcUtil.KeyCode.DOWN)) {
	      return menu.onKeyDown(e);
	    }
	  },
	
	  onMouseEnter: function onMouseEnter() {
	    var props = this.props;
	    props.onHover(props.eventKey);
	    var openOnHover = props.openOnHover;
	    if (openOnHover === undefined) {
	      openOnHover = props.globalOpenOnHover;
	    }
	    if (openOnHover === undefined) {
	      openOnHover = true;
	    }
	    if (openOnHover) {
	      this.setOpenState(true);
	      this.setState({
	        activeFirst: false
	      });
	    }
	  },
	
	  onMouseLeave: function onMouseLeave() {
	    if (!this.state.open) {
	      this.props.onHover(null);
	    }
	  },
	
	  onClick: function onClick() {
	    if (this.isCloseOnDeActive()) {
	      this.setOpenState(true);
	    } else {
	      this.setOpenState(!this.state.open);
	    }
	    this.setState({
	      activeFirst: false
	    });
	  },
	
	  onSubMenuClick: function onSubMenuClick(key, menuItem, e) {
	    this.props.onClick(key, menuItem, e);
	  },
	
	  onSelect: function onSelect(childKey, child, e) {
	    // propagate
	    this.props.onSelect(childKey, child, e);
	  },
	
	  onDeselect: function onDeselect() {
	    this.props.onDeselect.apply(null, arguments);
	  },
	
	  getPrefixCls: function getPrefixCls() {
	    return this.props.rootPrefixCls + '-submenu';
	  },
	
	  getActiveClassName: function getActiveClassName() {
	    return this.getPrefixCls() + '-active';
	  },
	
	  getDisabledClassName: function getDisabledClassName() {
	    return this.getPrefixCls() + '-disabled';
	  },
	
	  renderChildren: function renderChildren(children) {
	    var props = this.props;
	    if (!this.state.open) {
	      // prevent destroy
	      return this._cacheMenu || null;
	    }
	    var childrenCount = _react2['default'].Children.count(children);
	    var mode = props.mode;
	    if (mode !== 'inline') {
	      mode = undefined;
	    }
	    var baseProps = {
	      sub: true,
	      level: props.level + 1,
	      inlineIndent: props.inlineIndent,
	      openOnHover: props.globalOpenOnHover,
	      closeOnDeActive: props.globalCloseOnDeActive,
	      focusable: false,
	      onClick: this.onSubMenuClick,
	      onSelect: this.onSelect,
	      onDeselect: this.onDeselect,
	      activeFirst: this.state.activeFirst,
	      multiple: props.multiple,
	      prefixCls: props.rootPrefixCls,
	      id: this._menuId,
	      ref: this.saveMenuInstance
	    };
	    if (mode) {
	      baseProps.mode = mode;
	    }
	    if (childrenCount === 1 && children.type === _Menu2['default']) {
	      var menu = children;
	      baseProps.ref = (0, _rcUtil.createChainedFunction)(menu.ref, this.saveMenuInstance);
	      baseProps.onClick = (0, _rcUtil.createChainedFunction)(menu.props.onClick, this.onSubMenuClick);
	      this._cacheMenu = _react2['default'].cloneElement(menu, baseProps);
	    } else {
	      this._cacheMenu = _react2['default'].createElement(
	        _Menu2['default'],
	        baseProps,
	        children
	      );
	    }
	    return this._cacheMenu;
	  },
	
	  render: function render() {
	    var _classes;
	
	    var props = this.props;
	    var prefixCls = this.getPrefixCls();
	    var classes = (_classes = {}, _defineProperty(_classes, props.className, !!props.className), _defineProperty(_classes, prefixCls + '-' + props.mode, 1), _classes);
	
	    classes[this.getOpenClassName()] = this.state.open;
	    classes[this.getActiveClassName()] = props.active;
	    classes[this.getDisabledClassName()] = props.disabled;
	    this._menuId = this._menuId || (0, _rcUtil.guid)();
	    classes[prefixCls] = true;
	    classes[prefixCls + '-' + props.mode] = 1;
	    var clickEvents = {};
	    var mouseEvents = {};
	    var titleMouseEvents = {};
	    if (!props.disabled) {
	      clickEvents = {
	        onClick: this.onClick
	      };
	      mouseEvents = {
	        onMouseLeave: this.onMouseLeave
	      };
	      // only works in title, not outer li
	      titleMouseEvents = {
	        onMouseEnter: this.onMouseEnter
	      };
	    }
	    var style = {};
	    if (props.mode === 'inline') {
	      style.paddingLeft = props.inlineIndent * props.level;
	    }
	    return _react2['default'].createElement(
	      'li',
	      _extends({ className: (0, _rcUtil.classSet)(classes) }, mouseEvents),
	      _react2['default'].createElement(
	        'div',
	        _extends({
	          style: style,
	          className: prefixCls + '-title'
	        }, titleMouseEvents, clickEvents, {
	          'aria-expanded': props.active,
	          'aria-owns': this._menuId,
	          'aria-haspopup': 'true'
	        }),
	        props.title
	      ),
	      this.renderChildren(props.children)
	    );
	  },
	
	  saveMenuInstance: function saveMenuInstance(c) {
	    this.menuInstance = c;
	  },
	
	  isCloseOnDeActive: function isCloseOnDeActive() {
	    var closeOnDeActive = this.props.closeOnDeActive;
	    if (closeOnDeActive === undefined) {
	      closeOnDeActive = this.props.globalCloseOnDeActive;
	    }
	    if (closeOnDeActive === undefined) {
	      closeOnDeActive = true;
	    }
	    return closeOnDeActive;
	  }
	});
	
	exports['default'] = SubMenu;
	module.exports = exports['default'];

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _rcUtil = __webpack_require__(6);
	
	var _rcUtil2 = _interopRequireDefault(_rcUtil);
	
	exports['default'] = {
	  getInitialState: function getInitialState() {
	    return {
	      open: this.props.open || false
	    };
	  },
	
	  getOpenClassName: function getOpenClassName() {
	    return this.props.openClassName || this.props.rootPrefixCls + '-submenu-open';
	  },
	
	  setOpenState: function setOpenState(newState, onStateChangeComplete) {
	    if (this.state.open !== newState) {
	      if (newState) {
	        this.bindRootCloseHandlers();
	      } else {
	        this.unbindRootCloseHandlers();
	      }
	
	      this.setState({
	        open: newState
	      }, onStateChangeComplete);
	    }
	  },
	
	  handleDocumentKeyUp: function handleDocumentKeyUp(e) {
	    if (e.keyCode === _rcUtil.KeyCode.ESC) {
	      this.setOpenState(false);
	    }
	  },
	
	  handleDocumentClick: function handleDocumentClick(e) {
	    // If the click originated from within this component
	    // don't do anything.
	    if (_rcUtil2['default'].Dom.contains(React.findDOMNode(this), e.target)) {
	      return;
	    }
	    // de active menu cause sub menu hide its menu
	    this.props.onHover(null);
	  },
	
	  bindRootCloseHandlers: function bindRootCloseHandlers() {
	    this._onDocumentClickListener = _rcUtil2['default'].Dom.addEventListener(document, 'click', this.handleDocumentClick);
	    this._onDocumentKeyupListener = _rcUtil2['default'].Dom.addEventListener(document, 'keyup', this.handleDocumentKeyUp);
	  },
	
	  unbindRootCloseHandlers: function unbindRootCloseHandlers() {
	    if (this._onDocumentClickListener) {
	      this._onDocumentClickListener.remove();
	    }
	
	    if (this._onDocumentKeyupListener) {
	      this._onDocumentKeyupListener.remove();
	    }
	  },
	
	  componentWillUnmount: function componentWillUnmount() {
	    this.unbindRootCloseHandlers();
	  }
	};
	module.exports = exports['default'];

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _react = __webpack_require__(2);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _rcUtil = __webpack_require__(6);
	
	var MenuItem = (function (_React$Component) {
	  _inherits(MenuItem, _React$Component);
	
	  function MenuItem(props) {
	    var _this = this;
	
	    _classCallCheck(this, MenuItem);
	
	    _get(Object.getPrototypeOf(MenuItem.prototype), 'constructor', this).call(this, props);
	    ['onKeyDown', 'onMouseLeave', 'onMouseEnter', 'onClick'].forEach(function (m) {
	      _this[m] = _this[m].bind(_this);
	    });
	  }
	
	  _createClass(MenuItem, [{
	    key: 'componentWillUnmount',
	    value: function componentWillUnmount() {
	      var props = this.props;
	      if (props.onDestroy) {
	        props.onDestroy(props.eventKey);
	      }
	    }
	  }, {
	    key: 'onKeyDown',
	    value: function onKeyDown(e) {
	      var keyCode = e.keyCode;
	      if (keyCode === _rcUtil.KeyCode.ENTER) {
	        this.onClick(e);
	        return true;
	      }
	    }
	  }, {
	    key: 'onMouseLeave',
	    value: function onMouseLeave() {
	      this.props.onHover(null);
	    }
	  }, {
	    key: 'onMouseEnter',
	    value: function onMouseEnter() {
	      var props = this.props;
	      props.onHover(props.eventKey);
	    }
	  }, {
	    key: 'onClick',
	    value: function onClick(e) {
	      var props = this.props;
	      var eventKey = props.eventKey;
	      props.onClick(eventKey, this, e);
	      if (props.multiple) {
	        if (props.selected) {
	          props.onDeselect(eventKey, this, e);
	        } else {
	          props.onSelect(eventKey, this, e);
	        }
	      } else if (!props.selected) {
	        props.onSelect(eventKey, this, e);
	      }
	    }
	  }, {
	    key: 'getPrefixCls',
	    value: function getPrefixCls() {
	      return this.props.rootPrefixCls + '-item';
	    }
	  }, {
	    key: 'getActiveClassName',
	    value: function getActiveClassName() {
	      return this.getPrefixCls() + '-active';
	    }
	  }, {
	    key: 'getSelectedClassName',
	    value: function getSelectedClassName() {
	      return this.getPrefixCls() + '-selected';
	    }
	  }, {
	    key: 'getDisabledClassName',
	    value: function getDisabledClassName() {
	      return this.getPrefixCls() + '-disabled';
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var props = this.props;
	      var classes = {};
	      classes[this.getActiveClassName()] = !props.disabled && props.active;
	      classes[this.getSelectedClassName()] = props.selected;
	      classes[this.getDisabledClassName()] = props.disabled;
	      classes[this.getPrefixCls()] = true;
	      var attrs = {
	        title: props.title,
	        className: (0, _rcUtil.joinClasses)(props.className, (0, _rcUtil.classSet)(classes)),
	        role: 'menuitem',
	        'aria-selected': props.selected,
	        'aria-disabled': props.disabled
	      };
	      var mouseEvent = {};
	      if (!props.disabled) {
	        mouseEvent = {
	          onClick: this.onClick,
	          onMouseLeave: this.onMouseLeave,
	          onMouseEnter: this.onMouseEnter
	        };
	      }
	      var style = {};
	      if (props.mode === 'inline') {
	        style.paddingLeft = props.inlineIndent * props.level;
	      }
	      return _react2['default'].createElement(
	        'li',
	        _extends({ style: style
	        }, attrs, mouseEvent),
	        props.children
	      );
	    }
	  }]);
	
	  return MenuItem;
	})(_react2['default'].Component);
	
	MenuItem.propTypes = {
	  rootPrefixCls: _react2['default'].PropTypes.string,
	  active: _react2['default'].PropTypes.bool,
	  selected: _react2['default'].PropTypes.bool,
	  disabled: _react2['default'].PropTypes.bool,
	  title: _react2['default'].PropTypes.string,
	  onSelect: _react2['default'].PropTypes.func,
	  onClick: _react2['default'].PropTypes.func,
	  onDeselect: _react2['default'].PropTypes.func,
	  onHover: _react2['default'].PropTypes.func,
	  onDestroy: _react2['default'].PropTypes.func
	};
	
	MenuItem.defaultProps = {
	  onSelect: function onSelect() {},
	  onMouseEnter: function onMouseEnter() {}
	};
	
	exports['default'] = MenuItem;
	module.exports = exports['default'];

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _react = __webpack_require__(2);
	
	var _react2 = _interopRequireDefault(_react);
	
	var MenuItemGroup = (function (_React$Component) {
	  _inherits(MenuItemGroup, _React$Component);
	
	  function MenuItemGroup() {
	    _classCallCheck(this, MenuItemGroup);
	
	    _get(Object.getPrototypeOf(MenuItemGroup.prototype), 'constructor', this).apply(this, arguments);
	  }
	
	  _createClass(MenuItemGroup, [{
	    key: 'render',
	    value: function render() {
	      var props = this.props;
	      var className = props.className || '';
	      var rootPrefixCls = props.rootPrefixCls;
	      className += ' ' + rootPrefixCls + '-item-group';
	      var titleClassName = rootPrefixCls + '-item-group-title';
	      var listClassName = rootPrefixCls + '-item-group-list';
	      return _react2['default'].createElement(
	        'li',
	        { className: className },
	        _react2['default'].createElement(
	          'div',
	          { className: titleClassName },
	          props.title
	        ),
	        _react2['default'].createElement(
	          'ul',
	          { className: listClassName },
	          _react2['default'].Children.map(props.children, props.renderMenuItem)
	        )
	      );
	    }
	  }]);
	
	  return MenuItemGroup;
	})(_react2['default'].Component);
	
	MenuItemGroup.defaultProps = {
	  // skip key down loop
	  disabled: true
	};
	
	exports['default'] = MenuItemGroup;
	module.exports = exports['default'];

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _react = __webpack_require__(2);
	
	var _react2 = _interopRequireDefault(_react);
	
	var Divider = (function (_React$Component) {
	  _inherits(Divider, _React$Component);
	
	  function Divider() {
	    _classCallCheck(this, Divider);
	
	    _get(Object.getPrototypeOf(Divider.prototype), 'constructor', this).apply(this, arguments);
	  }
	
	  _createClass(Divider, [{
	    key: 'render',
	    value: function render() {
	      var props = this.props;
	      var className = props.className || '';
	      var rootPrefixCls = props.rootPrefixCls;
	      className += ' ' + (rootPrefixCls + '-item-divider');
	      return _react2['default'].createElement('li', _extends({}, props, { className: className }));
	    }
	  }]);
	
	  return Divider;
	})(_react2['default'].Component);
	
	Divider.defaultProps = {
	  disabled: true
	};
	
	exports['default'] = Divider;
	module.exports = exports['default'];

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(27);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(29)(content, {});
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		module.hot.accept("!!/Users/yiminghe/code/react-components/menu/node_modules/rc-tools/node_modules/css-loader/index.js?sourceMap!/Users/yiminghe/code/react-components/menu/node_modules/rc-tools/node_modules/less-loader/index.js?sourceMap!/Users/yiminghe/code/react-components/menu/assets/index.less", function() {
			var newContent = require("!!/Users/yiminghe/code/react-components/menu/node_modules/rc-tools/node_modules/css-loader/index.js?sourceMap!/Users/yiminghe/code/react-components/menu/node_modules/rc-tools/node_modules/less-loader/index.js?sourceMap!/Users/yiminghe/code/react-components/menu/assets/index.less");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(28)();
	exports.push([module.id, ".rc-menu {\n  outline: none;\n  margin-bottom: 0;\n  padding-left: 0;\n  list-style: none;\n  z-index: 99999;\n  border: 1px solid #d9d9d9;\n  box-shadow: 0 0 4px #d9d9d9;\n  border-radius: 3px;\n  color: #666;\n}\n.rc-menu-item-group-list {\n  margin: 0;\n  padding: 0;\n}\n.rc-menu-item-group-title {\n  color: #999;\n  line-height: 1.5;\n  padding: 8px 10px;\n  border-bottom: 1px solid #dedede;\n}\n.rc-menu-inline > .rc-menu-item-active,\n.rc-menu-submenu-inline.rc-menu-submenu-active,\n.rc-menu-submenu-inline.rc-menu-submenu-active > .rc-menu-submenu-title:hover {\n  background-color: #fff;\n}\n.rc-menu-inline > .rc-menu-item-active:hover,\n.rc-menu-item-active,\n.rc-menu-submenu-active,\n.rc-menu-submenu-inline.rc-menu-submenu-active > .rc-menu-submenu-title:hover {\n  background-color: #eaf8fe;\n}\n.rc-menu-item-selected {\n  background-color: #eaf8fe;\n}\n.rc-menu > li.rc-menu-submenu {\n  padding: 0;\n}\n.rc-menu-submenu-horizontal > .rc-menu {\n  top: 100%;\n  left: 0;\n  position: absolute;\n  min-width: 160px;\n  margin-top: 4px;\n}\n.rc-menu-submenu-vertical > .rc-menu {\n  top: 0;\n  left: 100%;\n  position: absolute;\n  min-width: 160px;\n  margin-left: 4px;\n}\n.rc-menu-item,\n.rc-menu-submenu-title {\n  margin: 0;\n  position: relative;\n  display: block;\n  padding: 7px 7px 7px 16px;\n  white-space: nowrap;\n}\n.rc-menu-item.rc-menu-item-disabled,\n.rc-menu-submenu-title.rc-menu-item-disabled,\n.rc-menu-item.rc-menu-submenu-disabled,\n.rc-menu-submenu-title.rc-menu-submenu-disabled {\n  color: #777 !important;\n}\n.rc-menu > .rc-menu-item-divider {\n  height: 1px;\n  margin: 1px 0;\n  overflow: hidden;\n  padding: 0;\n  line-height: 0;\n  background-color: #e5e5e5;\n}\n.rc-menu-submenu {\n  position: relative;\n}\n.rc-menu-submenu > .rc-menu {\n  display: none;\n  background-color: #fff;\n}\n.rc-menu-submenu-open > .rc-menu {\n  display: block;\n}\n.rc-menu .rc-menu-submenu-title .anticon,\n.rc-menu .rc-menu-item .anticon {\n  width: 14px;\n  height: 14px;\n  margin-right: 8px;\n  top: -1px;\n}\n.rc-menu-horizontal {\n  background-color: #F3F5F7;\n  border: none;\n  border-bottom: 1px solid transparent;\n  border-bottom: 1px solid #d9d9d9;\n  box-shadow: none;\n}\n.rc-menu-horizontal > .rc-menu-item,\n.rc-menu-horizontal > .rc-menu-submenu > .rc-menu-submenu-title {\n  padding: 15px 20px;\n}\n.rc-menu-horizontal > .rc-menu-submenu,\n.rc-menu-horizontal > .rc-menu-item {\n  float: left;\n  border-bottom: 2px solid transparent;\n}\n.rc-menu-horizontal > .rc-menu-submenu-active,\n.rc-menu-horizontal > .rc-menu-item-active {\n  border-bottom: 2px solid #2db7f5;\n  background-color: #F3F5F7;\n  color: #2baee9;\n}\n.rc-menu-horizontal:after {\n  content: \"\\20\";\n  display: block;\n  height: 0;\n  clear: both;\n}\n.rc-menu-vertical,\n.rc-menu-inline {\n  padding: 12px 0;\n}\n.rc-menu-vertical > .rc-menu-item,\n.rc-menu-inline > .rc-menu-item,\n.rc-menu-vertical > .rc-menu-submenu > .rc-menu-submenu-title,\n.rc-menu-inline > .rc-menu-submenu > .rc-menu-submenu-title {\n  padding: 12px 8px 12px 24px;\n}\n.rc-menu-vertical.rc-menu-sub {\n  padding: 0;\n}\n.rc-menu-sub.rc-menu-inline {\n  padding: 0;\n  border: none;\n  border-radius: 0;\n  box-shadow: none;\n}\n.rc-menu-sub.rc-menu-inline > .rc-menu-item,\n.rc-menu-sub.rc-menu-inline > .rc-menu-submenu > .rc-menu-submenu-title {\n  padding-top: 8px;\n  padding-bottom: 8px;\n  padding-right: 0;\n}\n", "", {"version":3,"sources":["index.less"],"names":[],"mappings":"AAEA,CAAC;EACC,aAAA;EACA,gBAAA;EACA,eAAA;EACA,gBAAA;EACA,cAAA;EACA,yBAAA;EACA,2BAAA;EACA,kBAAA;EACA,WAAA;;AAEA,CAXD,OAWE;EACC,SAAA;EACA,UAAA;;AAGF,CAhBD,OAgBE;EACC,WAAA;EACA,gBAAA;EACA,iBAAA;EACA,gCAAA;;AAGF,CAvBD,OAuBE,OAAQ,IAvBV,OAuBa;AACZ,CAxBD,OAwBE,eAAe,CAxBjB,OAwBkB;AACjB,CAzBD,OAyBE,eAAe,CAzBjB,OAyBkB,eAAgB,IAzBlC,OAyBqC,cAAc;EAChD,sBAAA;;AAGF,CA7BD,OA6BE,OAAQ,IA7BV,OA6Ba,YAAY;AACxB,CA9BD,OA8BE;AACD,CA/BD,OA+BE;AACD,CAhCD,OAgCE,eAAe,CAhCjB,OAgCkB,eAAgB,IAhClC,OAgCqC,cAAc;EAChD,yBAAA;;AAGF,CApCD,OAoCE;EACC,yBAAA;;AAGF,CAxCD,OAwCG,KAAI,CAxCP,OAwCQ;EACL,UAAA;;AAGF,CA5CD,OA4CE,mBAAoB,IAAG;EACtB,SAAA;EACA,OAAA;EACA,kBAAA;EACA,gBAAA;EACA,eAAA;;AAGF,CApDD,OAoDE,iBAAkB,IAAG;EACpB,MAAA;EACA,UAAA;EACA,kBAAA;EACA,gBAAA;EACA,gBAAA;;AAGF,CA5DD,OA4DE;AAAO,CA5DT,OA4DU;EACP,SAAA;EACA,kBAAA;EACA,cAAA;EACA,yBAAA;EACA,mBAAA;;AAGA,CApEH,OA4DE,KAQE,CAAC,OAAgB;AAAlB,CApEH,OA4DU,cAQN,CAAC,OAAgB;AAAgB,CApErC,OA4DE,KAQoC,CAAC,OAAgB;AAAlB,CApErC,OA4DU,cAQ4B,CAAC,OAAgB;EAClD,sBAAA;;AAGJ,CAxED,OAwEG,IAxEH,OAwEM;EACH,WAAA;EACA,aAAA;EACA,gBAAA;EACA,UAAA;EACA,cAAA;EACA,yBAAA;;AAGF,CAjFD,OAiFE;EACC,kBAAA;;AADF,CAjFD,OAiFE,QAGC,IAAG;EACD,aAAA;EACA,sBAAA;;AAGF,CAzFH,OAiFE,QAQE,KACC,IAAG;EACD,cAAA;;AA3FR,CAAC,OAgGC,EAAC,OAAgB,cACf;AAjGJ,CAAC,OAgGkC,EAAC,OAAgB,KAChD;EACE,WAAA;EACA,YAAA;EACA,iBAAA;EACA,SAAA;;AAIJ,CAzGD,OAyGE;EACC,yBAAA;EACA,YAAA;EACA,oCAAA;EACA,gCAAA;EACA,gBAAA;;AAEA,CAhHH,OAyGE,WAOG,IAAG,OAAgB;AAAO,CAhH/B,OAyGE,WAO+B,IAAG,OAAgB,QAAS,IAAG,OAAgB;EAC3E,kBAAA;;AAGF,CApHH,OAyGE,WAWG,IAAG,OAAgB;AAAU,CApHlC,OAyGE,WAWkC,IAAG,OAAgB;EAClD,WAAA;EACA,oCAAA;;AAEA,CAxHL,OAyGE,WAWG,IAAG,OAAgB,QAIlB;AAAD,CAxHL,OAyGE,WAWkC,IAAG,OAAgB,KAIjD;EACC,gCAAA;EACA,yBAAA;EACA,cAAA;;AAIJ,CA/HH,OAyGE,WAsBE;EACC,SAAS,KAAT;EACA,cAAA;EACA,SAAA;EACA,WAAA;;AAIJ,CAvID,OAuIE;AAAW,CAvIb,OAuIc;EACX,eAAA;;AACA,CAzIH,OAuIE,SAEG,IAAG,OAAgB;AAArB,CAzIH,OAuIc,OAET,IAAG,OAAgB;AAAO,CAzI/B,OAuIE,SAE+B,IAAG,OAAgB,QAAS,IAAG,OAAgB;AAAjD,CAzI/B,OAuIc,OAEmB,IAAG,OAAgB,QAAS,IAAG,OAAgB;EAC3E,2BAAA;;AAIJ,CA9ID,OA8IE,SAAS,CA9IX,OA8IY;EACT,UAAA;;AAGF,CAlJD,OAkJE,IAAI,CAlJN,OAkJO;EACJ,UAAA;EACA,YAAA;EACA,gBAAA;EACA,gBAAA;;AAEA,CAxJH,OAkJE,IAAI,CAlJN,OAkJO,OAMF,IAAG,OAAgB;AAAO,CAxJ/B,OAkJE,IAAI,CAlJN,OAkJO,OAM0B,IAAG,OAAgB,QAAS,IAAG,OAAgB;EAC3E,gBAAA;EACA,mBAAA;EACA,gBAAA","sourcesContent":["@menuPrefixCls: rc-menu;\n\n.@{menuPrefixCls} {\n  outline: none;\n  margin-bottom: 0;\n  padding-left: 0; // Override default ul/ol\n  list-style: none;\n  z-index: 99999;\n  border: 1px solid #d9d9d9;\n  box-shadow: 0 0 4px #d9d9d9;\n  border-radius: 3px;\n  color: #666;\n\n  &-item-group-list {\n    margin: 0;\n    padding: 0;\n  }\n\n  &-item-group-title {\n    color: #999;\n    line-height: 1.5;\n    padding: 8px 10px;\n    border-bottom: 1px solid #dedede;\n  }\n\n  &-inline > &-item-active,\n  &-submenu-inline&-submenu-active,\n  &-submenu-inline&-submenu-active > &-submenu-title:hover {\n    background-color: #fff;\n  }\n\n  &-inline > &-item-active:hover,\n  &-item-active,\n  &-submenu-active,\n  &-submenu-inline&-submenu-active > &-submenu-title:hover {\n    background-color: #eaf8fe;\n  }\n\n  &-item-selected {\n    background-color: #eaf8fe;\n  }\n\n  & > li&-submenu {\n    padding: 0;\n  }\n\n  &-submenu-horizontal > .@{menuPrefixCls} {\n    top: 100%;\n    left: 0;\n    position: absolute;\n    min-width: 160px;\n    margin-top: 4px;\n  }\n\n  &-submenu-vertical > .@{menuPrefixCls} {\n    top: 0;\n    left: 100%;\n    position: absolute;\n    min-width: 160px;\n    margin-left: 4px;\n  }\n\n  &-item, &-submenu-title {\n    margin: 0;\n    position: relative;\n    display: block;\n    padding: 7px 7px 7px 16px;\n    white-space: nowrap;\n\n    // Disabled state sets text to gray and nukes hover/tab effects\n    &.@{menuPrefixCls}-item-disabled, &.@{menuPrefixCls}-submenu-disabled {\n      color: #777 !important;\n    }\n  }\n  & > &-item-divider {\n    height: 1px;\n    margin: 1px 0;\n    overflow: hidden;\n    padding: 0;\n    line-height: 0;\n    background-color: #e5e5e5;\n  }\n\n  &-submenu {\n    position: relative;\n\n    > .@{menuPrefixCls} {\n      display: none;\n      background-color: #fff;\n    }\n\n    &-open {\n      > .@{menuPrefixCls} {\n        display: block;\n      }\n    }\n  }\n\n  .@{menuPrefixCls}-submenu-title, .@{menuPrefixCls}-item {\n    .anticon {\n      width: 14px;\n      height: 14px;\n      margin-right: 8px;\n      top: -1px;\n    }\n  }\n\n  &-horizontal {\n    background-color: #F3F5F7;\n    border: none;\n    border-bottom: 1px solid transparent;\n    border-bottom: 1px solid #d9d9d9;\n    box-shadow: none;\n\n    & > .@{menuPrefixCls}-item, & > .@{menuPrefixCls}-submenu > .@{menuPrefixCls}-submenu-title {\n      padding: 15px 20px;\n    }\n\n    & > .@{menuPrefixCls}-submenu, & > .@{menuPrefixCls}-item {\n      float: left;\n      border-bottom: 2px solid transparent;\n\n      &-active {\n        border-bottom: 2px solid #2db7f5;\n        background-color: #F3F5F7;\n        color: #2baee9;\n      }\n    }\n\n    &:after {\n      content: \"\\20\";\n      display: block;\n      height: 0;\n      clear: both;\n    }\n  }\n\n  &-vertical, &-inline {\n    padding: 12px 0;\n    & > .@{menuPrefixCls}-item, & > .@{menuPrefixCls}-submenu > .@{menuPrefixCls}-submenu-title {\n      padding: 12px 8px 12px 24px;\n    }\n  }\n\n  &-vertical&-sub {\n    padding: 0;\n  }\n\n  &-sub&-inline {\n    padding: 0;\n    border: none;\n    border-radius: 0;\n    box-shadow: none;\n\n    & > .@{menuPrefixCls}-item, & > .@{menuPrefixCls}-submenu > .@{menuPrefixCls}-submenu-title {\n      padding-top:8px;\n      padding-bottom: 8px;\n      padding-right: 0;\n    }\n  }\n}\n\n"]}]);

/***/ },
/* 28 */
/***/ function(module, exports) {

	module.exports = function() {
		var list = [];
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};
		return list;
	}

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isIE9 = memoize(function() {
			return /msie 9\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0;
	
	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}
	
		options = options || {};
		// Force single-tag solution on IE9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isIE9();
	
		var styles = listToStyles(list);
		addStylesToDom(styles, options);
	
		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}
	
	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}
	
	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}
	
	function createStyleElement() {
		var styleElement = document.createElement("style");
		var head = getHeadElement();
		styleElement.type = "text/css";
		head.appendChild(styleElement);
		return styleElement;
	}
	
	function addStyle(obj, options) {
		var styleElement, update, remove;
	
		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement());
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else {
			styleElement = createStyleElement();
			update = applyToTag.bind(null, styleElement);
			remove = function () {
				styleElement.parentNode.removeChild(styleElement);
			};
		}
	
		update(obj);
	
		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}
	
	function replaceText(source, id, replacement) {
		var boundaries = ["/** >>" + id + " **/", "/** " + id + "<< **/"];
		var start = source.lastIndexOf(boundaries[0]);
		var wrappedReplacement = replacement
			? (boundaries[0] + replacement + boundaries[1])
			: "";
		if (source.lastIndexOf(boundaries[0]) >= 0) {
			var end = source.lastIndexOf(boundaries[1]) + boundaries[1].length;
			return source.slice(0, start) + wrappedReplacement + source.slice(end);
		} else {
			return source + wrappedReplacement;
		}
	}
	
	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;
	
		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(styleElement.styleSheet.cssText, index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}
	
	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;
	
		if(sourceMap && typeof btoa === "function") {
			try {
				css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(JSON.stringify(sourceMap)) + " */";
				css = "@import url(\"data:text/css;base64," + btoa(css) + "\")";
			} catch(e) {}
		}
	
		if(media) {
			styleElement.setAttribute("media", media)
		}
	
		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}


/***/ }
/******/ ]);
//# sourceMappingURL=common.js.map