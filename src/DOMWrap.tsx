import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ResizeObserver from 'resize-observer-polyfill';
import SubMenu from './SubMenu';
import { getWidth, setStyle, menuAllProps } from './util';
import { MenuMode } from './interface';

const canUseDOM = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);

const MENUITEM_OVERFLOWED_CLASSNAME = 'menuitem-overflowed';
const FLOAT_PRECISION_ADJUST = 0.5;

// Fix ssr
if (canUseDOM) {
  // eslint-disable-next-line global-require
  require('mutationobserver-shim');
}

interface DOMWrapProps {
  className?: string;
  children?: React.ReactElement[];
  mode?: MenuMode;
  prefixCls?: string;
  level?: number;
  theme?: string;
  overflowedIndicator?: React.ReactNode;
  visible?: boolean;
  tag?: string;
  style?: React.CSSProperties;
}

interface DOMWrapState {
  lastVisibleIndex: number;
}

class DOMWrap extends React.Component<DOMWrapProps, DOMWrapState> {
  static defaultProps = {
    tag: 'div',
    className: '',
  };

  overflowedIndicatorWidth: number;

  resizeObserver = null;

  mutationObserver = null;

  // original scroll size of the list
  originalTotalWidth = 0;

  // copy of overflowed items
  overflowedItems: React.ReactElement[] = [];

  // cache item of the original items (so we can track the size and order)
  menuItemSizes: number[] = [];

  state: DOMWrapState = {
    lastVisibleIndex: undefined,
  };

  componentDidMount() {
    this.setChildrenWidthAndResize();
    if (this.props.level === 1 && this.props.mode === 'horizontal') {
      const menuUl = ReactDOM.findDOMNode(this) as HTMLElement;
      if (!menuUl) {
        return;
      }
      this.resizeObserver = new ResizeObserver(entries => {
        entries.forEach(this.setChildrenWidthAndResize);
      });

      [].slice
        .call(menuUl.children)
        .concat(menuUl)
        .forEach((el: HTMLElement) => {
          this.resizeObserver.observe(el);
        });

      if (typeof MutationObserver !== 'undefined') {
        this.mutationObserver = new MutationObserver(() => {
          this.resizeObserver.disconnect();
          [].slice
            .call(menuUl.children)
            .concat(menuUl)
            .forEach((el: HTMLElement) => {
              this.resizeObserver.observe(el);
            });
          this.setChildrenWidthAndResize();
        });
        this.mutationObserver.observe(menuUl, {
          attributes: false,
          childList: true,
          subTree: false,
        });
      }
    }
  }

  componentWillUnmount() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }
  }

  // get all valid menuItem nodes
  getMenuItemNodes = (): HTMLElement[] => {
    const { prefixCls } = this.props;
    const ul = ReactDOM.findDOMNode(this) as HTMLElement;
    if (!ul) {
      return [];
    }

    // filter out all overflowed indicator placeholder
    return [].slice
      .call(ul.children)
      .filter(
        (node: HTMLElement) =>
          node.className.split(' ').indexOf(`${prefixCls}-overflowed-submenu`) <
          0,
      );
  };

  getOverflowedSubMenuItem = (
    keyPrefix: string,
    overflowedItems: React.ReactElement[],
    renderPlaceholder?: boolean,
  ): React.ReactElement => {
    const { overflowedIndicator, level, mode, prefixCls, theme } = this.props;
    if (level !== 1 || mode !== 'horizontal') {
      return null;
    }
    // put all the overflowed item inside a submenu
    // with a title of overflow indicator ('...')
    const copy = this.props.children[0];
    const {
      children: throwAway,
      title,
      style: propStyle,
      ...rest
    } = copy.props;

    let style: React.CSSProperties = { ...propStyle };
    let key = `${keyPrefix}-overflowed-indicator`;
    let eventKey = `${keyPrefix}-overflowed-indicator`;

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
      eventKey = `${eventKey}-placeholder`;
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
        eventKey={eventKey}
        disabled={false}
        style={style}
      >
        {overflowedItems}
      </SubMenu>
    );
  };

  // memorize rendered menuSize
  setChildrenWidthAndResize = () => {
    if (this.props.mode !== 'horizontal') {
      return;
    }
    const ul = ReactDOM.findDOMNode(this) as HTMLElement;

    if (!ul) {
      return;
    }

    const ulChildrenNodes = ul.children;

    if (!ulChildrenNodes || ulChildrenNodes.length === 0) {
      return;
    }

    const lastOverflowedIndicatorPlaceholder = ul.children[
      ulChildrenNodes.length - 1
    ] as HTMLElement;

    // need last overflowed indicator for calculating length;
    setStyle(lastOverflowedIndicatorPlaceholder, 'display', 'inline-block');

    const menuItemNodes = this.getMenuItemNodes();

    // reset display attribute for all hidden elements caused by overflow to calculate updated width
    // and then reset to original state after width calculation

    const overflowedItems = menuItemNodes.filter(
      c => c.className.split(' ').indexOf(MENUITEM_OVERFLOWED_CLASSNAME) >= 0,
    );

    overflowedItems.forEach(c => {
      setStyle(c, 'display', 'inline-block');
    });

    this.menuItemSizes = menuItemNodes.map(c => getWidth(c));

    overflowedItems.forEach(c => {
      setStyle(c, 'display', 'none');
    });
    this.overflowedIndicatorWidth = getWidth(ul.children[
      ul.children.length - 1
    ] as HTMLElement);
    this.originalTotalWidth = this.menuItemSizes.reduce(
      (acc, cur) => acc + cur,
      0,
    );
    this.handleResize();
    // prevent the overflowed indicator from taking space;
    setStyle(lastOverflowedIndicatorPlaceholder, 'display', 'none');
  };

  handleResize = () => {
    if (this.props.mode !== 'horizontal') {
      return;
    }

    const ul = ReactDOM.findDOMNode(this) as HTMLElement;
    if (!ul) {
      return;
    }
    const width = getWidth(ul);

    this.overflowedItems = [];
    let currentSumWidth = 0;

    // index for last visible child in horizontal mode
    let lastVisibleIndex: number;

    // float number comparison could be problematic
    // e.g. 0.1 + 0.2 > 0.3 =====> true
    // thus using FLOAT_PRECISION_ADJUST as buffer to help the situation
    if (this.originalTotalWidth > width + FLOAT_PRECISION_ADJUST) {
      lastVisibleIndex = -1;

      this.menuItemSizes.forEach(liWidth => {
        currentSumWidth += liWidth;
        if (currentSumWidth + this.overflowedIndicatorWidth <= width) {
          lastVisibleIndex += 1;
        }
      });
    }

    this.setState({ lastVisibleIndex });
  };

  renderChildren(children: React.ReactElement[]) {
    // need to take care of overflowed items in horizontal mode
    const { lastVisibleIndex } = this.state;
    return (children || []).reduce(
      (
        acc: React.ReactElement[],
        childNode: React.ReactElement,
        index: number,
      ) => {
        let item = childNode;
        if (this.props.mode === 'horizontal') {
          let overflowed = this.getOverflowedSubMenuItem(
            childNode.props.eventKey,
            [],
          );
          if (
            lastVisibleIndex !== undefined &&
            this.props.className.indexOf(`${this.props.prefixCls}-root`) !== -1
          ) {
            if (index > lastVisibleIndex) {
              item = React.cloneElement(
                childNode,
                // 这里修改 eventKey 是为了防止隐藏状态下还会触发 openkeys 事件
                {
                  style: { display: 'none' },
                  eventKey: `${childNode.props.eventKey}-hidden`,
                  /**
                   * Legacy code. Here `className` never used:
                   * https://github.com/react-component/menu/commit/4cd6b49fce9d116726f4ea00dda85325d6f26500#diff-e2fa48f75c2dd2318295cde428556a76R240
                   */
                  className: `${MENUITEM_OVERFLOWED_CLASSNAME}`,
                },
              );
            }
            if (index === lastVisibleIndex + 1) {
              this.overflowedItems = children
                .slice(lastVisibleIndex + 1)
                .map(c =>
                  React.cloneElement(
                    c,
                    // children[index].key will become '.$key' in clone by default,
                    // we have to overwrite with the correct key explicitly
                    { key: c.props.eventKey, mode: 'vertical-left' },
                  ),
                );

              overflowed = this.getOverflowedSubMenuItem(
                childNode.props.eventKey,
                this.overflowedItems,
              );
            }
          }

          const ret: React.ReactElement[] = [...acc, overflowed, item];

          if (index === children.length - 1) {
            // need a placeholder for calculating overflowed indicator width
            ret.push(
              this.getOverflowedSubMenuItem(childNode.props.eventKey, [], true),
            );
          }
          return ret;
        }
        return [...acc, item];
      },
      [],
    );
  }

  render() {
    const {
      visible,
      prefixCls,
      overflowedIndicator,
      mode,
      level,
      tag,
      children,
      theme,
      ...rest
    } = this.props;

    const Tag = tag as any;

    return <Tag {...rest}>{this.renderChildren(children)}</Tag>;
  }
}

export default DOMWrap;
