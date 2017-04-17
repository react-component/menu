import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';

const DOMWrap = createReactClass({
  displayName: 'DOMWrap',

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
    const props = { ...this.props };
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
