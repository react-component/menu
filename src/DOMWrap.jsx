import React from 'react';
import assign from 'object-assign';

const DOMWrap = React.createClass({
  propTypes: {
    tag: React.PropTypes.string,
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
      props.className += ' ' + props.hiddenClassName;
    }
    const Tag = props.tag;
    return <Tag {...props} />;
  },
});

export default DOMWrap;
