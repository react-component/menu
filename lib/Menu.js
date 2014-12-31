/** @jsx React.DOM */

/**
*menu
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
    return {
      _focusIndex: 0
    };
  },
  render: function () {
    var classes = {};
    //this.props['onKeyDown'] = this.handleKeyDown
    this.itemAmount = this.traverseChildren()
    this.itemIndex = 0

    return (
      <ul
        {...this.props}
        onKeyDown={this.handleKeyDown}
        className={joinClasses(this.props.className, classSet(classes))}
        >
      {ValidComponentChildren.map(this.props.children, this.renderMenuItem)}
      </ul>
    );
  },
  //traverse children
  //Calculate the amount of MenuItem in all children
  traverseChildren: function (children) {
    var itemAmount = 0;
    React.Children.forEach(this.props.children, function (child, index) {
      if (React.isValidElement(child)) {
        if( !child.props.divider ){
          //console.log( child.type.prototype.isMounted() );
          itemAmount++;
        }
      }
    });
    return itemAmount;
  },

  //keydown event
  handleKeyDown: function (e) {

    if (!/(37|38|39|40)/.test(e.keyCode)) return
    e.preventDefault()
    e.stopPropagation()

    console.log( e.target );

    var num = 0

    switch (e.keyCode) {
      case 38: //up
        num = -1
        this.setState({
          _focusIndex: num
        })
        break;
      case 40: //down
        num = 1
        this.setState({
          _focusIndex: num
        })
        break;
    }

    if(this.preActive != null){
      console.log( this.preActive, this.state._focusIndex, num );
      this.preActive += num
      if(this.preActive < 0) {
        this.preActive = this.itemAmount - 1
      }
      if(this.preActive > this.itemAmount - 1){
        this.preActive = 0
      }

    }

  },
  preActive: null,

  renderMenuItem: function (child, index) {
    var name = child.type.displayName
    if(child.props.divider || name != 'MenuItem' && name != 'SubMenu' ) return child;

    var active = this.getChildActiveProp(child)

    if(this.state._focusIndex != 0){
      if(active || this.preActive != null){
        active = this.itemIndex == this.preActive
      } else {
        if(this.itemIndex == 0){
          active = true
          this.preActive = 0
        }
      }
    } else {
      if (active) {
        this.preActive = this.itemIndex
      }
    }


    var node = cloneWithProps(
      child,
      {
        _itemIndex: this.itemIndex,
        _itemAmount: this.itemAmount,
        _focusIndex: this.state._focusIndex,
        active: active,
        onSelect: createChainedFunction(child.props.onSelect, this.props.onSelect),
        ref: child.ref,
        key: child.key ? child.key : index
      }
    );

    this.itemIndex++;
    return node;
  },
  getChildActiveProp: function (child) {
    if (child.props.active) {
      return true;
    }
    if (this.props.activeKey != null) {
      if (child.props.eventKey == this.props.activeKey) {
        return true;
      }
    }

    return child.props.active;
  }
})

module.exports = Menu;
