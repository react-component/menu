import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import SubMenu from './SubMenu';
// import SubPopupMenu from './SubPopupMenu';
import Menu from './Menu';

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

  state = {
    counter: undefined,
    scrollWidth: undefined,
  };

  rest = [];

  handleResize = () => {
    const ul = ReactDOM.findDOMNode(this);

    const scrollWidth = ul.scrollWidth;

    const width = ul.getBoundingClientRect().width;

    this.rest = [];
    let currentSumWidth = 0;
    let counter = -1;
    const children = this.props.children;

    if (this.state.scrollWidth === undefined) {
      this.setState({ scrollWidth });
    }

    if ((this.state.scrollWidth || scrollWidth) > width) {
      let lastChild;
      Array.prototype.slice.apply(ul.children).forEach((li, index) => {
        const liWidth = li.getBoundingClientRect().width;
        currentSumWidth += liWidth;
        if (currentSumWidth > width) {
          // somehow children[index].key is in the format of '.$key', have to overwrite with the correct key
          this.rest.push(React.cloneElement(children[index], { key: children[index].props.eventKey }));
        } else {
          counter++;
          lastChild = children[index];
        }
      });
      this.rest.unshift(React.cloneElement(lastChild, { key: lastChild.props.eventKey }));

      this.setState({ counter });
    } else {
      this.setState({ counter: undefined });
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  render() {
    const { children, ...otherProps} = this.props;
    if (!otherProps.visible) {
      otherProps.className += ` ${otherProps.hiddenClassName}`;
    }
    const Tag = otherProps.tag;
    delete otherProps.tag;
    delete otherProps.hiddenClassName;
    delete otherProps.visible;

    return (
      <Tag {...otherProps}>
        {React.Children.map(children, (childNode, index) => {
          if (this.state.counter !== undefined && this.props.className.indexOf(`${this.props.prefixCls}-root`) !== -1) {
            if (index < this.state.counter) {
              return childNode;
            } else if (index === this.state.counter) {
              const copy = this.props.children[this.state.counter];
              const { children, title, ...copyProps } = copy.props;
              
              const more = (
                <SubMenu title="More">
                  {this.rest}
                </SubMenu>
              );

              return React.cloneElement(more, { ...copyProps, disabled: false  }); 
            } else {
              return React.cloneElement(childNode, { ...childNode.props, style: { ...childNode.props.style, visibility: 'hidden' } }); ;
            }
          } else {
            return childNode;
          }
        })}
      </Tag>
    );
  }
}
