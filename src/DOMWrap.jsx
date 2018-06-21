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
    overflowingIndex: undefined,
  };

  componentDidMount() {
    window.addEventListener('resize', this.debouncedHandleResize, { passive: true });
    this.updateChildrenCache();
    this.handleResize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.debouncedHandleResize);
  }

  overflowedItems = [];

  childrenCache = [];

  handleResize = () => {
    if (this.props.mode !== 'horizontal') {
      return;
    }
    // reset children to childrenCache
    this.props.children.forEach((c, i) =>
      this.props.children[i] = React.cloneElement(this.childrenCache[i])
    );

    const ul = ReactDOM.findDOMNode(this);
    const scrollWidth = ul.scrollWidth;
    const width = ul.getBoundingClientRect().width;

    this.overflowedItems = [];
    let currentSumWidth = 0;
    // last index of menuItem that is overflowed
    let overflowingIndex = -1;
    const children = this.props.children;

    // try to find all the overflowed items
    if (scrollWidth > width) {
      let lastVisibleChild;
      Array.prototype.slice.apply(ul.children).forEach((li, index) => {
        const liWidth = li.getBoundingClientRect().width;
        currentSumWidth += liWidth;
        if (currentSumWidth > width) {
          // somehow children[index].key is in the format of '.$key',
          // we have to overwrite with the correct key
          this.overflowedItems.push(React.cloneElement(
            children[index],
            { key: children[index].props.eventKey },
          ));
        } else {
          overflowingIndex++;
          lastVisibleChild = children[index];
        }
      });

      // we need to replace last visible child with a overflow indicator ('...')
      this.overflowedItems.unshift(React.cloneElement(
        lastVisibleChild,
        { key: lastVisibleChild.props.eventKey },
      ));

      const selectedIndex = this.childrenCache.findIndex(c => {
        return c.props.selectedKeys.includes(c.props.eventKey);
      });

      const lastVisibleIndex = this.props.children.findIndex(
        c => c.props.eventKey === lastVisibleChild.props.eventKey
      ) - 1;

      // try to move the selected item out of the overflowed item
      if (selectedIndex !== -1 && selectedIndex > lastVisibleIndex) {
        const selectedIndexInOverflow = this.overflowedItems.findIndex(
          ele => ele.props.eventKey === this.childrenCache[selectedIndex].props.eventKey
        );
        const tmp = this.props.children[lastVisibleIndex];
        this.props.children[lastVisibleIndex] = this.overflowedItems[selectedIndexInOverflow];
        this.overflowedItems[selectedIndexInOverflow] = tmp;
      }

      this.setState({ overflowingIndex });
    } else {
      this.setState({ overflowingIndex: undefined });
    }
  }

  debouncedHandleResize = debounce(this.handleResize, 500);

  updateChildrenCache = () => {
    if (this.props.mode !== 'horizontal') {
      return;
    }

    this.props.children.forEach((c, i) => this.childrenCache[i] = React.cloneElement(c));
  }

  renderChildren(children) {
    // need to take care of overflowed items in horizontal mode
    if (this.props.mode === 'horizontal') {
      return React.Children.map(children, (childNode, index) => {
        const overflowingIndex = this.state.overflowingIndex;
        // only process the scenario when overflow actually happens and it's the root menu
        if (overflowingIndex !== undefined
            &&
            this.props.className.indexOf(`${this.props.prefixCls}-root`) !== -1
        ) {
          if (index < overflowingIndex) {
            return childNode;
          } else if (index === overflowingIndex) {
            // put all the overflowed item inside a submenu
            // with a title of overflow indicator ('...')
            const copy = this.props.children[overflowingIndex];
            const { children: throwAway, title, eventKey, ...rest } = copy.props;

            const more = (
              <SubMenu title="...">
                {this.overflowedItems}
              </SubMenu>
            );

            return React.cloneElement(more, { ...rest, disabled: false });
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
};
