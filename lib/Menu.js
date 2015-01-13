/** @jsx React.DOM */

/**
 *    Menu
 */

var React = require('react');
var joinClasses = require('./utils/joinClasses');
var classSet = require('./utils/classSet');
var cloneWithProps = require('./utils/cloneWithProps');
var ValidComponentChildren = require('./utils/ValidComponentChildren');
var createChainedFunction = require('./utils/createChainedFunction');
var assign = require("./utils/Object.assign");
var util = require('./utils/util');
var KeyCode = util.KeyCode;

var Menu = React.createClass({
  propTypes: {
    canFocus: React.PropTypes.bool,
    onSelect: React.PropTypes.func,
    eventKey: React.PropTypes.any
  },
  getDefaultProps: function () {
    return {
      canFocus: false
    };
  },
  getInitialState: function () {
    var res = this.traverseChildren();
    this.itemAmount = res.itemAmount;

    return {
      activeIndex: res.activeIndex
    };
  },
  //Calculate the amount of MenuItem or SubMenu in all children
  //Get the active(highlight) child
  traverseChildren: function () {
    var itemAmount = 0;
    var active, activeIndex = null;
    React.Children.forEach(this.props.children, function (child) {
      if (React.isValidElement(child)) {
        var name = child.type.displayName;
        if (!child.props.divider &&
          !child.props.disabled &&
          (name === util.keywords.MenuItem || name === util.keywords.SubMenu)) {
          if (!active) {
            active = this.getChildActiveProp(child);
            if (active) {
              activeIndex = itemAmount;
            }
          }
          itemAmount++;
        }
      }
    }, this);
    return {
      itemAmount: itemAmount,
      active: active,
      activeIndex: activeIndex
    };
  },
  getChildActiveProp: function (child) {
    if (child.props.active ||
      this.props.activeKey != null &&
      child.props.eventKey === this.props.activeKey) {
      return true;
    }
  },

  // all keyboard events callbacks run from here at first
  handleKeyDown: function (e) {
    var keyCode = e.keyCode;
    if (keyCode !== KeyCode.ENTER &&
      keyCode !== KeyCode.LEFT &&
      keyCode !== KeyCode.RIGHT &&
      keyCode !== KeyCode.UP &&
      keyCode !== KeyCode.DOWN) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    var back = false;
    React.Children.forEach(this.newPropsChildren, function (c) {
      var obj = this.refs[c.ref];
      if (c.props.active) {
        back = obj.handleKeyDown(e);
      }
    }, this);

    if (back) {
      return;
    }
    this._open = false;

    var num = 0;
    switch (keyCode) {
      case KeyCode.UP: //up
        num = -1;
        break;
      case KeyCode.DOWN: //down
        num = 1;
        break;
      case KeyCode.LEFT: //left
        return true;
      case KeyCode.RIGHT: //right
        return;
    }

    this.setActiveIndex(num);

  },
  setActiveIndex: function (num) {
    var activeIndex = this.state.activeIndex;
    if (activeIndex === null) {
      this.setState({activeIndex: 0});
      return;
    }

    activeIndex += num;

    //end to first || first to end
    if (activeIndex < 0) {
      activeIndex = this.itemAmount - 1;
    }
    if (activeIndex > this.itemAmount - 1) {
      activeIndex = 0;
    }
    this.setState({activeIndex: activeIndex});

    return activeIndex;
  },
  _open: false,
  selectItem: function (activeChild, isClickOpen) {
    var activeIndex = null;
    if (activeChild) {
      activeIndex = activeChild.props._itemIndex;
      if (activeChild.props.openWhenHover || isClickOpen){
        this._open = true;
      } else {
        this._open = false;
      }
    } else {
      this._open = false;
    }
    this.setState({activeIndex: activeIndex});
  },
  render: function () {
    var classes = {};
    this.itemIndex = 0;
    return (
      <ul
        {...this.props}
        //ref={"_menu" + util.guid()}
        ref="_menu"
        onKeyDown={this.handleKeyDown}
        className={joinClasses(this.props.className, classSet(classes))}
        tabIndex={this.props.canFocus ? '0' : '-1'}
        role="menu"
        aria-activedescendant=""
      >
      {this.newPropsChildren = ValidComponentChildren.map(this.props.children, this.renderMenuItem)}
      </ul>
    );
  },

  renderMenuItem: function (child, index) {
    var name = child.type.displayName;
    var baseProps = {
      ref: child.ref ? child.ref : name + util.guid(),
      key: child.key ? child.key : index
    };

    if (child.props.divider ||
      child.props.disabled ||
      name !== util.keywords.MenuItem && name !== util.keywords.SubMenu) {
      return cloneWithProps(child, baseProps);
    }

    var active = this.itemIndex === this.state.activeIndex;

    var newProps = {
      _itemIndex: this.itemIndex,
      selectItem: this.selectItem,
      active: active,
      //onSelect: child.props.onSelect,
      onSelect: createChainedFunction(child.props.onSelect, this.props.onSelect)
    };

    if (name === util.keywords.SubMenu) {
      if (this._open && active) {
        newProps.open = true;
      } else {
        newProps.open = false;
      }
    }
    assign(newProps, baseProps);

    var node = cloneWithProps(child, newProps);

    this.itemIndex++;
    return node;
  }
});

module.exports = Menu;
