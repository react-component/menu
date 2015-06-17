'use strict';

var React = require('react');
var rcUtil = require('rc-util');
var joinClasses = rcUtil.joinClasses;
var classSet = rcUtil.classSet;
var createChainedFunction = rcUtil.createChainedFunction;
var KeyCode = rcUtil.KeyCode;
var scrollIntoView = require('dom-scroll-into-view');

function noop() {
}

var now = Date.now();

function getChildIndexInChildren(child, children) {
  var index = -1;
  React.Children.forEach(children, function (c, i) {
    if (c === child) {
      index = i;
    }
  });
  return index;
}

function getKeyFromChildren(child, children) {
  return child.key || 'rcMenuItem_' + now + '_' + getChildIndexInChildren(child, children);
}

function getActiveKey(props) {
  var activeKey = props.activeKey;
  var children = props.children;
  if (activeKey) {
    return activeKey;
  }
  React.Children.forEach(children, (c)=> {
    if (c.props.active) {
      activeKey = getKeyFromChildren(c, children);
    }
  });
  if (!activeKey && props.activeFirst) {
    React.Children.forEach(children, (c)=> {
      if (!activeKey && !c.props.disabled) {
        activeKey = getKeyFromChildren(c, children);
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

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: getActiveKey.call(this, props),
      selectedKeys: props.selectedKeys || []
    };

    ['handleItemHover', 'handleDeselect',
      'handleSelect', 'handleKeyDown',
      'handleDestroy', 'renderMenuItem'].forEach((m)=> {
        this[m] = this[m].bind(this);
      });
  }

  componentWillReceiveProps(nextProps) {
    var props = {
      activeKey: getActiveKey.call(this, nextProps)
    };
    if ('selectedKeys' in nextProps) {
      props.selectedKeys = nextProps.selectedKeys || [];
    }
    this.setState(props);
  }

  // all keyboard events callbacks run from here at first
  handleKeyDown(e) {
    var keyCode = e.keyCode;
    var handled;
    this.instanceArray.forEach((obj)=> {
      if (obj.props.active) {
        handled = obj.handleKeyDown(e);
      }
    });
    if (handled) {
      return 1;
    }
    var activeItem;
    switch (keyCode) {
      case KeyCode.UP: //up
        activeItem = this.step(-1);
        break;
      case KeyCode.DOWN: //down
        activeItem = this.step(1);
        break;
      default:
    }
    if (activeItem) {
      e.preventDefault();
      this.setState({
        activeKey: activeItem.props.eventKey
      }, ()=> {
        scrollIntoView(React.findDOMNode(activeItem), React.findDOMNode(this), {
          onlyScrollIfNeeded: true
        });
      });
      return 1;
    }
  }

  step(direction) {
    var children = this.instanceArray;
    var activeKey = this.state.activeKey;
    var len = children.length;
    if (direction < 0) {
      children = children.concat().reverse();
    }
    // find current activeIndex
    var activeIndex = -1;
    children.every((c, ci)=> {
      if (c.props.eventKey === activeKey) {
        activeIndex = ci;
        return false;
      }
      return true;
    });
    var start = (activeIndex + 1) % len;
    var i = start;
    for (; ;) {
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

  handleItemHover(key) {
    this.setState({
      activeKey: key
    });
  }

  handleSelect(key, child, e) {
    var props = this.props;
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
    var state = this.state;
    // my child
    if (this.instanceArray.indexOf(child) !== -1) {
      var selectedKeys;
      if (props.multiple) {
        selectedKeys = state.selectedKeys.concat([key]);
      } else {
        selectedKeys = [key];
      }
      this.setState({
        selectedKeys: selectedKeys
      });
    }

    if (props.onSelect) {
      props.onSelect(key, child, e);
    }
  }

  handleDeselect(key, child, e, __childToBeSelected/*internal*/) {
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
    this.props.onDeselect.apply(null, arguments);
  }

  handleDestroy(key) {
    var state = this.state;
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

  renderMenuItem(child) {
    var state = this.state;
    var props = this.props;
    var key = getKeyFromChildren(child, props.children);
    var childProps = child.props;
    return React.cloneElement(child, {
      renderMenuItem: this.renderMenuItem,
      rootPrefixCls: props.prefixCls,
      ref: createChainedFunction(child.ref, saveRef.bind(this, key)),
      eventKey: key,
      onHover: this.handleItemHover,
      active: !childProps.disabled && key === state.activeKey,
      multiple: props.multiple,
      selected: state.selectedKeys.indexOf(key) !== -1,
      onClick: props.onClick,
      onDeselect: createChainedFunction(childProps.onDeselect, this.handleDeselect),
      onDestroy: this.handleDestroy,
      onSelect: createChainedFunction(childProps.onSelect, this.handleSelect)
    });
  }

  render() {
    var props = this.props;
    this.instanceArray = [];
    var classes = {};
    classes[props.prefixCls] = true;
    var domProps = {
      className: joinClasses(props.className, classSet(classes)),
      role: 'menu',
      'aria-activedescendant': ''
    };
    if (props.id) {
      domProps.id = props.id;
    }
    if (props.focusable) {
      domProps.tabIndex = '0';
      domProps.onKeyDown = this.handleKeyDown;
    }
    return (
      <ul
        style={this.props.style}
        {...domProps}>
      {React.Children.map(props.children, this.renderMenuItem)}
      </ul>
    );
  }
}

Menu.propTypes = {
  focusable: React.PropTypes.bool,
  multiple: React.PropTypes.bool,
  onSelect: React.PropTypes.func,
  style: React.PropTypes.object,
  onDeselect: React.PropTypes.func,
  activeFirst: React.PropTypes.bool,
  activeKey: React.PropTypes.string,
  selectedKeys: React.PropTypes.arrayOf(React.PropTypes.string)
};

Menu.defaultProps = {
  prefixCls: 'rc-menu',
  focusable: true,
  style: {},
  onSelect: noop,
  onClick: noop,
  onDeselect: noop
};

module.exports = Menu;
