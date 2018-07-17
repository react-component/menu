import React from 'react';
import PropTypes from 'prop-types';

export default class DOMWrap extends React.Component {
  static propTypes = {
    tag: PropTypes.string,
    hiddenClassName: PropTypes.string,
    visible: PropTypes.bool,
  };

  static defaultProps = {
    tag: 'div',
    className: '',
  };

  render() {
    const props = { ...this.props };
    if (!props.visible) {
      props.className += ` ${props.hiddenClassName}`;
    }
    const Tag = props.tag;
    delete props.tag;
    delete props.hiddenClassName;
    delete props.visible;
    return <Tag {...props} />;
  }
}
