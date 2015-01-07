/** @jsx React.DOM */

/**
 *  SubMenu
 *  - thanks react-bootstrap
 *  - Reference DropdownButton.jsx
 * */

var React = require('react');
var joinClasses = require('./utils/joinClasses');
var classSet = require('./utils/classSet');
var cloneWithProps = require('./utils/cloneWithProps');
//var createChainedFunction = require('./utils/createChainedFunction');
//var ValidComponentChildren = require('./utils/ValidComponentChildren');

var SubMenuStateMixin = require('./SubMenuStateMixin');

var SubMenu = React.createClass({
  propTypes: {
    title: React.PropTypes.node,
    buttonClass: React.PropTypes.string,
    href: React.PropTypes.string,
    onClick: React.PropTypes.func
  },

  mixins: [SubMenuStateMixin],

  getDefaultProps: function () {
    return {
      title: '',
      buttonClass: ''
    };
  },

  handleKeyDown: function (e) {
    //console.log( this.refs );
    //console.log( 'subMenu handleKeyDown' );
    var menu = this.refs[this.nameRef];

    if (e.keyCode === 39) {
      if (this.state.open) {
        menu.handleKeyDown(e);
      } else {
        this.handleClick(e);
      }
      return true;
    }
    if (e.keyCode === 37) {
      var back = false;
      if (this.state.open) {
        back = menu.handleKeyDown(e);
      } else {
        return back;
      }
      if (back) {
        this.setState({open: false});
      }
      return true;
    }

    if (this.state.open && (e.keyCode === 40 || e.keyCode === 38)) { //up or down
      menu.handleKeyDown(e);
      return true;
    }

  },

  handleHover: function (e) {
    this.handleClick(e);
    //var type = e.type
    //var selectItem = this.props.selectItem
    //if(type == 'mouseenter'){
    //  selectItem(this.props._itemIndex, true)
    //} else if(type == 'mouseleave'){
    //  selectItem(null, false)
    //}
  },

  handleClick: function (e) {
    e.preventDefault();
    this.setDropdownState(!this.state.open);
  },

  render: function () {
    var classes = {
      open: this.state.open,
      active: this.props.active
    };

    return (
      <li
        onMouseEnter={this.handleHover}
        onMouseLeave={this.handleHover}
        className={joinClasses(this.props.className, classSet(classes))}>
        <a
          {...this.props}
          ref={"subMenuButton" + Date.now()}
          //href={this.props.href || '#'}
          title={null}
          buttonClass={null}
          className={this.props.buttonClass}
          onClick={this.handleClick}
        >
        {this.props.title}
        </a>
          {this.newPropsChildren = this.renderChildren(this.props.children)}
        {/*
         <Menu ref="menu" className="dropdown-menu">
         {ValidComponentChildren.map(this.props.children, this.renderMenuItem)}
         </Menu>
         */}
      </li>
    );
  },
  //renderMenuItem: function (child, index) {
  //  return cloneWithProps(
  //    child,
  //    {
  //      // Force special props to be transferred
  //      key: child.key ? child.key : index,
  //      ref: child.ref
  //    }
  //  );
  //},
  renderChildren: function (children) {
    try {
      var menu = React.Children.only(children);
      this.nameRef = menu.ref || '__menu' + Date.now() + Math.random();
      if (React.isValidElement(menu) && menu.type.displayName === 'Menu') {
        return cloneWithProps(menu, {
          ref: this.nameRef,
          key: menu.key || Date.now()
        });
      }
    } catch (e) {
      console.log('SubMenu must have one child and it should be <Menu>...</Menu>');
    }
  }
});

module.exports = SubMenu;
