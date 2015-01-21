/** @jsx React.DOM */

var React = require('react');
var joinClasses = require('./utils/joinClasses');
var classSet = require('./utils/classSet');
var cloneWithProps = require('./utils/cloneWithProps');
var createChainedFunction = require('./utils/createChainedFunction');
var assign = require("./utils/Object.assign");
var util = require('./utils/util');
var KeyCode = util.KeyCode;

function getActiveKey(activeKey, children) {
  React.Children.forEach(children, function (c) {
    // make key persistent
    // menu setState => menu render => menu's generated newChildren does not cause children key change x=>x item mount and unmount
    var key = c.props.eventKey = c.props.eventKey || c.key || util.guid();
    if (c.props.active) {
      activeKey = key;
    }
  });
  return activeKey;
}

var Menu = React.createClass({
  propTypes: {
    focusable: React.PropTypes.bool,
    onSelect: React.PropTypes.func
  },

  getDefaultProps: function () {
    return {
      prefixCls: 'rc-menu',
      focusable: true
    };
  },

  getInitialState: function () {
    return {
      activeKey: getActiveKey(this.props.activeKey, this.props.children)
    };
  },

  componentWillReceiveProps: function (nextProps) {
    this.setState({
      activeKey: getActiveKey(nextProps.activeKey, nextProps.children)
    });
  },

  // all keyboard events callbacks run from here at first
  handleKeyDown: function (e) {
    var keyCode = e.keyCode;
    var handled;
    var self = this;
    this.newChildren.forEach(function (c) {
      var obj = self.refs[c.ref];
      if (c.props.active) {
        handled = obj.handleKeyDown(e);
      }
    });
    if (handled) {
      return true;
    }
    var activeKey;
    switch (keyCode) {
      case KeyCode.UP: //up
        activeKey = self.step(0, -1);
        break;
      case KeyCode.DOWN: //down
        activeKey = self.step(0, 1);
        break;
    }
    if (activeKey) {
      e.preventDefault();
      this.setState({
        activeKey: activeKey
      });
      return true;
    }
  },

  step: function (active, direction) {
    var children = this.newChildren;
    var activeKey = this.state.activeKey;
    var len = children.length;
    if (direction < 0) {
      children = children.concat().reverse();
    }
    // find current activeIndex
    var activeIndex = -1;
    children.every(function (c, i) {
      if (c.key === activeKey) {
        activeIndex = i;
        return false;
      }
      return true;
    });
    var start = (activeIndex + 1) % len;
    var i = start;
    while (1) {
      var child = children[i];
      var key = child.key;
      if (child.props.disabled) {
        i = (i + 1 + len) % len;
        // complete a loop
        if (i === start) {
          return null;
        }
      } else {
        return key;
      }
    }
  },

  handleItemMouseEnter: function (key) {
    this.setState({
      activeKey: key
    });
  },

  render: function () {
    var props = this.props;
    var classes = {};
    classes[props.prefixCls] = true;
    var domProps = {
      className: joinClasses(props.className, classSet(classes)),
      role: "menu",
      "aria-activedescendant": ""
    };
    if (props.id) {
      domProps.id = props.id;
    }
    if (props.focusable) {
      domProps.tabIndex = '0';
      domProps.onKeyDown = this.handleKeyDown;
    }

    this.newChildren = util.toArray(props.children).map(this.renderMenuItem, this);
    return (
      <ul
        {...domProps}>
      {this.newChildren}
      </ul>
    );
  },

  renderMenuItem: function (child) {
    var key = child.props.eventKey;
    var ref = child.ref || util.guid();
    var props = this.props;
    var baseProps = {
      rootPrefixCls: props.prefixCls,
      ref: ref,
      key: key
    };
    var childProps = child.props;
    if (childProps.disabled) {
      return cloneWithProps(child, baseProps);
    }
    var newProps = {
      onMouseEnter: this.handleItemMouseEnter,
      active: key === this.state.activeKey,
      onSelect: createChainedFunction(childProps.onSelect, props.onSelect)
    };
    assign(newProps, baseProps);
    return cloneWithProps(child, newProps);
  }
});

module.exports = Menu;
