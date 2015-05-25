var rcUtil = require('rc-util');
var KeyCode = rcUtil.KeyCode;
var React = require('react');

var SubMenuStateMixin = {
  getInitialState() {
    return {
      open: this.props.open || false
    };
  },

  _getOpenClassName() {
    return this.props.openClassName || this.props.rootPrefixCls + '-submenu-open';
  },

  setOpenState(newState, onStateChangeComplete) {
    if (newState) {
      this.bindRootCloseHandlers();
    } else {
      this.unbindRootCloseHandlers();
    }

    this.setState({
      open: newState
    }, onStateChangeComplete);
  },

  handleDocumentKeyUp(e) {
    if (e.keyCode === KeyCode.ESC) {
      this.setOpenState(false);
    }
  },

  handleDocumentClick(e) {
    // If the click originated from within this component
    // don't do anything.
    if (rcUtil.Dom.contains(React.findDOMNode(this), e.target)) {
      return;
    }
    // de active menu cause sub menu hide its menu
    this.props.onHover(null);
  },

  bindRootCloseHandlers() {
    this._onDocumentClickListener = rcUtil.Dom.addEventListener(document, 'click', this.handleDocumentClick);
    this._onDocumentKeyupListener = rcUtil.Dom.addEventListener(document, 'keyup', this.handleDocumentKeyUp);
  },

  unbindRootCloseHandlers() {
    if (this._onDocumentClickListener) {
      this._onDocumentClickListener.remove();
    }

    if (this._onDocumentKeyupListener) {
      this._onDocumentKeyupListener.remove();
    }
  },

  componentWillUnmount() {
    this.unbindRootCloseHandlers();
  }
};

module.exports = SubMenuStateMixin;
