/** @jsx React.DOM */

var React = require('react');
var rcUtil = require('rc-util');
var joinClasses = rcUtil.joinClasses;
var classSet = rcUtil.classSet;
var createChainedFunction = rcUtil.createChainedFunction;
var assign = require("object-assign");
var KeyCode = rcUtil.KeyCode;
var scrollIntoView = require('dom-scroll-into-view');

function getActiveKey(props) {
  var activeKey = props.activeKey;
  var children = props.children;
  React.Children.forEach(children, (c) => {
    if (!c.key && !c.props.disabled) {
      throw new Error('MenuItem must have key!');
    }
  });
  if (activeKey) {
    return activeKey;
  }
  React.Children.forEach(children, (c)=> {
    if (c.props.active) {
      activeKey = c.key;
    }
  });
  if (!activeKey && props.activeFirst) {
    React.Children.forEach(children, (c)=> {
      if (!activeKey && !c.props.disabled) {
        activeKey = c.key;
      }
    });
    return activeKey;
  }
  return activeKey;
}

function saveRef(name, c) {
  this.instances = this.instances || {};
  this.instances[name] = c;
}

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: getActiveKey.call(this,props),
      selectedKeys: props.selectedKeys || []
    };

    ['handleItemHover', 'handleDeselect', 'handleSelect', 'handleKeyDown', 'handleDestroy'].forEach((m)=> {
      this[m] = this[m].bind(this);
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      activeKey: getActiveKey.call(this,nextProps),
      selectedKeys: nextProps.selectedKeys || []
    });
  }

  getChildrenComponents() {
    var ret = [];
    this.newChildren.forEach((c)=> {
      ret.push(this.instances[c.key]);
    });
    return ret;
  }

  // all keyboard events callbacks run from here at first
  handleKeyDown(e) {
    var keyCode = e.keyCode;
    var handled;
    this.newChildren.forEach((c)=> {
      var obj = this.instances[c.key];
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
        activeKey = this.step(-1);
        break;
      case KeyCode.DOWN: //down
        activeKey = this.step(1);
        break;
    }
    if (activeKey) {
      e.preventDefault();
      this.setState({
        activeKey: activeKey
      }, ()=> {
        scrollIntoView(React.findDOMNode(this.instances[activeKey]), React.findDOMNode(this), {
          onlyScrollIfNeeded: true
        });
      });
      return true;
    }
  }

  step(direction) {
    var children = this.newChildren;
    var activeKey = this.state.activeKey;
    var len = children.length;
    if (direction < 0) {
      children = children.concat().reverse();
    }
    // find current activeIndex
    var activeIndex = -1;
    children.every((c, i)=> {
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
  }

  handleItemHover(key) {
    this.setState({
      activeKey: key
    });
  }

  handleSelect(key, child) {
    var props = this.props;
    // not from submenu
    if (!props.sub) {
      if (!props.multiple) {
        var selectedDescendant = this.selectedDescendant;
        if (selectedDescendant) {
          if (selectedDescendant !== child) {
            var selectedDescendantProps = selectedDescendant.props;
            selectedDescendantProps.onDeselect(selectedDescendantProps.eventKey, selectedDescendant);
          }
        }
        this.selectedDescendant = child;
      }
    }
    var state = this.state;
    var selectedKeys = state.selectedKeys;
    // my child
    if (this.getChildrenComponents().indexOf(child) !== -1) {
      if (props.multiple) {
        selectedKeys.push(key);
      } else {
        state.selectedKeys = [key];
      }
      this.setState({
        selectedKeys: state.selectedKeys
      });
    }
    if (props.onSelect) {
      props.onSelect(key, child);
    }
  }

  handleDeselect(key, child) {
    var state = this.state;
    var selectedKeys = state.selectedKeys;
    // my children
    if (this.getChildrenComponents().indexOf(child) !== -1) {
      var index = selectedKeys.indexOf(key);
      if (index !== -1) {
        selectedKeys.splice(index, 1);
        this.setState({
          selectedKeys: state.selectedKeys
        });
      }
    }
    if (this.props.onDeselect) {
      this.props.onDeselect(key, child);
    }
  }

  handleDestroy(key) {
    var state = this.state;
    var selectedKeys = state.selectedKeys;
    var index = selectedKeys.indexOf(key);
    if (index !== -1) {
      selectedKeys.splice(index, 1);
      this.setState({
        selectedKeys: state.selectedKeys
      });
    }
  }

  renderMenuItem(child) {
    var key = child.key;
    var state = this.state;
    var props = this.props;
    var baseProps = {
      rootPrefixCls: props.prefixCls,
      ref: createChainedFunction(child.ref, saveRef.bind(this, key)),
      eventKey: key
    };
    var childProps = child.props;
    if (childProps.disabled) {
      return React.cloneElement(child, baseProps);
    }
    var newProps = {
      onHover: this.handleItemHover,
      active: key === state.activeKey,
      multiple: props.multiple,
      selected: state.selectedKeys.indexOf(key) !== -1,
      onDeselect: createChainedFunction(childProps.onDeselect, this.handleDeselect),
      onDestroy: this.handleDestroy,
      onSelect: createChainedFunction(childProps.onSelect, this.handleSelect)
    };
    assign(newProps, baseProps);
    return React.cloneElement(child, newProps);
  }

  render() {
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

    this.newChildren = rcUtil.Children.toArray(props.children).map(this.renderMenuItem, this);
    return (
      <ul
        {...domProps}>
      {this.newChildren}
      </ul>
    );
  }
}

Menu.propTypes = {
  focusable: React.PropTypes.bool,
  multiple: React.PropTypes.bool,
  onSelect: React.PropTypes.func,
  onDeselect: React.PropTypes.func,
  activeFirst: React.PropTypes.bool,
  activeKey: React.PropTypes.string,
  selectedKeys: React.PropTypes.arrayOf(React.PropTypes.string)
};

Menu.defaultProps = {
  prefixCls: 'rc-menu',
  focusable: true
};

module.exports = Menu;
