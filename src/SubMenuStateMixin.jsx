import rcUtil, {KeyCode} from 'rc-util';
import ReactDOM from 'react-dom';

export default {
  componentDidMount() {
    this.componentDidUpdate();
  },

  componentDidUpdate() {
    if (this.props.mode !== 'inline') {
      if (this.props.open) {
        this.bindRootCloseHandlers();
      } else {
        this.unbindRootCloseHandlers();
      }
    }
  },

  handleDocumentKeyUp(e) {
    if (e.keyCode === KeyCode.ESC) {
      this.props.onItemHover({
        key: this.props.eventKey,
        item: this,
        hover: false,
      });
    }
  },

  handleDocumentClick(e) {
    // If the click originated from within this component
    // don't do anything.
    if (rcUtil.Dom.contains(ReactDOM.findDOMNode(this), e.target)) {
      return;
    }
    const props = this.props;
    props.onItemHover({
      hover: false,
      item: this,
      key: this.props.eventKey,
    });
    this.triggerOpenChange(false);
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
