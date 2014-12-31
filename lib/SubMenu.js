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
var createChainedFunction = require('./utils/createChainedFunction');
var ValidComponentChildren = require('./utils/ValidComponentChildren');

var SubMenuStateMixin = require('./SubMenuStateMixin');
//var Menu = require('./Menu');
var single = require('./single');

var SubMenu = React.createClass({
  mixins: [SubMenuStateMixin],

  propTypes: {
    hover: React.PropTypes.bool,
    title:     React.PropTypes.node,
    buttonClass:  React.PropTypes.string,
    href:      React.PropTypes.string,
    onClick:   React.PropTypes.func
  },
  getDefaultProps: function () {
    return {
      title: '',
      buttonClass: ''
    };
  },

  focusEle: function () {
    if(this.props.active && this.refs.subMenuButton){
      this.refs.subMenuButton.getDOMNode().focus()
      if(this.state.open){
        var menu = this.refs[this.nameRef].getDOMNode()
        for (var i = 0; i < menu.children.length; i++) {
          var obj = menu.children[i];
          if(obj.tagName == 'LI' && obj.className.split(' ').indexOf('active') > -1){
            var aEle = obj.getElementsByTagName('a')
            if(aEle.length){
              aEle[0].focus()
              return
            }
          }
        }
        if(menu.children.length && menu.children[0].tagName == 'LI'){
          var aEle = menu.children[0].getElementsByTagName('a')
          if(aEle.length){
            aEle[0].focus()
          }
        }
      }
    }
  },
  componentDidMount: function () {
    if(!single.haveFoucsed){
      this.focusEle()
      single.haveFoucs = true
    }
  },
  componentDidUpdate: function () {
    //console.log( 'up...' )
    this.focusEle()
  },

  render: function () {
    var classes = {
      'open': this.state.open,
      'active': this.props.active
    };

    return (
      <li
        onMouseEnter={this.handleHover}
        onMouseLeave={this.handleHover}
        className={joinClasses(this.props.className, classSet(classes))}>
        <a
          {...this.props}
          ref="subMenuButton"
          href={this.props.href || '#'}
          title={null}
          buttonClass={null}
          className={this.props.buttonClass}
          onClick={this.handleClick}
          onKeyDown={this.handleKeyDown}
          >
        {this.props.title}
        </a>
        {this.renderChildren(this.props.children)}
      </li>
    );
  },
  renderChildren: function (children) {
    try{
      var menu = React.Children.only(children)
      this.nameRef = menu.ref || '__menu'
      if(React.isValidElement(menu) && menu.type.displayName == 'Menu'){
        return cloneWithProps(menu, {
          ref: this.nameRef
        })
      }
    }catch(e){
      console.log( 'SubMenu must have one child and it should be <Menu>...</Menu>' );
    }
  },

  //keydown event
  handleKeyDown: function (e) {

  },

  //mouse events
  handleHover: function (e) {
    if(this.props.hover){
      this.handleClick(e)
    }
  },

  handleClick: function (e) {
    e.preventDefault();

    this.setDropdownState(!this.state.open);
  }
});

module.exports = SubMenu;
