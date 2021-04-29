/* eslint-disable no-undef, react/no-multi-comp, react/jsx-curly-brace-presence, max-classes-per-file */
import React from 'react';
import { act } from 'react-dom/test-utils';
import { render, mount } from 'enzyme';
import { renderToJson } from 'enzyme-to-json';
import KeyCode from 'rc-util/lib/KeyCode';
import Menu, { MenuItem, MenuItemGroup, SubMenu, Divider } from '../src';
// import * as mockedUtil from '../src/util';
// import { getMotion } from '../src/utils/legacyUtil';

describe('Menu', () => {
  describe('should render', () => {
    function createMenu(props) {
      return (
        <Menu
          disabledOverflow
          className="myMenu"
          openAnimation="fade"
          {...props}
        >
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
        const wrapper = mount(createMenu({ mode }));
        expect(wrapper.render()).toMatchSnapshot();
      });

      it(`${mode} menu with empty children without error`, () => {
        expect(() => mount(<Menu mode={mode}>{[]}</Menu>)).not.toThrow();
      });

      it(`${mode} menu with undefined children without error`, () => {
        expect(() => mount(<Menu mode={mode} />)).not.toThrow();
      });

      it(`${mode} menu that has a submenu with undefined children without error`, () => {
        expect(() =>
          mount(
            <Menu mode={mode}>
              <SubMenu />
            </Menu>,
          ),
        ).not.toThrow();
      });

      it(`${mode} menu with rtl direction correctly`, () => {
        const wrapper = mount(createMenu({ mode, direction: 'rtl' }));
        expect(wrapper.render()).toMatchSnapshot();

        expect(wrapper.find('ul').first().props().className).toContain('-rtl');
      });
    });

    it('should support Fragment', () => {
      const wrapper = mount(
        <Menu>
          <SubMenu title="submenu">
            <MenuItem key="6">6</MenuItem>
          </SubMenu>
          <MenuItem key="7">6</MenuItem>
          <>
            <SubMenu title="submenu">
              <MenuItem key="8">6</MenuItem>
            </SubMenu>
            <MenuItem key="9">6</MenuItem>
          </>
        </Menu>,
      );
      expect(wrapper.render()).toMatchSnapshot();
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
      wrapper.find('.rc-menu-item').first().hasClass('rc-menu-item-active'),
    ).toBeTruthy();
    expect(
      wrapper.find('.rc-menu-item').last().hasClass('rc-menu-item-active'),
    ).toBeFalsy();
  });

  it('active first item', () => {
    const wrapper = mount(
      <Menu defaultActiveFirst>
        <MenuItem key="1">1</MenuItem>
        <MenuItem key="2">2</MenuItem>
      </Menu>,
    );
    expect(
      wrapper.find('.rc-menu-item').first().hasClass('rc-menu-item-active'),
    ).toBeTruthy();
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
    wrapper.find('.rc-menu-item').first().simulate('click');
    wrapper.find('.rc-menu-item').last().simulate('click');

    expect(wrapper.find('li.rc-menu-item-selected')).toHaveLength(2);
  });

  it('can be controlled by selectedKeys', () => {
    const wrapper = mount(
      <Menu selectedKeys={['1']}>
        <MenuItem key="1">1</MenuItem>
        <MenuItem key="2">2</MenuItem>
      </Menu>,
    );
    expect(wrapper.find('li').first().props().className).toContain('-selected');
    wrapper.setProps({ selectedKeys: ['2'] });
    wrapper.update();
    expect(wrapper.find('li').last().props().className).toContain('-selected');
  });

  it('select default item', () => {
    const wrapper = mount(
      <Menu defaultSelectedKeys={['1']}>
        <MenuItem key="1">1</MenuItem>
        <MenuItem key="2">2</MenuItem>
      </Menu>,
    );
    expect(wrapper.find('li').first().props().className).toContain('-selected');
  });

  it('issue https://github.com/ant-design/ant-design/issues/29429', () => {
    // don't use selectedKeys as string
    // it is a compatible feature for https://github.com/ant-design/ant-design/issues/29429
    const wrapper = mount(
      <Menu selectedKeys="item_abc">
        <MenuItem key="item_a">1</MenuItem>
        <MenuItem key="item_abc">2</MenuItem>
      </Menu>,
    );
    expect(wrapper.find('li').at(0).props().className).not.toContain(
      '-selected',
    );
    expect(wrapper.find('li').at(1).props().className).toContain('-selected');
  });

  it('can be controlled by openKeys', () => {
    const wrapper = mount(
      <Menu openKeys={['g1']}>
        <Menu.SubMenu key="g1">
          <MenuItem key="1">1</MenuItem>
        </Menu.SubMenu>
        <Menu.SubMenu key="g2">
          <MenuItem key="2">2</MenuItem>
        </Menu.SubMenu>
      </Menu>,
    );

    expect(wrapper.find('InlineSubMenuList').first().props().open).toBeTruthy();
    expect(wrapper.find('InlineSubMenuList').last().props().open).toBeFalsy();

    wrapper.setProps({ openKeys: ['g2'] });
    expect(wrapper.find('InlineSubMenuList').first().props().open).toBeFalsy();
    expect(wrapper.find('InlineSubMenuList').last().props().open).toBeTruthy();
  });

  it('openKeys should allow to be empty', () => {
    const wrapper = mount(
      <Menu
        onClick={() => {}}
        onOpenChange={() => {}}
        openKeys={undefined}
        selectedKeys={['1']}
        mode="inline"
      >
        <SubMenu title="1231">
          <MenuItem>
            <a>
              <span>123123</span>
            </a>
          </MenuItem>
        </SubMenu>
      </Menu>,
    );
    expect(wrapper).toBeTruthy();
  });

  it('open default submenu', () => {
    jest.useFakeTimers();

    const wrapper = mount(
      <Menu defaultOpenKeys={['g1']}>
        <SubMenu key="g1">
          <MenuItem key="1">1</MenuItem>
        </SubMenu>
        <SubMenu key="g2">
          <MenuItem key="2">2</MenuItem>
        </SubMenu>
      </Menu>,
    );

    act(() => {
      jest.runAllTimers();
      wrapper.update();
    });

    expect(wrapper.find('PopupTrigger').first().props().visible).toBeTruthy();
    expect(wrapper.find('PopupTrigger').last().props().visible).toBeFalsy();

    jest.useRealTimers();
  });

  it('fires select event', () => {
    const handleSelect = jest.fn();
    const wrapper = mount(
      <Menu onSelect={handleSelect}>
        <MenuItem key="1">1</MenuItem>
        <MenuItem key="2">2</MenuItem>
      </Menu>,
    );
    wrapper.find('MenuItem').first().simulate('click');
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
    wrapper.find('MenuItem').first().simulate('click');
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
    wrapper.find('MenuItem').first().simulate('click').simulate('click');
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
    wrapper.find('li').last().simulate('mouseEnter');
    expect(wrapper.isActive(2)).toBeTruthy();
  });

  it('active by key down', () => {
    const wrapper = mount(
      <Menu activeKey="1">
        <MenuItem key="1">1</MenuItem>
        <MenuItem key="2">2</MenuItem>
      </Menu>,
    );

    // KeyDown will not change activeKey since control
    wrapper.simulate('keyDown', { which: KeyCode.DOWN });
    expect(wrapper.isActive(0)).toBeTruthy();

    wrapper.setProps({ activeKey: '2' });
    expect(wrapper.isActive(1)).toBeTruthy();
  });

  it('defaultActiveFirst', () => {
    const wrapper = mount(
      <Menu selectedKeys={['foo']} defaultActiveFirst>
        <MenuItem key="foo">foo</MenuItem>
      </Menu>,
    );
    expect(wrapper.isActive(0)).toBeTruthy();
  });

  // it('should accept builtinPlacements', () => {
  //   const builtinPlacements = {
  //     leftTop: {
  //       points: ['tr', 'tl'],
  //       overflow: {
  //         adjustX: 0,
  //         adjustY: 0,
  //       },
  //       offset: [0, 0],
  //     },
  //   };

  //   const wrapper = mount(
  //     <Menu builtinPlacements={builtinPlacements}>
  //       <MenuItem>menuItem</MenuItem>
  //       <SubMenu title="submenu">
  //         <MenuItem>menuItem</MenuItem>
  //       </SubMenu>
  //     </Menu>,
  //   );

  //   expect(wrapper.find('Trigger').prop('builtinPlacements').leftTop).toEqual(
  //     builtinPlacements.leftTop,
  //   );
  // });

  // describe('submenu mode', () => {
  //   it('should use menu mode by default', () => {
  //     const wrapper = mount(
  //       <Menu mode="horizontal">
  //         <SubMenu title="submenu">
  //           <MenuItem>menuItem</MenuItem>
  //         </SubMenu>
  //       </Menu>,
  //     );

  //     expect(
  //       wrapper
  //         .find('SubMenu')
  //         .first()
  //         .prop('mode'),
  //     ).toEqual('horizontal');
  //   });

  //   it('should be able to customize SubMenu mode', () => {
  //     const wrapper = mount(
  //       <Menu mode="horizontal">
  //         <SubMenu title="submenu" mode="vertical-right">
  //           <MenuItem>menuItem</MenuItem>
  //         </SubMenu>
  //       </Menu>,
  //     );

  //     expect(
  //       wrapper
  //         .find('SubMenu')
  //         .first()
  //         .prop('mode'),
  //     ).toEqual('vertical-right');
  //   });
  // });

  // describe('DOMWrap Allow Overflow', () => {
  //   const overflowIndicatorSelector = 'SubMenu.rc-menu-overflowed-submenu';
  //   function createMenu(props) {
  //     return (
  //       <Menu
  //         mode="horizontal"
  //         className="myMenu"
  //         openAnimation="fade"
  //         overflowedIndicator={
  //           <div className="test-overflow-indicator">...</div>
  //         }
  //         {...props}
  //       >
  //         <MenuItem key="1">1</MenuItem>
  //         <MenuItem key="2" disabled>
  //           2
  //         </MenuItem>
  //         <MenuItem key="3">3</MenuItem>
  //         <MenuItem key="4">4</MenuItem>
  //       </Menu>
  //     );
  //   }

  //   let wrapper;

  //   it('getWidth should contain margin when includeMargin is set to true', () => {
  //     const memorizedGetComputedStyle = window.getComputedStyle;
  //     window.getComputedStyle = () => ({
  //       marginLeft: '10px',
  //       marginRight: '10px',
  //     });
  //     expect(
  //       mockedUtil.getWidth(
  //         {
  //           getBoundingClientRect() {
  //             return { width: 10 };
  //           },
  //         },
  //         true,
  //       ),
  //     ).toEqual(30);
  //     window.getComputedStyle = memorizedGetComputedStyle;
  //   });

  //   it('should not include overflow indicator when having enough width', () => {
  //     const indicatorWidth = 50; // actual width including 40 px padding, which will be 50;
  //     const liWidths = [50, 50, 50, 50];
  //     const availableWidth = 250;
  //     const widths = [...liWidths, indicatorWidth, availableWidth];
  //     let i = 0;
  //     mockedUtil.getWidth = () => {
  //       const id = i;
  //       i += 1;
  //       return widths[id];
  //     };
  //     wrapper = mount(createMenu());

  //     // overflow indicator placeholder
  //     expect(
  //       wrapper
  //         .find(overflowIndicatorSelector)
  //         .at(4)
  //         .prop('style'),
  //     ).toEqual({
  //       visibility: 'hidden',
  //       position: 'absolute',
  //     });

  //     // last overflow indicator should be hidden
  //     expect(
  //       wrapper
  //         .find(overflowIndicatorSelector)
  //         .at(3)
  //         .prop('style'),
  //     ).toEqual({
  //       display: 'none',
  //     });

  //     expect(
  //       wrapper
  //         .find('MenuItem li')
  //         .at(0)
  //         .prop('style'),
  //     ).toEqual({});
  //     expect(
  //       wrapper
  //         .find('MenuItem li')
  //         .at(1)
  //         .prop('style'),
  //     ).toEqual({});
  //     expect(
  //       wrapper
  //         .find('MenuItem li')
  //         .at(2)
  //         .prop('style'),
  //     ).toEqual({});
  //     expect(
  //       wrapper
  //         .find('MenuItem li')
  //         .at(3)
  //         .prop('style'),
  //     ).toEqual({});
  //   });

  //   it('should include overflow indicator when having not enough width', () => {
  //     const indicatorWidth = 5; // actual width including 40 px padding, which will be 45;
  //     const liWidths = [50, 50, 50, 50];
  //     const availableWidth = 145;
  //     const widths = [...liWidths, indicatorWidth, availableWidth];
  //     let i = 0;
  //     mockedUtil.getWidth = () => {
  //       const id = i;
  //       i += 1;
  //       return widths[id];
  //     };
  //     wrapper = mount(createMenu());

  //     expect(
  //       wrapper
  //         .find('MenuItem li')
  //         .at(0)
  //         .prop('style'),
  //     ).toEqual({});
  //     expect(
  //       wrapper
  //         .find('MenuItem li')
  //         .at(1)
  //         .prop('style'),
  //     ).toEqual({});
  //     expect(
  //       wrapper
  //         .find('MenuItem li')
  //         .at(2)
  //         .prop('style'),
  //     ).toEqual({ display: 'none' });
  //     expect(
  //       wrapper
  //         .find('MenuItem li')
  //         .at(3)
  //         .prop('style'),
  //     ).toEqual({ display: 'none' });

  //     expect(
  //       wrapper
  //         .find(overflowIndicatorSelector)
  //         .at(2)
  //         .prop('style'),
  //     ).toEqual({});
  //     expect(
  //       wrapper
  //         .find(overflowIndicatorSelector)
  //         .at(3)
  //         .prop('style'),
  //     ).toEqual({
  //       display: 'none',
  //     });
  //   });

  //   describe('props changes', () => {
  //     it('should recalculate overflow on children length changes', () => {
  //       const liWidths = [50, 50, 50, 50];
  //       const availableWidth = 145;
  //       const indicatorWidth = 45;
  //       const widths = [...liWidths, indicatorWidth, availableWidth];
  //       let i = 0;

  //       mockedUtil.getWidth = () => {
  //         const id = i;
  //         i += 1;
  //         return widths[id];
  //       };

  //       wrapper = mount(createMenu());

  //       expect(wrapper.find(overflowIndicatorSelector).length).toEqual(5);
  //       expect(
  //         wrapper
  //           .find(overflowIndicatorSelector)
  //           .at(1)
  //           .prop('style'),
  //       ).toEqual({
  //         display: 'none',
  //       });
  //       expect(
  //         wrapper
  //           .find(overflowIndicatorSelector)
  //           .at(2)
  //           .prop('style'),
  //       ).toEqual({});

  //       wrapper.setProps({ children: <MenuItem>child</MenuItem> });
  //       wrapper.update();

  //       expect(wrapper.find(overflowIndicatorSelector).length).toEqual(2);
  //       expect(
  //         wrapper
  //           .find(overflowIndicatorSelector)
  //           .at(0)
  //           .prop('style'),
  //       ).toEqual({
  //         display: 'none',
  //       });
  //     });
  //   });
  // });

  // describe('motion', () => {
  //   it('defaultMotions should work correctly', () => {
  //     const defaultMotions = {
  //       inline: { motionName: 'inlineMotion' },
  //       horizontal: { motionName: 'horizontalMotion' },
  //       other: { motionName: 'defaultMotion' },
  //     };
  //     const wrapper = mount(
  //       <Menu mode="inline" defaultMotions={defaultMotions} />,
  //     );
  //     expect(getMotion(wrapper.props(), wrapper.state(), 'inline')).toEqual({
  //       motionName: 'inlineMotion',
  //     });
  //     expect(getMotion(wrapper.props(), wrapper.state(), 'horizontal')).toEqual(
  //       {
  //         motionName: 'horizontalMotion',
  //       },
  //     );
  //     expect(getMotion(wrapper.props(), wrapper.state(), 'vertical')).toEqual({
  //       motionName: 'defaultMotion',
  //     });
  //   });

  //   it('get correct animation type when switched from inline', () => {
  //     const wrapper = mount(<Menu mode="inline" />);
  //     wrapper.setProps({ mode: 'horizontal' });
  //     expect(getMotion(wrapper.props(), wrapper.state())).toEqual(null);
  //   });

  //   it('warning if use `openAnimation` as object', () => {
  //     const warnSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  //     mount(<Menu openAnimation={{}} />);
  //     expect(warnSpy).toHaveBeenCalledWith(
  //       'Warning: Object type of `openAnimation` is removed. Please use `motion` instead.',
  //     );
  //     warnSpy.mockRestore();
  //   });

  //   it('motion object', () => {
  //     const motion = { test: true };
  //     const wrapper = mount(<Menu motion={motion} />);
  //     expect(getMotion(wrapper.props(), wrapper.state())).toEqual(motion);
  //   });

  //   it('legacy openTransitionName', () => {
  //     const wrapper = mount(<Menu openTransitionName="legacy" />);
  //     expect(getMotion(wrapper.props(), wrapper.state())).toEqual({
  //       motionName: 'legacy',
  //     });
  //   });
  // });

  // it('onMouseEnter should work', () => {
  //   const onMouseEnter = jest.fn();
  //   const wrapper = mount(
  //     <Menu onMouseEnter={onMouseEnter} defaultSelectedKeys={['test1']}>
  //       <MenuItem key="test1">Navigation One</MenuItem>
  //       <MenuItem key="test2">Navigation Two</MenuItem>
  //     </Menu>,
  //   );
  //   wrapper
  //     .find(Menu)
  //     .at(0)
  //     .simulate('mouseenter');
  //   expect(onMouseEnter).toHaveBeenCalled();
  // });
});
/* eslint-enable */
