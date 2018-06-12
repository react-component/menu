import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import SubMenu from './SubMenu';
import { getWidth, getScrollWidth } from './util';

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
  }

  getOverflowedSubMenuItem = () => {
    const { overflowedIndicator } = this.props;
    // put all the overflowed item inside a submenu
    // with a title of overflow indicator ('...')
    const copy = this.props.children[0];
    const { children: throwAway, title, eventKey, ...rest } = copy.props;

    const more = (
      <SubMenu title={overflowedIndicator} className={`${this.props.prefixCls}-overflowed-submenu`}>
        {this.overflowedItems}
      </SubMenu>
    );

    return React.cloneElement(more, { ...rest, disabled: false });
  }

  // cache ul size and size of the original item in ul.
  setChildrenCache = () => {
    if (this.props.mode !== 'horizontal') {
      return;
    }

    const ul = ReactDOM.findDOMNode(this);
    const scrollWidth = getScrollWidth(ul);

    this.props.children.forEach((c, i) => this.childrenCache[i] = {
      component: React.cloneElement(c),
      width: getWidth(ul.children[i]),
    });

    this.originalScrollWidth = scrollWidth;
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
      document.body.removeChild(container);

      this.handleResize();
    });
  }

  updateNodesCacheAndResize() {
    this.setState({
      shouldOptimizeOverflow: false,
    }, () => {
      this.setChildrenCache();
      this.setOverflowedIndicatorSize();

      this.setState({ shouldOptimizeOverflow: true });
    });
  }

  // original scroll size of the list
  originalScrollWidth = 0;

  // copy of overflowed items
  overflowedItems = [];

  // cache item of the original items (so we can track the size and order)
  childrenCache = [];

  handleResize = () => {
    if (this.props.mode !== 'horizontal') {
      return;
    }
    // reset children to childrenCache (the original items)
    this.props.children.forEach((c, i) =>
      this.props.children[i] = React.cloneElement(this.childrenCache[i].component)
    );

    const ul = ReactDOM.findDOMNode(this);
    const width = getWidth(ul);

    this.overflowedItems = [];
    let currentSumWidth = 0;
    let lastSumWidth = 0;
    const children = this.props.children;

    // it's possible that the last visible item is not wide enough to contain
    // overflow indicator, so we need a flag to mark this
    let shouldReuseLastSpot = true;

    // index for last visible child in horizontal mode
    let lastVisibleIndex;

    if (this.originalScrollWidth > width) {
      let lastVisibleChild;

      this.childrenCache.forEach(({ width: liWidth }, index) => {
        currentSumWidth += liWidth;
        if (currentSumWidth > width) {
          if (lastSumWidth && lastSumWidth <= width) {
            const availableWidth = width - lastSumWidth;

            shouldReuseLastSpot = (availableWidth >= this.overflowedIndicatorWidth);
          }
          // somehow children[index].key is in the format of '.$key',
          // we have to overwrite with the correct key
          this.overflowedItems.push(React.cloneElement(
            children[index],
            { key: children[index].props.eventKey },
          ));
        } else {
          // still spacious enough to contain current item, so mark it to be lastVisibleChild
          lastVisibleChild = children[index];
        }
        lastSumWidth = currentSumWidth;
      });

      lastVisibleIndex = lastVisibleChild ?
        this.props.children.findIndex(
          c => c.props.eventKey === lastVisibleChild.props.eventKey
        ) : undefined;

      // we're not able to reuse the remaining spot
      // so pushing one more item into overflowed items
      // and unshift the lastVisibleIndex
      if (!shouldReuseLastSpot && lastVisibleChild) {
        // we need to replace last visible child with a overflow indicator ('...')
        this.overflowedItems.unshift(React.cloneElement(
          lastVisibleChild,
          { key: lastVisibleChild.props.eventKey },
        ));

        lastVisibleIndex = lastVisibleIndex - 1;
      }
    }

    this.setState({ lastVisibleIndex });
  }

  debouncedHandleResize = debounce(this.handleResize, 150);

  renderChildren(children) {
    // need to take care of overflowed items in horizontal mode
    if (this.props.mode === 'horizontal' && this.state.shouldOptimizeOverflow) {
      const { lastVisibleIndex } = this.state;
      return React.Children.map(children, (childNode, index) => {
        // only process the scenario when overflow actually happens and it's the root menu
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

          // otherwise, make the original overflow item invisible but still occupying dom space
          return React.cloneElement(
            childNode,
            {
              style: { ...childNode.props.style, visibility: 'hidden' },
              disableScrollIntoView: true,
            }
          );
        }

        return childNode;
      });
    }

    return this.props.children;
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
      <Tag {...rest}>
        {this.renderChildren(this.props.children)}
      </Tag>
    );
  }
}

DOMWrap.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  mode: PropTypes.oneOf(['horizontal', 'vertical', 'vertical-left', 'vertical-right', 'inline']),
  prefixCls: PropTypes.string,
  overflowedIndicator: PropTypes.node,
};

export default DOMWrap;
