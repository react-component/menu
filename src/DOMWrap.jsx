import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import SubMenu from './SubMenu';
import { getWidth } from './util';

class DOMWrap extends React.Component {
  state = {
    lastVisibleIndex: undefined,
  };

  componentDidMount() {
    this.setChildrenWidthAndResize();
    window.addEventListener('resize', this.debouncedHandleResize, { passive: true });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.children !== this.props.children
      || prevProps.overflowedIndicator !== this.props.overflowedIndicator
    ) {
      this.setChildrenWidthAndResize();
    }
  }

  componentWillUnmount() {
    this.debouncedHandleResize.cancel();
    window.removeEventListener('resize', this.debouncedHandleResize);
  }

  getOverflowedSubMenuItem = (lastVisibleIndex) => {
    const { overflowedIndicator, level, mode, className, prefixCls, theme } = this.props;
    if (level !== 1 || mode !== 'horizontal') {
      return null;
    }
    // put all the overflowed item inside a submenu
    // with a title of overflow indicator ('...')
    const copy = this.props.children[0];
    const { children: throwAway, title, eventKey, ...rest } = copy.props;

    const left = this.childrenSizes.slice(0, lastVisibleIndex + 1).reduce((acc, cur) => {
      return acc + cur;
    }, 0);

    let style = {
      position: 'absolute',
      left,
    };

    if (lastVisibleIndex === undefined) {
      style = {
        ...style,
        visibility: 'hidden',
        height: 0,
      };
    }

    const popupClassName = theme ? `${prefixCls}-${theme}` : '';

    return (
      <SubMenu
        title={overflowedIndicator}
        className={`${prefixCls}-overflowed-submenu`}
        popupClassName={popupClassName}
        {...rest}
        eventKey="overflowed-indicator"
        disabled={false}
        style={style}
      >
        {this.overflowedItems}
      </SubMenu>
    );
  }

  // memorize rendered menuSize
  setChildrenWidthAndResize() {
    if (this.props.mode !== 'horizontal') {
      return;
    }
    const ul = ReactDOM.findDOMNode(this);

    if (!ul) {
      return;
    }

    this.childrenSizes = [];
    const { children } = this.props;

    children.forEach((c, i) => this.childrenSizes[i] = getWidth(ul.children[i]));

    this.overflowedIndicatorWidth = getWidth(ul.children[children.length]);
    this.originalTotalWidth = this.childrenSizes.reduce((acc, cur) => acc + cur, 0);
    this.handleResize();
  }

  // original scroll size of the list
  originalTotalWidth = 0;

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

    if (this.originalTotalWidth > width) {
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

  debouncedHandleResize = debounce(this.handleResize, 150);

  renderChildren(children) {
    // need to take care of overflowed items in horizontal mode
    const { lastVisibleIndex } = this.state;
    return (
      <React.Fragment>
        {
          React.Children.map(children, (childNode, index) => {
          // only process the scenario when overflow actually happens and it's the root menu

            if (this.props.mode === 'horizontal') {
              if (lastVisibleIndex !== undefined
                  &&
                  this.props.className.indexOf(`${this.props.prefixCls}-root`) !== -1
              ) {
                if (index <= lastVisibleIndex) {
                  // visible item, just render
                  return childNode;
                }
                return React.cloneElement(
                  childNode,
                  // 这里修改 eventKey 是为了防止隐藏状态下还会触发 openkeys 事件
                  { style: { visibility: 'hidden' }, eventKey: `${childNode.eventKey}-hidden` },
                );
              }
            }
            return childNode;
          })
        }
        {this.getOverflowedSubMenuItem(lastVisibleIndex)}
      </React.Fragment>
    );
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
  level: PropTypes.number,
  theme: PropTypes.string,
  overflowedIndicator: PropTypes.node,
  visible: PropTypes.bool,
};

DOMWrap.defaultProps = {
  tag: 'div',
  className: '',
}

export default DOMWrap;
