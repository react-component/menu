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
    let counter = 0;

    console.log({
      scrollWidth,
      width,
    });

    if (this.state.scrollWidth === undefined) {
      this.setState({ scrollWidth });
    }
    if ((this.state.scrollWidth || scrollWidth) >= width) {
      // console.log(ul.children);
      Array.prototype.slice.apply(this.state.liChildren || ul.children).forEach((li, index) => {
        const liWidth = li.getBoundingClientRect().width;
        console.log({ liWidth });
        currentSumWidth += liWidth;
        if (currentSumWidth >= width) {
          // rest.push(index);
          this.rest.push(this.props.children[index]);
        } else {
          counter++;
        }
      });

      this.setState({ counter });
      /*
      this.props.children.forEach((c, i) => {

      });
      */
      /*
      ReactDOM.render(
        <Menu>
          <SubMenu title="More">
            {rest}
          </SubMenu>
        </Menu>
        ,
        document.querySelector('#test'),
      )
      console.log({rest})
      */
      // const temp = (
      //   <SubMenu title="More">
      //     {rest}
      //   </SubMenu>
      // );

      //Array.prototype.splice.apply(this.props.children, counter, temp);
      // this.props.children[counter] = temp;
    } else {
      this.setState({ counter: undefined });
    }
  }

  componentDidMount() {
    console.log('domWrap mounted');
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
    console.log('parentMounted');
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
          console.log({ counter: this.state.counter });
          if (this.state.counter !== undefined) {
            if (index < this.state.counter - 1) {
              return childNode;
            } else if (index === this.state.counter - 1) {
              console.log({ rest: this.rest })
              const copy = this.props.children[this.state.counter - 1];
              const { children, ...copyProps } = copy.props;
              
              const temp = (
                <SubMenu title="More">
                {this.rest}
                </SubMenu>
              );
              return React.cloneElement(temp, copyProps); 
              // console.log();
              // return childNode;
              // return temp;
            } else {
              // const props = { ...childNode.props };
              // props.style = { visibility: }
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
