import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Provider, create } from 'mini-store';
import debounce from 'lodash/debounce';
import ContainerRender from 'rc-util/lib/ContainerRender';
import SubMenu from './SubMenu';
import { getWidth, getScrollWidth } from './util';

const getCloneContainer = () => {
  const container = document.body.appendChild(document.createElement('div'));
  container.setAttribute('style', 'position: absolute; top: 0; visibility: hidden');
  return container;
};

class DOMWrap extends React.Component {
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
    lastVisibleIndex: undefined,
  };

  container = getCloneContainer();

  componentDidMount() {
    this.updateNodesCacheAndResize();
    window.addEventListener('resize', this.debouncedHandleResize, { passive: true });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.children !== this.props.children
      || prevProps.overflowedIndicator !== this.props.overflowedIndicator
    ) {
      this.updateNodesCacheAndResize();
    }
  }

  componentWillUnmount() {
    this.debouncedHandleResize.cancel();
    window.removeEventListener('resize', this.debouncedHandleResize);

    document.body.removeChild(this.container);
  }

  getOverflowedSubMenuItem = () => {
    const { overflowedIndicator } = this.props;
    // put all the overflowed item inside a submenu
    // with a title of overflow indicator ('...')
    const copy = this.props.children[0];
    const { children: throwAway, title, eventKey, ...rest } = copy.props;

    return (
      <SubMenu
        title={overflowedIndicator}
        className={`${this.props.prefixCls}-overflowed-submenu`}
        {...rest}
        eventKey="overflowed-indicator"
        disabled={false}
      >
        {this.overflowedItems}
      </SubMenu>
    );
  }

  // set overflow indicator size
  setOverflowedIndicatorSize() {
    if (this.props.mode !== 'horizontal') {
      return;
    }
    const container = document.body.appendChild(document.createElement('div'));
    container.setAttribute('style', 'position: absolute; top: 0; visibility: hidden');
    ReactDOM.render(this.props.overflowedIndicator, container, () => {
      this.overflowedIndicatorWidth = getWidth(container) + 40;

      ReactDOM.unmountComponentAtNode(container);
      document.body.removeChild(container);
    });
  }

  // memorize rendered menuSize
  setChildrenSize() {
    if (this.props.mode !== 'horizontal') {
      return;
    }

    const ul = this.container.childNodes[0];
    console.log({ ul, container: this.container });
    if (!ul) {
      return;
    }
    const scrollWidth = getScrollWidth(ul);

    this.props.children.forEach((c, i) => this.childrenSizes[i] = getWidth(ul.children[i]));
    this.originalScrollWidth = scrollWidth;

    this.handleResize();
  }

  updateNodesCacheAndResize() {
    this.setOverflowedIndicatorSize();
    this.setChildrenSize();
  }

  // original scroll size of the list
  originalScrollWidth = 0;

  // copy of overflowed items
  overflowedItems = [];

  // cache item of the original items (so we can track the size and order)
  childrenSizes = [];

  handleResize = () => {
    if (this.props.mode !== 'horizontal') {
      return;
    }

    const ul = ReactDOM.findDOMNode(this);
    const width = getWidth(ul);

    this.overflowedItems = [];
    let currentSumWidth = 0;
    const children = this.props.children;

    // index for last visible child in horizontal mode
    let lastVisibleIndex = undefined;

    if (this.originalScrollWidth > width) {
      lastVisibleIndex = -1;

      this.childrenSizes.forEach(liWidth => {
        currentSumWidth += liWidth;
        if (currentSumWidth + this.overflowedIndicatorWidth <= width) {
          lastVisibleIndex++;
        }
      });

      children.slice(lastVisibleIndex + 1).forEach(c => {
        // children[index].key will become '.$key' in clone by default,
        // we have to overwrite with the correct key explicitly
        this.overflowedItems.push(React.cloneElement(
          c,
          { key: c.props.eventKey, mode: 'vertical-left' },
        ));
      });
    }

    this.setState({ lastVisibleIndex });
  }

  debouncedHandleResize = () => {
    requestAnimationFrame(this.handleResize);
  }

  renderChildren(children) {
    // need to take care of overflowed items in horizontal mode
    const { lastVisibleIndex } = this.state;
    return React.Children.map(children, (childNode, index) => {
      // only process the scenario when overflow actually happens and it's the root menu

      if (this.props.mode === 'horizontal') {
        if (lastVisibleIndex !== undefined
            &&
            this.props.className.indexOf(`${this.props.prefixCls}-root`) !== -1
        ) {
          if (index <= lastVisibleIndex) {
            // visible item, just render
            return childNode;
          } else if (index === lastVisibleIndex + 1) {
            // time to use overflow indicator!
            return this.getOverflowedSubMenuItem();
          }

          return null;
        }
      }

      return childNode;
    });
  }

  renderPortal(props) {
    const {
      hiddenClassName,
      visible,
      prefixCls,
      overflowedIndicator,
      mode,
      tag: Tag,
      children,
      ...rest,
    } = this.props;

    if (mode !== 'horizontal' || !this.container) {
      return null;
    }

    const component = (
      <Tag {...rest} style={{ display: 'inline-block' }}>
        {children}
      </Tag>
    );

    if (false) {
      return (
        <ContainerRender
          parent={this}
          visible
          autoMount
          autoDestroy={false}
          getComponent={() => component}
          getContainer={() => this.container}
        >
          {({ renderComponent, removeContainer }) => {
            this.renderComponent = renderComponent;
            this.removeContainer = removeContainer;
            return null;
          }}
        </ContainerRender>
      );
    } else {
      return ReactDOM.createPortal(component, this.container);
    }
  }

  render() {
    const {
      hiddenClassName,
      visible,
      prefixCls,
      overflowedIndicator,
      mode,
      tag: Tag,
      children,
      ...rest,
    } = this.props;

    if (!visible) {
      rest.className += ` ${hiddenClassName}`;
    }

    return (
      <React.Fragment>
        <Tag {...rest}>
          {this.renderChildren(children)}
        </Tag>
        {this.renderPortal()} 
      </React.Fragment>
    );
  }
}

DOMWrap.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  mode: PropTypes.oneOf(['horizontal', 'vertical', 'vertical-left', 'vertical-right', 'inline']),
  prefixCls: PropTypes.string,
  overflowedIndicator: PropTypes.node,
  theme: PropTypes.string,
};

export default DOMWrap;
