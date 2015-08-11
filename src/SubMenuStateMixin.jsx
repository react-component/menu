import rcUtil, {KeyCode} from 'rc-util';

export default {
  getInitialState() {
    return {
      open: this.props.open || false,
    };
  },

  componentDidMount() {
    if (this.state.open && this.props.mode !== 'inline') {
      this.bindRootCloseHandlers();
    }
  },

  getOpenClassName() {
    return this.props.openClassName || this.props.rootPrefixCls + '-submenu-open';
  },

  setOpenState(newState, onStateChangeComplete) {
    if (this.state.open !== newState) {
      if (this.props.mode !== 'inline') {
        if (newState) {
          this.bindRootCloseHandlers();
        } else {
          this.unbindRootCloseHandlers();
        }
      }
      this.setState({
        open: newState,
      }, onStateChangeComplete);
    }
  },

  handleDocumentKeyUp(e) {
    if (e.keyCode === KeyCode.ESC) {
      this.props.onHover(null);
    }
  },

  handleDocumentClick(e) {
    // If the click originated from within this component
    // don't do anything.
    if (rcUtil.Dom.contains(React.findDOMNode(this), e.target)) {
      return;
    }
    this.props.onHover(null);
  },

  bindRootCloseHandlers() {
    if (!this._onDocumentClickListener) {
      this._onDocumentClickListener = rcUtil.Dom.addEventListener(document, 'click', this.handleDocumentClick);
      this._onDocumentKeyupListener = rcUtil.Dom.addEventListener(document, 'keyup', this.handleDocumentKeyUp);
    }
  },

  unbindRootCloseHandlers() {
    if (this._onDocumentClickListener) {
      this._onDocumentClickListener.remove();
      this._onDocumentClickListener = null;
    }

    if (this._onDocumentKeyupListener) {
      this._onDocumentKeyupListener.remove();
      this._onDocumentKeyupListener = null;
    }
  },

  componentWillUnmount() {
    this.unbindRootCloseHandlers();
  },
};
