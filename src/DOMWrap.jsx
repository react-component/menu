import React, { PropTypes } from 'react';
import assign from 'object-assign';

const DOMWrap = React.createClass({
  propTypes: {
    tag: PropTypes.string,
    hiddenClassName: PropTypes.string,
    visible: PropTypes.bool,
  },

  getDefaultProps() {
    return {
      tag: 'div',
    };
  },

  render() {
    const props = assign({}, this.props);
    if (!props.visible) {
      props.className = props.className || '';
      props.className += ` ${props.hiddenClassName}`;
    }
    const Tag = props.tag;
    delete props.tag;
    delete props.hiddenClassName;
    delete props.visible;
    return <Tag {...props} />;
  },
});

export default DOMWrap;
