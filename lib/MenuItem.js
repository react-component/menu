/** @jsx React.DOM */

var React = require('react');
var rcUtil = require('rc-util');
var joinClasses = rcUtil.joinClasses;
var classSet = rcUtil.classSet;
var KeyCode = rcUtil.KeyCode;

class MenuItem extends React.Component {
  constructor(props) {
    super(props);
    ['handleKeyDown', 'handleMouseLeave', 'handleMouseEnter','handleClick'].forEach((m)=> {
      this[m] = this[m].bind(this);
    });
  }

  _getActiveClassName() {
    return this.props.activeClassName || this.props.rootPrefixCls + '-item-active';
  }

  _getSelectedClassName() {
    return this.props.activeClassName || this.props.rootPrefixCls + '-item-selected';
  }

  _getPrefixCls() {
    return this.props.rootPrefixCls + '-item';
  }

  _getDisabledClassName() {
    return this.props.disabledClassName || this.props.rootPrefixCls + '-item-disabled';
  }

  handleKeyDown(e) {
    var keyCode = e.keyCode;
    if (keyCode === KeyCode.ENTER) {
      this.handleClick(e);
      return true;
    }
  }

  handleMouseLeave() {
    this.props.onHover(null);
  }

  handleMouseEnter() {
    var props = this.props;
    props.onHover(props.eventKey);
  }

  handleClick() {
    var props = this.props;
    if (props.multiple) {
      if (props.selected) {
        props.onDeselect(props.eventKey, this);
      } else {
        props.onSelect(props.eventKey, this);
      }
    } else {
      if (!props.selected) {
        props.onSelect(props.eventKey, this);
      }
    }
  }

  componentWillUnmount() {
    var props = this.props;
    if (props.onDestroy) {
      props.onDestroy(props.eventKey);
    }
  }

  render() {
    var props = this.props;
    var classes = {};
    classes[this._getActiveClassName()] = !props.disabled && props.active;
    classes[this._getSelectedClassName()] = props.selected;
    classes[this._getDisabledClassName()] = props.disabled;
    classes[this._getPrefixCls()] = true;
    var attrs = {
      title: props.title,
      className: joinClasses(props.className, classSet(classes)),
      role: "menuitem",
      "aria-selected": props.selected,
      "aria-disabled": props.disabled
    };
    var mouseEvent = {};
    if (!props.disabled) {
      mouseEvent = {
        onClick: this.handleClick,
        onMouseLeave: this.handleMouseLeave,
        onMouseEnter: this.handleMouseEnter
      };
    }
    return (
      <li
        {...attrs}
        {...mouseEvent}>
      {props.children}
      </li>
    );
  }
}

MenuItem.propTypes = {
  active: React.PropTypes.bool,
  selected: React.PropTypes.bool,
  disabled: React.PropTypes.bool,
  title: React.PropTypes.string,
  onSelect: React.PropTypes.func,
  onDeselect: React.PropTypes.func,
  onHover: React.PropTypes.func,
  onDestroy: React.PropTypes.func
};

MenuItem.defaultProps = {
  onSelect() {
  },
  onMouseEnter() {
  }
};
module.exports = MenuItem;
