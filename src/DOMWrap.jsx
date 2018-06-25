import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import SubMenu from './SubMenu';
import debounce from 'lodash/debounce';

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
    lastVisibleIndex: undefined,
  };

  componentDidMount() {
    this.setChildrenCache();
    this.setOverflowedIndicatorSize();
    window.addEventListener('resize', this.debouncedHandleResize, { passive: true });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.debouncedHandleResize);
  }

  // original scroll size of the list
  originalScrollWidth = 0;

  // copy of overflowed items 
  overflowedItems = [];

  // cache item of the original items (so we can track the size and order)
  childrenCache = [];

  // set overflow indicator size
  setOverflowedIndicatorSize() {
    if (this.props.mode !== 'horizontal') {
      return;
    }
    const container = document.body.appendChild(document.createElement('div'));
    const child = container.appendChild(document.createElement('div'));
    container.setAttribute('style', 'position: absolute; top: 0; visibility: hidden');
    ReactDOM.render(this.props.overflowedIndicator, container, () => {
      this.overflowedIndicatorWidth = container.getBoundingClientRect().width + 40;
      document.body.removeChild(container);

      this.handleResize();
    });
  }

  getWidth(elem) {
    return elem.getBoundingClientRect().width;
  }

  getScrollWidth(elem) {
    return elem.scrollWidth;
  }

  handleResize = () => {
    if (this.props.mode !== 'horizontal') {
      return;
    }
    // reset children to childrenCache (the original items)
    this.props.children.forEach((c, i) =>
      this.props.children[i] = React.cloneElement(this.childrenCache[i].component)
    );

    const ul = ReactDOM.findDOMNode(this);
    const width = this.getWidth(ul);

    this.overflowedItems = [];
    let currentSumWidth = 0;
    let lastSumWidth = 0;
    const children = this.props.children;

    // it's possible that the last visible item is not wide enough to contain
    // overflow indicator, so we need a flag to mark this
    let shouldReuseLastSpot = true;

    // try to find all the overflowed items
    if (this.originalScrollWidth > width) {
      let lastVisibleChild;

      const selectedIndex = this.childrenCache.findIndex(({ component: c }) => {
        return c.props.selectedKeys.includes(c.props.eventKey);
      });

      this.childrenCache.forEach(({ width: liWidth }, index) => {
        currentSumWidth += liWidth;
        if (currentSumWidth > width) {
          if (lastSumWidth && lastSumWidth <= width) {
            if (selectedIndex !== -1 &&  selectedIndex >= index) {
              lastSumWidth = lastSumWidth - this.childrenCache[index - 1].width + this.childrenCache[selectedIndex].width;
            }
            shouldReuseLastSpot = ((width - lastSumWidth) >= this.overflowedIndicatorWidth);
          }
          // somehow children[index].key is in the format of '.$key',
          // we have to overwrite with the correct key
          this.overflowedItems.push(React.cloneElement(
            children[index],
            { key: children[index].props.eventKey },
          ));
        } else {
          lastVisibleChild = children[index];
        }
        lastSumWidth = currentSumWidth;
      });

      let lastVisibleIndex = lastVisibleChild ?
        this.props.children.findIndex(
          c  => c.props.eventKey === lastVisibleChild.props.eventKey
        ) : undefined;

      if (!shouldReuseLastSpot && lastVisibleChild) {
        // we need to replace last visible child with a overflow indicator ('...')
        this.overflowedItems.unshift(React.cloneElement(
          lastVisibleChild,
          { key: lastVisibleChild.props.eventKey },
        ));

        lastVisibleIndex = lastVisibleIndex - 1;
      }

      // try to move the selected item out of the overflowed item
      if (selectedIndex !== -1 && selectedIndex > lastVisibleIndex) {
        const selectedIndexInOverflow = this.overflowedItems.findIndex(
          ele => ele.props.eventKey === this.childrenCache[selectedIndex].component.props.eventKey
        );
        const tmp = this.props.children[lastVisibleIndex];
        this.props.children[lastVisibleIndex] = this.overflowedItems[selectedIndexInOverflow];
        this.overflowedItems[selectedIndexInOverflow] = tmp;
      }

      this.setState({ lastVisibleIndex });
    } else {
      this.setState({ lastVisibleIndex: undefined });
    }
  }

  debouncedHandleResize = debounce(this.handleResize, 500);

  // cache ul size and size of the original item in ul.
  setChildrenCache = () => {
    if (this.props.mode !== 'horizontal') {
      return;
    }

    const ul = ReactDOM.findDOMNode(this);
    const scrollWidth = this.getScrollWidth(ul);
    
    this.props.children.forEach((c, i) => this.childrenCache[i] = {
      component: React.cloneElement(c),
      width: this.getWidth(ul.children[i]),
    });

    this.originalScrollWidth = scrollWidth;
  }

  getOverflowedSubMenuItem = () => {
    const { overflowedIndicator } = this.props;
    // put all the overflowed item inside a submenu
    // with a title of overflow indicator ('...')
    const copy = this.props.children[0];
    const { children: throwAway, title, eventKey, ...rest } = copy.props;

    const more = (
      <SubMenu title={overflowedIndicator}>
        {this.overflowedItems}
      </SubMenu>
    );

    return React.cloneElement(more, { ...rest, disabled: false });
  }

  renderChildren(children) {
    // need to take care of overflowed items in horizontal mode
    if (this.props.mode === 'horizontal') {
      return React.Children.map([...children], (childNode, index) => {
        const lastVisibleIndex = this.state.lastVisibleIndex;
        // only process the scenario when overflow actually happens and it's the root menu
        if (lastVisibleIndex !== undefined
            &&
            this.props.className.indexOf(`${this.props.prefixCls}-root`) !== -1
        ) {
          if (index <= lastVisibleIndex) {
            return childNode;
          } else if (index === lastVisibleIndex + 1) {
            return this.getOverflowedSubMenuItem();
          }

          // to make the original overflow item invisible but still occupying dom space
          return React.cloneElement(
            childNode,
            { style: { ...childNode.props.style, visibility: 'hidden' }, disableScrollIntoView: true });
        }

        return childNode;
      });
    }

    return this.props.children;
  }

  render() {
    const { children, ...rest } = this.props;
    if (!rest.visible) {
      rest.className += ` ${rest.hiddenClassName}`;
    }
    const Tag = rest.tag;
    delete rest.tag;
    delete rest.hiddenClassName;
    delete rest.visible;
    delete rest.prefixCls;
    delete rest.overflowedIndicator;
    delete rest.mode;

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
