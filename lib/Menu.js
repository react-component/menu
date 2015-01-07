/** @jsx React.DOM */

/**
 *    Menu
 */

var React = require('react');
var joinClasses = require('./utils/joinClasses');
var classSet = require('./utils/classSet');
var cloneWithProps = require('./utils/cloneWithProps');
var createChainedFunction = require('./utils/createChainedFunction');
var ValidComponentChildren = require('./utils/ValidComponentChildren');

var Menu = React.createClass({
  propTypes: {
    onSelect: React.PropTypes.func,
    eventKey: React.PropTypes.any
  },
  getInitialState: function () {
    var res = this.traverseChildren();
    this.itemAmount = res.itemAmount;

    return {
      keyboardKey: '',
      activeIndex: res.activeIndex
    };
  },

  render: function () {
    var classes = {};
    //this.props['onKeyDown'] = this.handleKeyDown

    this.itemIndex = 0;
    return (
      <ul
        {...this.props}
        ref={"_menu" + Date.now()}
        onKeyDown={this.handleKeyDown}
        className={joinClasses(this.props.className, classSet(classes))}
        tabIndex="0"
      >
      {this.newPropsChildren = ValidComponentChildren.map(this.props.children, this.renderMenuItem)}
      </ul>
    );
  },
  //traverse children
  //Calculate the amount of MenuItem or SubMenu in all children
  //Get the active(highlight) child
  traverseChildren: function () {
    var itemAmount = 0;
    var active, activeIndex = null;
    React.Children.forEach(this.props.children, function (child) {
      if (React.isValidElement(child)) {
        var name = child.type.displayName;

        if (!child.props.divider &&
          (name === 'MenuItem' || name === 'SubMenu')) {

          //console.log( child.type.prototype.isMounted() );
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

  //keydown event
  handleKeyDown: function (e) {

    if (!/(13|37|38|39|40)/.test(e.keyCode)) {
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

    var num = 0;
    switch (e.keyCode) {
      case 38: //up
        num = -1;
        //this.setState({keyboardKey: 'up'})
        break;
      case 40: //down
        num = 1;
        //this.setState({keyboardKey: 'down'})
        break;
      case 37: //left
        //this.setState({keyboardKey: 'left'})
        return true;
      case 39: //right
      //this.setState({keyboardKey: 'right'})
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

  selectItem: function (activeIndex, isOpen) {
    var st = {activeIndex: activeIndex};
    if (isOpen != null) {
      st.open = isOpen;
    }
    this.setState(st);
  },

  renderMenuItem: function (child, index) {
    var name = child.type.displayName;
    if (child.props.divider || name !== 'MenuItem' && name !== 'SubMenu') {
      return child;
    }

    var active = this.itemIndex === this.state.activeIndex;

    var newProps = {
      _keyboardKey: this.state.keyboardKey,
      _itemIndex: this.itemIndex,
      selectItem: this.selectItem,
      active: active,
      onSelect: createChainedFunction(child.props.onSelect, this.props.onSelect),
      ref: child.ref ? child.ref : name + index + '_' + Date.now(),
      key: child.key ? child.key : index
    };

    if (name === 'SubMenu') {
      newProps.open = this.state.open;
    }

    var node = cloneWithProps(child, newProps);

    this.itemIndex++;
    return node;
  },
  getChildActiveProp: function (child) {
    if (child.props.active ||
      (this.props.activeKey != null && child.props.eventKey === this.props.activeKey)) {
      return true;
    }

    return child.props.active;
  }
});

module.exports = Menu;
