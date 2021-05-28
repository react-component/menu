/* eslint-disable no-undef, react/no-multi-comp, react/jsx-curly-brace-presence, max-classes-per-file */
import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import KeyCode from 'rc-util/lib/KeyCode';
import { resetWarned } from 'rc-util/lib/warning';
import Menu, { MenuItem, MenuItemGroup, SubMenu, Divider } from '../src';

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
      const wrapper = mount(createMenu());
      expect(wrapper.render()).toMatchSnapshot();
    });
  });

  it('set activeKey', () => {
    const wrapper = mount(
      <Menu activeKey="1">
        <MenuItem key="1">1</MenuItem>
        <MenuItem key="2">2</MenuItem>
      </Menu>,
    );
    expect(wrapper.isActive(0)).toBeTruthy();
    expect(wrapper.isActive(1)).toBeFalsy();

    wrapper.setProps({ activeKey: '2' });
    expect(wrapper.isActive(0)).toBeFalsy();
    expect(wrapper.isActive(1)).toBeTruthy();
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

  it('empty selectedKeys not to throw', () => {
    mount(
      <Menu selectedKeys={null}>
        <MenuItem key="foo">foo</MenuItem>
      </Menu>,
    );
  });

  it('not selectable', () => {
    const onSelect = jest.fn();

    const wrapper = mount(
      <Menu onSelect={onSelect} selectedKeys={[]}>
        <MenuItem key="bamboo">Bamboo</MenuItem>
      </Menu>,
    );

    wrapper.findItem(0).simulate('click');
    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ selectedKeys: ['bamboo'] }),
    );

    onSelect.mockReset();
    wrapper.setProps({ selectable: false });
    wrapper.findItem(0).simulate('click');
    expect(onSelect).not.toHaveBeenCalled();
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

  describe('openKeys', () => {
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

      expect(
        wrapper.find('InlineSubMenuList').first().props().open,
      ).toBeTruthy();
      expect(wrapper.find('InlineSubMenuList').last().props().open).toBeFalsy();

      wrapper.setProps({ openKeys: ['g2'] });
      expect(
        wrapper.find('InlineSubMenuList').first().props().open,
      ).toBeFalsy();
      expect(
        wrapper.find('InlineSubMenuList').last().props().open,
      ).toBeTruthy();
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

    it('null of openKeys', () => {
      const wrapper = mount(
        <Menu openKeys={null} mode="inline">
          <SubMenu key="bamboo" title="Bamboo">
            <MenuItem key="light">Light</MenuItem>
          </SubMenu>
        </Menu>,
      );
      expect(wrapper).toBeTruthy();
    });
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
    jest.useFakeTimers();

    resetWarned();

    const errorSpy = jest.spyOn(console, 'error');

    const handleClick = jest.fn();
    const wrapper = mount(
      <Menu onClick={handleClick} openKeys={['parent']}>
        <MenuItem key="1">1</MenuItem>
        <MenuItem key="2">2</MenuItem>
        <Menu.SubMenu key="parent">
          <MenuItem key="3">3</MenuItem>
        </Menu.SubMenu>
      </Menu>,
    );

    act(() => {
      jest.runAllTimers();
      wrapper.update();
    });

    wrapper.find('.rc-menu-item').first().simulate('click');
    const info = handleClick.mock.calls[0][0];
    expect(info.key).toBe('1');
    expect(info.item).toBeTruthy();

    expect(errorSpy).toHaveBeenCalledWith(
      'Warning: `info.item` is deprecated since we will move to function component that not provides React Node instance in future.',
    );

    handleClick.mockReset();
    wrapper.find('.rc-menu-item').last().simulate('click');
    expect(handleClick.mock.calls[0][0].keyPath).toEqual(['3', 'parent']);

    errorSpy.mockRestore();

    jest.useRealTimers();
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
    wrapper.find('Overflow').simulate('keyDown', { which: KeyCode.DOWN });
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

  describe('motion', () => {
    const defaultMotions = {
      inline: { motionName: 'inlineMotion' },
      horizontal: { motionName: 'horizontalMotion' },
      other: { motionName: 'defaultMotion' },
    };

    it('defaultMotions should work correctly', () => {
      const wrapper = mount(
        <Menu mode="inline" defaultMotions={defaultMotions}>
          <SubMenu key="bamboo">
            <MenuItem key="light" />
          </SubMenu>
        </Menu>,
      );

      // Inline
      wrapper.setProps({ mode: 'inline' });
      expect(wrapper.find('CSSMotion').last().prop('motionName')).toEqual(
        'inlineMotion',
      );

      // Horizontal
      wrapper.setProps({ mode: 'horizontal' });
      expect(
        wrapper.find('Trigger').last().prop('popupMotion').motionName,
      ).toEqual('horizontalMotion');

      // Default
      wrapper.setProps({ mode: 'vertical' });
      expect(
        wrapper.find('Trigger').last().prop('popupMotion').motionName,
      ).toEqual('defaultMotion');
    });

    it('motion is first level', () => {
      const wrapper = mount(
        <Menu
          mode="inline"
          defaultMotions={defaultMotions}
          motion={{ motionName: 'bambooLight' }}
        >
          <SubMenu key="bamboo">
            <MenuItem key="light" />
          </SubMenu>
        </Menu>,
      );

      // Inline
      wrapper.setProps({ mode: 'inline' });
      expect(wrapper.find('CSSMotion').last().prop('motionName')).toEqual(
        'bambooLight',
      );

      // Horizontal
      wrapper.setProps({ mode: 'horizontal' });
      expect(
        wrapper.find('Trigger').last().prop('popupMotion').motionName,
      ).toEqual('bambooLight');

      // Default
      wrapper.setProps({ mode: 'vertical' });
      expect(
        wrapper.find('Trigger').last().prop('popupMotion').motionName,
      ).toEqual('bambooLight');
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

    wrapper.find('ul.rc-menu-root').simulate('mouseEnter');
    expect(onMouseEnter).toHaveBeenCalled();
  });

  it('Nest children active should bump to top', async () => {
    const wrapper = mount(
      <Menu activeKey="light" mode="vertical">
        <SubMenu key="bamboo" title="Bamboo">
          <MenuItem key="light">Light</MenuItem>
        </SubMenu>
      </Menu>,
    );

    expect(wrapper.exists('.rc-menu-submenu-active')).toBeTruthy();
  });

  it('not warning on destroy', async () => {
    const errorSpy = jest.spyOn(console, 'error');

    const wrapper = mount(
      <Menu>
        <MenuItem key="bamboo">Bamboo</MenuItem>
      </Menu>,
    );

    wrapper.unmount();

    await Promise.resolve();

    expect(errorSpy).not.toHaveBeenCalled();

    errorSpy.mockRestore();
  });

  describe('Click should close Menu', () => {
    function test(name, props) {
      it(name, async () => {
        jest.useFakeTimers();

        const onOpenChange = jest.fn();

        const wrapper = mount(
          <Menu
            openKeys={['bamboo']}
            mode="vertical"
            onOpenChange={onOpenChange}
            {...props}
          >
            <SubMenu key="bamboo" title="Bamboo">
              <MenuItem key="light">Light</MenuItem>
            </SubMenu>
          </Menu>,
        );

        // Open menu
        await act(async () => {
          jest.runAllTimers();
          wrapper.update();
        });

        wrapper.update();

        wrapper.find('.rc-menu-item').last().simulate('click');
        expect(onOpenChange).toHaveBeenCalledWith([]);

        jest.useRealTimers();
      });
    }

    test('basic');
    test('not selectable', { selectable: false });
    test('inlineCollapsed', { mode: 'inline', inlineCollapsed: true });

    it('not close inline', async () => {
      jest.useFakeTimers();

      const onOpenChange = jest.fn();

      const wrapper = mount(
        <Menu openKeys={['bamboo']} mode="inline" onOpenChange={onOpenChange}>
          <SubMenu key="bamboo" title="Bamboo">
            <MenuItem key="light">Light</MenuItem>
          </SubMenu>
        </Menu>,
      );

      // Open menu
      await act(async () => {
        jest.runAllTimers();
        wrapper.update();
      });

      wrapper.update();

      wrapper.find('.rc-menu-item').last().simulate('click');
      expect(onOpenChange).not.toHaveBeenCalled();

      jest.useRealTimers();
    });
  });
});
/* eslint-enable */
