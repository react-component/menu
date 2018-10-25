import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import ResizeObserver from 'resize-observer-polyfill';
import SubMenu from './SubMenu';
import { getWidth, setStyle, menuAllProps } from './util';

const canUseDOM = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);

// Fix ssr
if (canUseDOM) {
  require('mutationobserver-shim');
}

class DOMWrap extends React.Component {
  state = {
    lastVisibleIndex: undefined,
  };

  componentDidMount() {
    this.setChildrenWidthAndResize();
    if (this.props.level === 1 && this.props.mode === 'horizontal') {
      const menuUl = ReactDOM.findDOMNode(this);
      if (!menuUl) {
        return;
      }
      this.resizeObserver = new ResizeObserver(entries => {
        entries.forEach(this.setChildrenWidthAndResize);
      });

      [].slice.call(menuUl.children).concat(menuUl).forEach(el => {
        this.resizeObserver.observe(el);
      });

      if (typeof MutationObserver !== 'undefined') {
        this.mutationObserver = new MutationObserver(() => {
          this.resizeObserver.disconnect();
          [].slice.call(menuUl.children).concat(menuUl).forEach(el => {
            this.resizeObserver.observe(el);
          });
          this.setChildrenWidthAndResize();
        });
        this.mutationObserver.observe(
          menuUl,
          { attributes: false, childList: true, subTree: false }
        );
      }
    }
  }

  componentWillUnmount() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if (this.mutationObserver) {
      this.resizeObserver.disconnect();
    }
  }

  // get all valid menuItem nodes
  getMenuItemNodes = () => {
    const { prefixCls } = this.props;
    const ul = ReactDOM.findDOMNode(this);
    if (!ul) {
      return [];
    }

    // filter out all overflowed indicator placeholder
    return [].slice.call(ul.children)
      .filter(node => {
        return node.className.split(' ').indexOf(`${prefixCls}-overflowed-submenu`) < 0;
      });
  }

  getOverflowedSubMenuItem = (keyPrefix, overflowedItems, renderPlaceholder) => {
    const { overflowedIndicator, level, mode, prefixCls, theme, style: propStyle } = this.props;
    if (level !== 1 || mode !== 'horizontal') {
      return null;
    }
    // put all the overflowed item inside a submenu
    // with a title of overflow indicator ('...')
    const copy = this.props.children[0];
    const { children: throwAway, title, eventKey, ...rest } = copy.props;

    let style = { ...propStyle };
    let key = `${keyPrefix}-overflowed-indicator`;

    if (overflowedItems.length === 0 && renderPlaceholder !== true) {
      style = {
        ...style,
        display: 'none',
      };
    } else if (renderPlaceholder) {
      style = {
        ...style,
        visibility: 'hidden',
        // prevent from taking normal dom space
        position: 'absolute',
      };
      key = `${key}-placeholder`;
    }

    const popupClassName = theme ? `${prefixCls}-${theme}` : '';
    const props = {};
    menuAllProps.forEach(k => {
      if (rest[k] !== undefined) {
        props[k] = rest[k];
      }
    });

    return (
      <SubMenu
        title={overflowedIndicator}
        className={`${prefixCls}-overflowed-submenu`}
        popupClassName={popupClassName}
        {...props}
        key={key}
        eventKey={`${keyPrefix}-overflowed-indicator`}
        disabled={false}
        style={style}
      >
        {overflowedItems}
      </SubMenu>
    );
  }

  // memorize rendered menuSize
  setChildrenWidthAndResize = () => {
    if (this.props.mode !== 'horizontal') {
      return;
    }
    const ul = ReactDOM.findDOMNode(this);

    if (!ul) {
      return;
    }

    const ulChildrenNodes = ul.children;

    if (!ulChildrenNodes || ulChildrenNodes.length === 0) {
      return;
    }

    const lastOverflowedIndicatorPlaceholder = ul.children[ulChildrenNodes.length - 1];

    // need last overflowed indicator for calculating length;
    setStyle(lastOverflowedIndicatorPlaceholder, 'display', 'inline-block');

    const menuItemNodes = this.getMenuItemNodes();

    // reset display attribute for all li elements to calculate updated width
    // and then reset to original state after width calculation
    const displayValueCaches = [];

    menuItemNodes.forEach(c => {
      displayValueCaches.push(c.style.display);
      setStyle(c, 'display', 'inline-block');
    });

    this.menuItemSizes = menuItemNodes.map(c => getWidth(c));

    menuItemNodes.forEach((c, i) => {
      setStyle(c, 'display', displayValueCaches[i]);
    });

    this.overflowedIndicatorWidth = getWidth(ul.children[ul.children.length - 1]);
    this.originalTotalWidth = this.menuItemSizes.reduce((acc, cur) => acc + cur, 0);
    this.handleResize();
    // prevent the overflowed indicator from taking space;
    setStyle(lastOverflowedIndicatorPlaceholder, 'display', 'none');
  }

  resizeObserver = null;
  mutationObserver = null;

  // original scroll size of the list
  originalTotalWidth = 0;

  // copy of overflowed items
  overflowedItems = [];

  // cache item of the original items (so we can track the size and order)
  menuItemSizes = [];

  handleResize = () => {
    if (this.props.mode !== 'horizontal') {
      return;
    }

    const ul = ReactDOM.findDOMNode(this);
    if (!ul) {
      return;
    }
    const width = getWidth(ul);

    this.overflowedItems = [];
    let currentSumWidth = 0;

    // index for last visible child in horizontal mode
    let lastVisibleIndex = undefined;

    if (this.originalTotalWidth > width) {
      lastVisibleIndex = -1;

      this.menuItemSizes.forEach(liWidth => {
        currentSumWidth += liWidth;
        if (currentSumWidth + this.overflowedIndicatorWidth <= width) {
          lastVisibleIndex++;
        }
      });
    }

    this.setState({ lastVisibleIndex });
  }

  renderChildren(children) {
    // need to take care of overflowed items in horizontal mode
    const { lastVisibleIndex } = this.state;
    return (children || []).reduce((acc, childNode, index) => {
      let item = childNode;
      if (this.props.mode === 'horizontal') {
        let overflowed = this.getOverflowedSubMenuItem(childNode.props.eventKey, []);
        if (lastVisibleIndex !== undefined
            &&
            this.props.className.indexOf(`${this.props.prefixCls}-root`) !== -1
        ) {
          if (index > lastVisibleIndex) {
            item = React.cloneElement(
              childNode,
              // 这里修改 eventKey 是为了防止隐藏状态下还会触发 openkeys 事件
              { style: { display: 'none' }, eventKey: `${childNode.props.eventKey}-hidden` },
            );
          }
          if (index === lastVisibleIndex + 1) {
            this.overflowedItems = children.slice(lastVisibleIndex + 1).map(c => {
              return React.cloneElement(
                c,
                // children[index].key will become '.$key' in clone by default,
                // we have to overwrite with the correct key explicitly
                { key: c.props.eventKey, mode: 'vertical-left' },
              );
            });

            overflowed = this.getOverflowedSubMenuItem(
              childNode.props.eventKey,
              this.overflowedItems,
            );
          }
        }

        const ret = [...acc, overflowed, item];

        if (index === children.length - 1) {
          // need a placeholder for calculating overflowed indicator width
          ret.push(this.getOverflowedSubMenuItem(childNode.props.eventKey, [], true));
        }
        return ret;
      }
      return [...acc, item];
    }, []);
  }

  render() {
    const {
      hiddenClassName,
      visible,
      prefixCls,
      overflowedIndicator,
      mode,
      level,
      tag: Tag,
      children,
      theme,
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
  hiddenClassName: PropTypes.string,
  tag: PropTypes.string,
  style: PropTypes.object,
};

DOMWrap.defaultProps = {
  tag: 'div',
  className: '',
};

export default DOMWrap;
