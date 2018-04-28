import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import KeyCode from 'rc-util/lib/KeyCode';
import classNames from 'classnames';
import scrollIntoView from 'dom-scroll-into-view';
import { connect } from 'mini-store';
import { noop, menuAllProps } from './util';

/* eslint react/no-is-mounted:0 */

export class MenuItem extends React.Component {
  static propTypes = {
    attribute: PropTypes.object,
    rootPrefixCls: PropTypes.string,
    eventKey: PropTypes.string,
    active: PropTypes.bool,
    children: PropTypes.any,
    selectedKeys: PropTypes.array,
    disabled: PropTypes.bool,
    title: PropTypes.string,
    onItemHover: PropTypes.func,
    onSelect: PropTypes.func,
    onClick: PropTypes.func,
    onDeselect: PropTypes.func,
    parentMenu: PropTypes.object,
    onDestroy: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    multiple: PropTypes.bool,
    isSelected: PropTypes.bool,
    manualRef: PropTypes.func,
  };

  static defaultProps = {
    onSelect: noop,
    onMouseEnter: noop,
    onMouseLeave: noop,
    manualRef: noop,
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // invoke customized ref to expose component to mixin
    this.callRef();
  }

  componentDidUpdate() {
    if (this.props.active) {
      scrollIntoView(ReactDOM.findDOMNode(this), ReactDOM.findDOMNode(this.props.parentMenu), {
        onlyScrollIfNeeded: true,
      });
    }

    this.callRef();
  }

  componentWillUnmount() {
    const props = this.props;
    if (props.onDestroy) {
      props.onDestroy(props.eventKey);
    }
  }

  onKeyDown = (e) => {
    const keyCode = e.keyCode;
    if (keyCode === KeyCode.ENTER) {
      this.onClick(e);
      return true;
    }
  };

  onMouseLeave = (e) => {
    const { eventKey, onItemHover, onMouseLeave } = this.props;
    onItemHover({
      key: eventKey,
      hover: false,
    });
    onMouseLeave({
      key: eventKey,
      domEvent: e,
    });
  };

  onMouseEnter = (e) => {
    const { eventKey, onItemHover, onMouseEnter } = this.props;
    onItemHover({
      key: eventKey,
      hover: true,
    });
    onMouseEnter({
      key: eventKey,
      domEvent: e,
    });
  };

  onClick = (e) => {
    const { eventKey, multiple, onClick, onSelect, onDeselect, isSelected } = this.props;
    const info = {
      key: eventKey,
      keyPath: [eventKey],
      item: this,
      domEvent: e,
    };
    onClick(info);
    if (multiple) {
      if (isSelected) {
        onDeselect(info);
      } else {
        onSelect(info);
      }
    } else if (!isSelected) {
      onSelect(info);
    }
  };

  getPrefixCls() {
    return `${this.props.rootPrefixCls}-item`;
  }

  getActiveClassName() {
    return `${this.getPrefixCls()}-active`;
  }

  getSelectedClassName() {
    return `${this.getPrefixCls()}-selected`;
  }

  getDisabledClassName() {
    return `${this.getPrefixCls()}-disabled`;
  }

  callRef() {
    if (this.props.manualRef) {
      this.props.manualRef(this);
    }
  }

  render() {
    const props = { ...this.props };
    const className = classNames(this.getPrefixCls(), props.className, {
      [this.getActiveClassName()]: !props.disabled && props.active,
      [this.getSelectedClassName()]: props.isSelected,
      [this.getDisabledClassName()]: props.disabled,
    });
    let attrs = {
      ...props.attribute,
      title: props.title,
      className,
      // set to menuitem by default
      role: 'menuitem',
      'aria-disabled': props.disabled,
    };

    if (props.role === 'option') {
      // overwrite to option
      attrs = {
        ...attrs,
        role: 'option',
        'aria-selected': props.isSelected,
      };
    } else if (props.role === null) {
      // sometimes we want to specify role inside <li/> element
      // <li><a role='menuitem'>Link</a></li> would be a good example
      delete attrs.role;
    }
    let mouseEvent = {};
    if (!props.disabled) {
      mouseEvent = {
        onClick: this.onClick,
        onMouseLeave: this.onMouseLeave,
        onMouseEnter: this.onMouseEnter,
      };
    }
    const style = {
      ...props.style,
    };
    if (props.mode === 'inline') {
      style.paddingLeft = props.inlineIndent * props.level;
    }
    menuAllProps.forEach(key => delete props[key]);
    return (
      <li
        {...props}
        {...attrs}
        {...mouseEvent}
        style={style}
      >
        {props.children}
      </li>
    );
  }
}

MenuItem.isMenuItem = true;

const connected = connect(({ activeKey, selectedKeys }, { eventKey, subMenuKey }) => ({
  active: activeKey[subMenuKey] === eventKey,
  isSelected: selectedKeys.indexOf(eventKey) !== -1,
}))(MenuItem);

export default connected;
