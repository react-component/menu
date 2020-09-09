/* eslint-disable no-undef, react/no-multi-comp, react/jsx-curly-brace-presence */
import React from 'react';
import { render, mount } from 'enzyme';
import { renderToJson } from 'enzyme-to-json';
import KeyCode from 'rc-util/lib/KeyCode';
import Menu, { MenuItem, MenuItemGroup, SubMenu, Divider } from '../src';
import * as mockedUtil from '../src/util';
import { getMotion } from '../src/utils/legacyUtil';

describe('Menu', () => {
  describe('should render', () => {
    function createMenu(props) {
      return (
        <Menu className="myMenu" openAnimation="fade" {...props}>
          <MenuItemGroup title="g1">
            <MenuItem key="1">1</MenuItem>
            <Divider />
            <MenuItem key="2">2</MenuItem>
          </MenuItemGroup>
          <MenuItem key="3">3</MenuItem>
          <MenuItemGroup title="g2">
            <MenuItem key="4">4</MenuItem>
            <MenuItem key="5" disabled>
              5
            </MenuItem>
          </MenuItemGroup>
          <SubMenu title="submenu">
            <MenuItem key="6">6</MenuItem>
          </SubMenu>
        </Menu>
      );
    }

    ['vertical', 'horizontal', 'inline'].forEach(mode => {
      it(`${mode} menu correctly`, () => {
        const wrapper = render(createMenu({ mode }));
        expect(renderToJson(wrapper)).toMatchSnapshot();
      });

      it(`${mode} menu with empty children without error`, () => {
        expect(() => render(<Menu mode={mode}>{[]}</Menu>)).not.toThrow();
      });

      it(`${mode} menu with undefined children without error`, () => {
        expect(() => render(<Menu mode={mode} />)).not.toThrow();
      });

      it(`${mode} menu that has a submenu with undefined children without error`, () => {
        expect(() =>
          render(
            <Menu mode={mode}>
              <SubMenu />
            </Menu>,
          ),
        ).not.toThrow();
      });

      it(`${mode} menu with rtl direction correctly`, () => {
        const wrapper = mount(createMenu({ mode, direction: 'rtl' }));
        expect(renderToJson(render(wrapper))).toMatchSnapshot();

        expect(
          wrapper
            .find('ul')
            .first()
            .props().className,
        ).toContain('-rtl');
      });
    });

    it('should support Fragment', () => {
      const wrapper = mount(
        <Menu>
          <SubMenu title="submenu">
            <MenuItem key="6">6</MenuItem>
          </SubMenu>
          <MenuItem key="6">6</MenuItem>
          <>
            <SubMenu title="submenu">
              <MenuItem key="6">6</MenuItem>
            </SubMenu>
            <MenuItem key="6">6</MenuItem>
          </>
        </Menu>,
      );
      expect(render(wrapper)).toMatchSnapshot();
    });
  });

  describe('render role listbox', () => {
    function createMenu() {
      return (
        <Menu className="myMenu" openAnimation="fade" role="listbox">
          <MenuItem key="1" role="option">
            1
          </MenuItem>
          <MenuItem key="2" role="option">
            2
          </MenuItem>
          <MenuItem key="3" role="option">
            3
          </MenuItem>
        </Menu>
      );
    }

    it('renders menu correctly', () => {
      const wrapper = render(createMenu());
      expect(renderToJson(wrapper)).toMatchSnapshot();
    });
  });

  it('set activeKey', () => {
    const wrapper = mount(
      <Menu activeKey="1">
        <MenuItem key="1">1</MenuItem>
        <MenuItem key="2">2</MenuItem>
      </Menu>,
    );
    expect(
      wrapper
        .find('MenuItem')
        .first()
        .props().active,
    ).toBe(true);
    expect(
      wrapper
        .find('MenuItem')
        .last()
        .props().active,
    ).toBe(false);
  });

  it('active first item', () => {
    const wrapper = mount(
      <Menu defaultActiveFirst>
        <MenuItem key="1">1</MenuItem>
        <MenuItem key="2">2</MenuItem>
      </Menu>,
    );
    expect(
      wrapper
        .find('MenuItem')
        .first()
        .props().active,
    ).toBe(true);
  });

  it('should render none menu item children', () => {
    expect(() => {
      mount(
        <Menu activeKey="1">
          <MenuItem key="1">1</MenuItem>
          <MenuItem key="2">2</MenuItem>
          string
          {'string'}
          {null}
          {undefined}
          {12345}
          <div />
          <input />
        </Menu>,
      );
    }).not.toThrow();
  });

  it('select multiple items', () => {
    const wrapper = mount(
      <Menu multiple>
        <MenuItem key="1">1</MenuItem>
        <MenuItem key="2">2</MenuItem>
      </Menu>,
    );
    wrapper
      .find('MenuItem')
      .first()
      .simulate('click');
    wrapper
      .find('MenuItem')
      .last()
      .simulate('click');

    expect(wrapper.find('.rc-menu-item-selected').length).toBe(2);
  });

  it('can be controlled by selectedKeys', () => {
    const wrapper = mount(
      <Menu selectedKeys={['1']}>
        <MenuItem key="1">1</MenuItem>
        <MenuItem key="2">2</MenuItem>
      </Menu>,
    );
    expect(
      wrapper
        .find('li')
        .first()
        .props().className,
    ).toContain('-selected');
    wrapper.setProps({ selectedKeys: ['2'] });
    wrapper.update();
    expect(
      wrapper
        .find('li')
        .last()
        .props().className,
    ).toContain('-selected');
  });

  it('select default item', () => {
    const wrapper = mount(
      <Menu defaultSelectedKeys={['1']}>
        <MenuItem key="1">1</MenuItem>
        <MenuItem key="2">2</MenuItem>
      </Menu>,
    );
    expect(
      wrapper
        .find('li')
        .first()
        .props().className,
    ).toContain('-selected');
  });

  it('can be controlled by openKeys', () => {
    const wrapper = mount(
      <Menu openKeys={['g1']}>
        <MenuItemGroup key="g1">
          <MenuItem key="1">1</MenuItem>
        </MenuItemGroup>
        <MenuItemGroup key="g2">
          <MenuItem key="2">2</MenuItem>
        </MenuItemGroup>
      </Menu>,
    );
    expect(
      wrapper
        .find('ul')
        .first()
        .props().className,
    ).not.toContain('-hidden');
    wrapper.setProps({ openKeys: ['g2'] });
    expect(
      wrapper
        .find('ul')
        .last()
        .props().className,
    ).not.toContain('-hidden');
  });

  it('open default submenu', () => {
    const wrapper = mount(
      <Menu defaultOpenKeys={['g1']}>
        <MenuItemGroup key="g1">
          <MenuItem key="1">1</MenuItem>
        </MenuItemGroup>
        <MenuItemGroup key="g2">
          <MenuItem key="2">2</MenuItem>
        </MenuItemGroup>
      </Menu>,
    );
    expect(
      wrapper
        .find('ul')
        .first()
        .props().className,
    ).not.toContain('-hidden');
  });

  it('fires select event', () => {
    const handleSelect = jest.fn();
    const wrapper = mount(
      <Menu onSelect={handleSelect}>
        <MenuItem key="1">1</MenuItem>
        <MenuItem key="2">2</MenuItem>
      </Menu>,
    );
    wrapper
      .find('MenuItem')
      .first()
      .simulate('click');
    expect(handleSelect.mock.calls[0][0].key).toBe('1');
  });

  it('fires click event', () => {
    const handleClick = jest.fn();
    const wrapper = mount(
      <Menu onClick={handleClick}>
        <MenuItem key="1">1</MenuItem>
        <MenuItem key="2">2</MenuItem>
      </Menu>,
    );
    wrapper
      .find('MenuItem')
      .first()
      .simulate('click');
    expect(handleClick.mock.calls[0][0].key).toBe('1');
  });

  it('fires deselect event', () => {
    const handleDeselect = jest.fn();
    const wrapper = mount(
      <Menu multiple onDeselect={handleDeselect}>
        <MenuItem key="1">1</MenuItem>
        <MenuItem key="2">2</MenuItem>
      </Menu>,
    );
    wrapper
      .find('MenuItem')
      .first()
      .simulate('click')
      .simulate('click');
    expect(handleDeselect.mock.calls[0][0].key).toBe('1');
  });

  it('active by mouse enter', () => {
    const wrapper = mount(
      <Menu>
        <MenuItem key="item1">item</MenuItem>
        <MenuItem disabled>disabled</MenuItem>
        <MenuItem key="item2">item2</MenuItem>
      </Menu>,
    );
    let menuItem = wrapper.find('MenuItem').last();
    menuItem.simulate('mouseEnter');
    menuItem = wrapper.find('MenuItem').last();
    expect(menuItem.props().active).toBe(true);
  });

  it('active by key down', () => {
    const wrapper = mount(
      <Menu activeKey="1">
        <MenuItem key="1">1</MenuItem>
        <MenuItem key="2">2</MenuItem>
      </Menu>,
    );

    wrapper.simulate('keyDown', { keyCode: KeyCode.DOWN });
    expect(
      wrapper
        .find('MenuItem')
        .at(1)
        .props().active,
    ).toBe(true);
  });

  it('keydown works when children change', () => {
    class App extends React.Component {
      state = {
        items: [1, 2, 3],
      };

      render() {
        return (
          <Menu>
            {this.state.items.map(i => (
              <MenuItem key={i}>{i}</MenuItem>
            ))}
          </Menu>
        );
      }
    }

    const wrapper = mount(<App />);

    wrapper.setState({ items: [0, 1] });

    wrapper.find('Menu').simulate('keyDown', { keyCode: KeyCode.DOWN });
    expect(
      wrapper
        .find('MenuItem')
        .at(0)
        .props().active,
    ).toBe(true);

    wrapper.find('Menu').simulate('keyDown', { keyCode: KeyCode.DOWN });
    expect(
      wrapper
        .find('MenuItem')
        .at(1)
        .props().active,
    ).toBe(true);
  });

  it('active first item when children changes', () => {
    class App extends React.Component {
      state = {
        items: ['foo'],
      };

      render() {
        return (
          <Menu defaultActiveFirst activeKey="" selectedKeys={['foo']}>
            {this.state.items.map(item => (
              <MenuItem key={item}>{item}</MenuItem>
            ))}
          </Menu>
        );
      }
    }

    const wrapper = mount(<App />);

    wrapper.setState({ items: ['bar', 'foo'] });
    wrapper.update();

    expect(
      wrapper
        .find('li')
        .first()
        .hasClass('rc-menu-item-active'),
    ).toBe(true);
  });

  it('should accept builtinPlacements', () => {
    const builtinPlacements = {
      leftTop: {
        points: ['tr', 'tl'],
        overflow: {
          adjustX: 0,
          adjustY: 0,
        },
        offset: [0, 0],
      },
    };

    const wrapper = mount(
      <Menu builtinPlacements={builtinPlacements}>
        <MenuItem>menuItem</MenuItem>
        <SubMenu title="submenu">
          <MenuItem>menuItem</MenuItem>
        </SubMenu>
      </Menu>,
    );

    expect(wrapper.find('Trigger').prop('builtinPlacements').leftTop).toEqual(
      builtinPlacements.leftTop,
    );
  });

  describe('submenu mode', () => {
    it('should use menu mode by default', () => {
      const wrapper = mount(
        <Menu mode="horizontal">
          <SubMenu title="submenu">
            <MenuItem>menuItem</MenuItem>
          </SubMenu>
        </Menu>,
      );

      expect(
        wrapper
          .find('SubMenu')
          .first()
          .prop('mode'),
      ).toEqual('horizontal');
    });

    it('should be able to customize SubMenu mode', () => {
      const wrapper = mount(
        <Menu mode="horizontal">
          <SubMenu title="submenu" mode="vertical-right">
            <MenuItem>menuItem</MenuItem>
          </SubMenu>
        </Menu>,
      );

      expect(
        wrapper
          .find('SubMenu')
          .first()
          .prop('mode'),
      ).toEqual('vertical-right');
    });
  });

  describe('DOMWrap Allow Overflow', () => {
    const overflowIndicatorSelector = 'SubMenu.rc-menu-overflowed-submenu';
    function createMenu(props) {
      return (
        <Menu
          mode="horizontal"
          className="myMenu"
          openAnimation="fade"
          overflowedIndicator={
            <div className="test-overflow-indicator">...</div>
          }
          {...props}
        >
          <MenuItem key="1">1</MenuItem>
          <MenuItem key="2" disabled>
            2
          </MenuItem>
          <MenuItem key="3">3</MenuItem>
          <MenuItem key="4">4</MenuItem>
        </Menu>
      );
    }

    let wrapper;

    it('getWidth should contain margin when includeMargin is set to true', () => {
      const memorizedGetComputedStyle = window.getComputedStyle;
      window.getComputedStyle = () => ({
        marginLeft: '10px',
        marginRight: '10px',
      });
      expect(
        mockedUtil.getWidth(
          {
            getBoundingClientRect() {
              return { width: 10 };
            },
          },
          true,
        ),
      ).toEqual(30);
      window.getComputedStyle = memorizedGetComputedStyle;
    });

    it('should not include overflow indicator when having enough width', () => {
      const indicatorWidth = 50; // actual width including 40 px padding, which will be 50;
      const liWidths = [50, 50, 50, 50];
      const availableWidth = 250;
      const widths = [...liWidths, indicatorWidth, availableWidth];
      let i = 0;
      mockedUtil.getWidth = () => {
        const id = i;
        i += 1;
        return widths[id];
      };
      wrapper = mount(createMenu());

      // overflow indicator placeholder
      expect(
        wrapper
          .find(overflowIndicatorSelector)
          .at(4)
          .prop('style'),
      ).toEqual({
        visibility: 'hidden',
        position: 'absolute',
      });

      // last overflow indicator should be hidden
      expect(
        wrapper
          .find(overflowIndicatorSelector)
          .at(3)
          .prop('style'),
      ).toEqual({
        display: 'none',
      });

      expect(
        wrapper
          .find('MenuItem li')
          .at(0)
          .prop('style'),
      ).toEqual({});
      expect(
        wrapper
          .find('MenuItem li')
          .at(1)
          .prop('style'),
      ).toEqual({});
      expect(
        wrapper
          .find('MenuItem li')
          .at(2)
          .prop('style'),
      ).toEqual({});
      expect(
        wrapper
          .find('MenuItem li')
          .at(3)
          .prop('style'),
      ).toEqual({});
    });

    it('should include overflow indicator when having not enough width', () => {
      const indicatorWidth = 5; // actual width including 40 px padding, which will be 45;
      const liWidths = [50, 50, 50, 50];
      const availableWidth = 145;
      const widths = [...liWidths, indicatorWidth, availableWidth];
      let i = 0;
      mockedUtil.getWidth = () => {
        const id = i;
        i += 1;
        return widths[id];
      };
      wrapper = mount(createMenu());

      expect(
        wrapper
          .find('MenuItem li')
          .at(0)
          .prop('style'),
      ).toEqual({});
      expect(
        wrapper
          .find('MenuItem li')
          .at(1)
          .prop('style'),
      ).toEqual({});
      expect(
        wrapper
          .find('MenuItem li')
          .at(2)
          .prop('style'),
      ).toEqual({ display: 'none' });
      expect(
        wrapper
          .find('MenuItem li')
          .at(3)
          .prop('style'),
      ).toEqual({ display: 'none' });

      expect(
        wrapper
          .find(overflowIndicatorSelector)
          .at(2)
          .prop('style'),
      ).toEqual({});
      expect(
        wrapper
          .find(overflowIndicatorSelector)
          .at(3)
          .prop('style'),
      ).toEqual({
        display: 'none',
      });
    });

    describe('props changes', () => {
      it('should recalculate overflow on children length changes', () => {
        const liWidths = [50, 50, 50, 50];
        const availableWidth = 145;
        const indicatorWidth = 45;
        const widths = [...liWidths, indicatorWidth, availableWidth];
        let i = 0;

        mockedUtil.getWidth = () => {
          const id = i;
          i += 1;
          return widths[id];
        };

        wrapper = mount(createMenu());

        expect(wrapper.find(overflowIndicatorSelector).length).toEqual(5);
        expect(
          wrapper
            .find(overflowIndicatorSelector)
            .at(1)
            .prop('style'),
        ).toEqual({
          display: 'none',
        });
        expect(
          wrapper
            .find(overflowIndicatorSelector)
            .at(2)
            .prop('style'),
        ).toEqual({});

        wrapper.setProps({ children: <MenuItem>child</MenuItem> });
        wrapper.update();

        expect(wrapper.find(overflowIndicatorSelector).length).toEqual(2);
        expect(
          wrapper
            .find(overflowIndicatorSelector)
            .at(0)
            .prop('style'),
        ).toEqual({
          display: 'none',
        });
      });
    });
  });

  describe('motion', () => {
    it('defaultMotions should work correctly', () => {
      const defaultMotions = {
        inline: { motionName: 'inlineMotion' },
        horizontal: { motionName: 'horizontalMotion' },
        other: { motionName: 'defaultMotion' },
      };
      const wrapper = mount(
        <Menu mode="inline" defaultMotions={defaultMotions} />,
      );
      expect(getMotion(wrapper.props(), wrapper.state(), 'inline')).toEqual({
        motionName: 'inlineMotion',
      });
      expect(getMotion(wrapper.props(), wrapper.state(), 'horizontal')).toEqual(
        {
          motionName: 'horizontalMotion',
        },
      );
      expect(getMotion(wrapper.props(), wrapper.state(), 'vertical')).toEqual({
        motionName: 'defaultMotion',
      });
    });

    it('get correct animation type when switched from inline', () => {
      const wrapper = mount(<Menu mode="inline" />);
      wrapper.setProps({ mode: 'horizontal' });
      expect(getMotion(wrapper.props(), wrapper.state())).toEqual(null);
    });

    it('warning if use `openAnimation` as object', () => {
      const warnSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      mount(<Menu openAnimation={{}} />);
      expect(warnSpy).toHaveBeenCalledWith(
        'Warning: Object type of `openAnimation` is removed. Please use `motion` instead.',
      );
      warnSpy.mockRestore();
    });

    it('motion object', () => {
      const motion = { test: true };
      const wrapper = mount(<Menu motion={motion} />);
      expect(getMotion(wrapper.props(), wrapper.state())).toEqual(motion);
    });

    it('legacy openTransitionName', () => {
      const wrapper = mount(<Menu openTransitionName="legacy" />);
      expect(getMotion(wrapper.props(), wrapper.state())).toEqual({
        motionName: 'legacy',
      });
    });
  });

  it('onMouseEnter should work', () => {
    const onMouseEnter = jest.fn();
    const wrapper = mount(
      <Menu onMouseEnter={onMouseEnter} defaultSelectedKeys={['test1']}>
        <MenuItem key="test1">Navigation One</MenuItem>
        <MenuItem key="test2">Navigation Two</MenuItem>
      </Menu>,
    );
    wrapper
      .find(Menu)
      .at(0)
      .simulate('mouseenter');
    expect(onMouseEnter).toHaveBeenCalled();
  });

  describe('inlineCollapse and siderCollapsed', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should always follow openKeys when mode is switched', () => {
      const wrapper = mount(
        <Menu openKeys={['1']} mode="inline">
          <SubMenu key="1" title="submenu1">
            <MenuItem key="submenu1">Option 1</MenuItem>
            <MenuItem key="submenu2">Option 2</MenuItem>
          </SubMenu>
          <MenuItem key="2">menu2</MenuItem>
        </Menu>,
      );
      expect(
        wrapper
          .find('ul.rc-menu-sub')
          .at(0)
          .hasClass('rc-menu-hidden'),
      ).toBe(false);
      wrapper.setProps({ mode: 'vertical' });
      expect(
        wrapper
          .find('ul.rc-menu-sub')
          .at(0)
          .hasClass('rc-menu-hidden'),
      ).toBe(false);
      wrapper.setProps({ mode: 'inline' });
      expect(
        wrapper
          .find('ul.rc-menu-sub')
          .at(0)
          .hasClass('rc-menu-hidden'),
      ).toBe(false);
    });

    it('should always follow openKeys when inlineCollapsed is switched', () => {
      const wrapper = mount(
        <Menu defaultOpenKeys={['1']} mode="inline">
          <MenuItem key="menu1">
            <span>Option</span>
          </MenuItem>
          <SubMenu key="1" title="submenu1">
            <MenuItem key="submenu1">Option</MenuItem>
            <MenuItem key="submenu2">Option</MenuItem>
          </SubMenu>
        </Menu>,
      );
      expect(
        wrapper
          .find('ul.rc-menu-sub')
          .at(0)
          .hasClass('rc-menu-inline'),
      ).toBe(true);
      expect(
        wrapper
          .find('ul.rc-menu-sub')
          .at(0)
          .hasClass('rc-menu-hidden'),
      ).toBe(false);

      wrapper.setProps({ inlineCollapsed: true });
      // 动画结束后套样式;
      jest.runAllTimers();
      wrapper.update();
      wrapper.simulate('transitionEnd', { propertyName: 'width' });

      expect(
        wrapper
          .find('ul.rc-menu-root')
          .at(0)
          .hasClass('rc-menu-vertical'),
      ).toBe(true);
      expect(wrapper.find('ul.rc-menu-sub').length).toBe(0);

      wrapper.setProps({ inlineCollapsed: false });
      jest.runAllTimers();
      wrapper.update();

      expect(
        wrapper
          .find('ul.rc-menu-sub')
          .at(0)
          .hasClass('rc-menu-inline'),
      ).toBe(true);
      expect(
        wrapper
          .find('ul.rc-menu-sub')
          .at(0)
          .hasClass('rc-menu-hidden'),
      ).toBe(false);
    });

    it('inlineCollapsed should works well when specify a not existed default openKeys', () => {
      const wrapper = mount(
        <Menu defaultOpenKeys={['not-existed']} mode="inline">
          <MenuItem key="menu1">
            <span>Option</span>
          </MenuItem>
          <SubMenu key="1" title="submenu1">
            <MenuItem key="submenu1">Option</MenuItem>
            <MenuItem key="submenu2">Option</MenuItem>
          </SubMenu>
        </Menu>,
      );
      expect(wrapper.find('.rc-menu-sub').length).toBe(0);
      wrapper.setProps({ inlineCollapsed: true });
      jest.runAllTimers();
      wrapper.update();
      wrapper.simulate('transitionEnd', { propertyName: 'width' });
      wrapper
        .find('.rc-menu-submenu-title')
        .at(0)
        .simulate('mouseEnter');
      jest.runAllTimers();
      wrapper.update();
      expect(
        wrapper
          .find('.rc-menu-submenu')
          .at(0)
          .hasClass('rc-menu-submenu-vertical'),
      ).toBe(true);
      expect(
        wrapper
          .find('.rc-menu-submenu')
          .at(0)
          .hasClass('rc-menu-submenu-open'),
      ).toBe(true);
      expect(
        wrapper
          .find('ul.rc-menu-sub')
          .at(0)
          .hasClass('rc-menu-vertical'),
      ).toBe(true);
      expect(
        wrapper
          .find('ul.rc-menu-sub')
          .at(0)
          .hasClass('rc-menu-hidden'),
      ).toBe(false);
    });

    it('inlineCollapsed MenuItem Tooltip can be removed', () => {
      const wrapper = mount(
        <Menu
          defaultOpenKeys={['not-existed']}
          mode="inline"
          inlineCollapsed
          getPopupContainer={node => node.parentNode}
        >
          <MenuItem key="menu1">item</MenuItem>
          <MenuItem key="menu2" title="title">
            item
          </MenuItem>
          <MenuItem key="menu3" title={undefined}>
            item
          </MenuItem>
          <MenuItem key="menu4" title={null}>
            item
          </MenuItem>
          <MenuItem key="menu5" title="">
            item
          </MenuItem>
          <MenuItem key="menu6" title={false}>
            item
          </MenuItem>
        </Menu>,
      );
      expect(
        wrapper
          .find(MenuItem)
          .at(0)
          .getDOMNode().title,
      ).toBe('');
      expect(
        wrapper
          .find(MenuItem)
          .at(1)
          .getDOMNode().title,
      ).toBe('title');
      expect(
        wrapper
          .find(MenuItem)
          .at(2)
          .getDOMNode().title,
      ).toBe('');
      expect(
        wrapper
          .find(MenuItem)
          .at(3)
          .getDOMNode().title,
      ).toBe('');
      expect(
        wrapper
          .find(MenuItem)
          .at(4)
          .getDOMNode().title,
      ).toBe('');
      expect(
        wrapper
          .find(MenuItem)
          .at(4)
          .getDOMNode().title,
      ).toBe('');
    });

    it('should use siderCollapsed when siderCollapsed is passed', () => {
      const wrapper = mount(
        <Menu
          openKeys={['1']}
          mode="inline"
          inlineCollapsed
          siderCollapsed={false}
        >
          <SubMenu key="1" title="submenu1">
            <MenuItem key="submenu1">Option 1</MenuItem>
            <MenuItem key="submenu2">Option 2</MenuItem>
          </SubMenu>
          <MenuItem key="2">menu2</MenuItem>
        </Menu>,
      );
      expect(wrapper.instance().getInlineCollapsed()).toBe(false);
    });

    // https://github.com/ant-design/ant-design/issues/18825
    // https://github.com/ant-design/ant-design/issues/8587
    it('should keep selectedKeys in state when collapsed to 0px', () => {
      const wrapper = mount(
        <Menu
          mode="inline"
          inlineCollapsed={false}
          defaultSelectedKeys={['1']}
          collapsedWidth={0}
          openKeys={['3']}
        >
          <MenuItem key="1">Option 1</MenuItem>
          <MenuItem key="2">Option 2</MenuItem>
          <SubMenu key="3" title="Option 3">
            <MenuItem key="4">Option 4</MenuItem>
          </SubMenu>
        </Menu>,
      );
      expect(
        wrapper.find('.rc-menu-item-selected').getDOMNode().textContent,
      ).toBe('Option 1');
      wrapper
        .find('.rc-menu-item')
        .at(1)
        .simulate('click');
      expect(
        wrapper.find('.rc-menu-item-selected').getDOMNode().textContent,
      ).toBe('Option 2');
      wrapper.setProps({ inlineCollapsed: true });
      jest.runAllTimers();
      wrapper.update();
      expect(
        wrapper
          .find('Trigger')
          .map(node => node.prop('popupVisible'))
          .findIndex(node => !!node),
      ).toBe(-1);
      wrapper.setProps({ inlineCollapsed: false });
      expect(
        wrapper.find('.rc-menu-item-selected').getDOMNode().textContent,
      ).toBe('Option 2');
    });

    it('should hideMenu in initial state  when collapsed to 0px', () => {
      const wrapper = mount(
        <Menu
          mode="inline"
          inlineCollapsed
          defaultSelectedKeys={['1']}
          collapsedWidth={0}
          openKeys={['3']}
        >
          <MenuItem key="1">Option 1</MenuItem>
          <MenuItem key="2">Option 2</MenuItem>
          <SubMenu key="3" title="Option 3">
            <MenuItem key="4">Option 4</MenuItem>
          </SubMenu>
        </Menu>,
      );
      expect(
        wrapper
          .find('Trigger')
          .map(node => node.prop('popupVisible'))
          .findIndex(node => !!node),
      ).toBe(-1);
      wrapper.setProps({ inlineCollapsed: false });
      jest.runAllTimers();
      wrapper.update();
      expect(
        wrapper.find('.rc-menu-item-selected').getDOMNode().textContent,
      ).toBe('Option 1');
    });
  });
});
/* eslint-enable */
