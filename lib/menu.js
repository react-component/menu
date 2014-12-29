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
  getDefaultProps: function () {
    return {
      bsClass: 'nav'
    };
  },
  render: function () {
    var classes = {};
    classes[this.props.bsClass] = true;

    this.props['onKeyDown'] = this.handleKeyDown

    return (
      <ul
        {...this.props}
        //onKeyDown={this.handleKeyDown}
        className={joinClasses(this.props.className, classSet(classes))}
        >
        {ValidComponentChildren.map(this.props.children, this.renderNavItem)}
      </ul>
    );
  },

  //keydown event
  handleKeyDown: function (e) {
    console.log( 'key' );

    if (!/(37|38|39|40)/.test(e.keyCode)) return
    e.preventDefault()
    e.stopPropagation()


    var len = 0
    var eles = []
    React.Children.forEach(this.props.children, function (child, index) {
      if (React.isValidElement(child)) {
        console.log( index );
        if(index == 0){
          child.props.active = true
        }
        switch (child.type.displayName) {
          case 'MenuItem':
            if(!child.props.divider){
              len++
            }
            break;
          case 'SubMenu':
            console.log(1);
            break;
        }

      }
    })

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
    if (this.props.activeHref != null) {
      if (child.props.href === this.props.activeHref) {
        return true;
      }
    }

    return child.props.active;
  },
  renderNavItem: function (child, index) {
    return cloneWithProps(
      child,
      {
        active: this.getChildActiveProp(child),
        activeKey: this.props.activeKey,
        activeHref: this.props.activeHref,
        onSelect: createChainedFunction(child.props.onSelect, this.props.onSelect),
        ref: child.ref,
        key: child.key ? child.key : index,
        navItem: true
      }
    );
  }
})

module.exports = Menu;
