/* eslint-disable no-undef */
import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import Menu, { MenuItem, SubMenu } from '../src';
import { resetWarned } from 'rc-util/lib/warning';

describe('SubMenu', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  function createMenu(props) {
    return (
      <Menu {...props}>
        <SubMenu key="s1" title="submenu1">
          <MenuItem key="s1-1">1</MenuItem>
          <SubMenu key="s1-2" title="submenu1-1">
            <MenuItem key="s1-2-1">2</MenuItem>
          </SubMenu>
        </SubMenu>
        <SubMenu key="s2" title="submenu2">
          <MenuItem key="s2-2">2</MenuItem>
        </SubMenu>
      </Menu>
    );
  }

  function itemIcon() {
    return <span>MenuItemIcon</span>;
  }

  it("don't show submenu when disabled", () => {
    const wrapper = mount(
      <Menu mode="vertical">
        <SubMenu key="s" title="submenu" disabled>
          <MenuItem key="1">1</MenuItem>
        </SubMenu>
      </Menu>,
    );
    wrapper.find('.rc-menu-submenu-title').first().simulate('mouseEnter');

    expect(wrapper.find('PopupTrigger').prop('visible')).toBeFalsy();
  });

  it('offsets the submenu popover', () => {
    const wrapper = mount(
      <Menu mode="horizontal" disabledOverflow>
        <SubMenu key="s" title="submenu" popupOffset={[0, 15]}>
          <MenuItem key="1">1</MenuItem>
        </SubMenu>
      </Menu>,
    );

    const popupAlign = wrapper.find('Trigger').first().prop('popupAlign');
    expect(popupAlign).toEqual({ offset: [0, 15] });
  });

  it('should render custom arrow icon correctly.', () => {
    const wrapper = mount(
      <Menu
        mode="vertical"
        itemIcon={itemIcon}
        expandIcon={<span>SubMenuIconNode</span>}
      >
        <SubMenu key="s" title="submenu">
          <MenuItem key="1">1</MenuItem>
          <MenuItem key="2">2</MenuItem>
        </SubMenu>
      </Menu>,
    );

    const wrapperWithExpandIconFunction = mount(
      <Menu
        mode="vertical"
        itemIcon={itemIcon}
        expandIcon={() => <span>SubMenuIconNode</span>}
      >
        <SubMenu key="s" title="submenu">
          <MenuItem key="1">1</MenuItem>
          <MenuItem key="2">2</MenuItem>
        </SubMenu>
      </Menu>,
    );

    const subMenuText = wrapper.find('.rc-menu-submenu-title').first().text();
    const subMenuTextWithExpandIconFunction = wrapperWithExpandIconFunction
      .find('.rc-menu-submenu-title')
      .first()
      .text();
    expect(subMenuText).toEqual('submenuSubMenuIconNode');
    expect(subMenuTextWithExpandIconFunction).toEqual('submenuSubMenuIconNode');
  });

  it('should Not render custom arrow icon in horizontal mode.', () => {
    const wrapper = mount(
      <Menu mode="horizontal" disabledOverflow>
        <SubMenu
          key="s"
          title="submenu"
          itemIcon={itemIcon}
          expandIcon={<span>SubMenuIconNode</span>}
        >
          <MenuItem key="1">1</MenuItem>
        </SubMenu>
      </Menu>,
    );

    const childText = wrapper.find('.rc-menu-submenu-title').hostNodes().text();
    expect(childText).toEqual('submenu');
  });

  describe('openSubMenuOnMouseEnter and closeSubMenuOnMouseLeave are true', () => {
    it('toggles when mouse enter and leave', () => {
      const wrapper = mount(createMenu());

      // Enter
      wrapper.find('.rc-menu-submenu-title').first().simulate('mouseEnter');
      act(() => {
        jest.runAllTimers();
        wrapper.update();
      });
      expect(wrapper.find('PopupTrigger').first().prop('visible')).toBeTruthy();

      // Leave
      wrapper.find('.rc-menu-submenu-title').first().simulate('mouseLeave');
      act(() => {
        jest.runAllTimers();
        wrapper.update();
      });
      expect(wrapper.find('PopupTrigger').first().prop('visible')).toBeFalsy();
    });
  });

  describe('openSubMenuOnMouseEnter and closeSubMenuOnMouseLeave are false', () => {
    it('toggles when mouse click', () => {
      const wrapper = mount(
        createMenu({
          triggerSubMenuAction: 'click',
        }),
      );

      wrapper.find('.rc-menu-submenu-title').first().simulate('click');
      act(() => {
        jest.runAllTimers();
        wrapper.update();
      });
      expect(wrapper.find('PopupTrigger').first().prop('visible')).toBeTruthy();

      wrapper.find('.rc-menu-submenu-title').first().simulate('click');
      act(() => {
        jest.runAllTimers();
        wrapper.update();
      });
      expect(wrapper.find('PopupTrigger').first().prop('visible')).toBeFalsy();
    });
  });

  it('fires openChange event', () => {
    const handleOpenChange = jest.fn();
    const wrapper = mount(
      <Menu onOpenChange={handleOpenChange}>
        <MenuItem key="1">1</MenuItem>
        <SubMenu title="s1">
          <MenuItem key="2">2</MenuItem>
          <SubMenu title="s2">
            <MenuItem key="3">3</MenuItem>
          </SubMenu>
        </SubMenu>
      </Menu>,
    );

    // First
    wrapper.find('div.rc-menu-submenu-title').at(0).simulate('mouseEnter');
    act(() => {
      jest.runAllTimers();
      wrapper.update();
    });
    expect(handleOpenChange).toHaveBeenCalledWith(['tmp_key-1']);

    // Second
    wrapper.find('div.rc-menu-submenu-title').at(1).simulate('mouseEnter');
    act(() => {
      jest.runAllTimers();
      wrapper.update();
    });
    expect(handleOpenChange).toHaveBeenCalledWith([
      'tmp_key-1',
      'tmp_key-tmp_key-1-1',
    ]);
  });

  describe('undefined key', () => {
    it('warning item', () => {
      resetWarned();

      const errorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      mount(
        <Menu>
          <MenuItem>1</MenuItem>
        </Menu>,
      );

      expect(errorSpy).toHaveBeenCalledWith(
        'Warning: MenuItem should not leave undefined `key`.',
      );

      errorSpy.mockRestore();
    });

    it('warning sub menu', () => {
      resetWarned();

      const errorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      mount(
        <Menu>
          <SubMenu />
        </Menu>,
      );

      expect(errorSpy).toHaveBeenCalledWith(
        'Warning: SubMenu should not leave undefined `key`.',
      );

      errorSpy.mockRestore();
    });

    it('should not warning', () => {
      resetWarned();

      const errorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      mount(
        <Menu>
          <Menu.Divider />
        </Menu>,
      );

      expect(errorSpy).not.toHaveBeenCalled();

      errorSpy.mockRestore();
    });
  });

  describe('mouse events', () => {
    it('mouse enter event on a submenu should not activate first item', () => {
      const wrapper = mount(createMenu({ openKeys: ['s1'] }));
      const title = wrapper.find('div.rc-menu-submenu-title').first();
      title.simulate('mouseEnter');

      act(() => {
        jest.runAllTimers();
        wrapper.update();
      });

      expect(wrapper.find('PopupTrigger').first().prop('visible')).toBeTruthy();
      expect(wrapper.isActive(0)).toBeFalsy();
    });

    it('click to open a submenu should not activate first item', () => {
      const wrapper = mount(createMenu({ triggerSubMenuAction: 'click' }));
      const subMenuTitle = wrapper.find('div.rc-menu-submenu-title').first();
      subMenuTitle.simulate('click');

      act(() => {
        jest.runAllTimers();
        wrapper.update();
      });

      expect(wrapper.find('PopupTrigger').first().prop('visible')).toBeTruthy();
      expect(wrapper.isActive(0)).toBeFalsy();
    });

    it('mouse enter/mouse leave on a subMenu item should trigger hooks', () => {
      const onMouseEnter = jest.fn();
      const onMouseLeave = jest.fn();
      const wrapper = mount(
        <Menu openKeys={['s1']}>
          <SubMenu
            key="s1"
            title="submenu1"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          >
            <MenuItem key="s1-1">1</MenuItem>
          </SubMenu>
        </Menu>,
      );
      const subMenu = wrapper.find('.rc-menu-submenu').first();
      subMenu.simulate('mouseEnter');
      expect(onMouseEnter).toHaveBeenCalledTimes(1);

      subMenu.simulate('mouseLeave');
      expect(onMouseLeave).toHaveBeenCalledTimes(1);
    });
  });

  it('fires select event', () => {
    const handleSelect = jest.fn();
    const wrapper = mount(createMenu({ onSelect: handleSelect }));
    wrapper.find('.rc-menu-submenu-title').first().simulate('mouseEnter');

    act(() => {
      jest.runAllTimers();
      wrapper.update();
    });

    wrapper.findItem().simulate('click');
    expect(handleSelect.mock.calls[0][0].key).toBe('s1-1');
  });

  it('fires select event with className', () => {
    const wrapper = mount(createMenu());
    wrapper.find('.rc-menu-submenu-title').first().simulate('mouseEnter');

    act(() => {
      jest.runAllTimers();
      wrapper.update();
    });

    wrapper.find('MenuItem').first().simulate('click');
    expect(
      wrapper.find('.rc-menu-submenu').first().is('.rc-menu-submenu-selected'),
    ).toBe(true);
  });

  it('fires deselect event for multiple menu', () => {
    const handleDeselect = jest.fn();
    const wrapper = mount(
      createMenu({
        multiple: true,
        onDeselect: handleDeselect,
      }),
    );
    wrapper.find('.rc-menu-submenu-title').first().simulate('mouseEnter');

    act(() => {
      jest.runAllTimers();
      wrapper.update();
    });

    wrapper.findItem().simulate('click');
    wrapper.findItem().simulate('click');
    expect(handleDeselect.mock.calls[0][0].key).toBe('s1-1');
  });

  it('should take style prop', () => {
    const App = () => (
      <Menu style={{ backgroundColor: 'black' }}>
        <SubMenu key="s1" title="submenu1">
          <MenuItem key="s1-1">1</MenuItem>
        </SubMenu>
      </Menu>
    );

    const wrapper = mount(<App show />);
    expect(wrapper.find('Menu ul').prop('style')).toEqual({
      backgroundColor: 'black',
    });
  });

  it('not pass style into sub menu item', () => {
    const wrapper = mount(
      <Menu mode="horizontal" style={{ background: 'green' }} disabledOverflow>
        <MenuItem style={{ color: 'red' }} key="1">
          1
        </MenuItem>
      </Menu>,
    );

    expect(wrapper.find('li.rc-menu-item').at(0).props().style).toEqual({
      color: 'red',
    });
  });

  it('inline click for open', () => {
    const onOpenChange = jest.fn();

    const wrapper = mount(
      <Menu mode="inline" onOpenChange={onOpenChange}>
        <SubMenu key="bamboo" title="Bamboo" disabled>
          <MenuItem key="little">Little</MenuItem>
        </SubMenu>
        <SubMenu key="light" title="Light">
          <MenuItem key="sub">Sub</MenuItem>
        </SubMenu>
      </Menu>,
    );

    // Disabled
    wrapper.find('div.rc-menu-submenu-title').first().simulate('click');
    expect(onOpenChange).not.toHaveBeenCalled();

    // Disabled
    wrapper.find('div.rc-menu-submenu-title').last().simulate('click');
    expect(onOpenChange).toHaveBeenCalledWith(['light']);
  });

  it('popup className should correct', () => {
    jest.useFakeTimers();

    const wrapper = mount(
      <Menu mode="horizontal" openKeys={['light']} disabledOverflow>
        <SubMenu key="light">
          <SubMenu key="bamboo" />
        </SubMenu>
      </Menu>,
    );

    act(() => {
      jest.runAllTimers();
      wrapper.update();
    });

    expect(
      wrapper
        .find('li.rc-menu-submenu')
        .first()
        .hasClass('rc-menu-submenu-horizontal'),
    ).toBeTruthy();
    expect(
      wrapper
        .find('li.rc-menu-submenu')
        .last()
        .hasClass('rc-menu-submenu-vertical'),
    ).toBeTruthy();

    jest.useRealTimers();
  });
});
/* eslint-enable */
