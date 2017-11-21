/* eslint-disable no-undef */
import React from 'react';
import { mount } from 'enzyme';
import KeyCode from 'rc-util/lib/KeyCode';
import Menu, { MenuItem, SubMenu } from '../src';

describe('SubMenu', () => {
  function createMenu(props) {
    return (
      <Menu {...props}>
        <SubMenu key="s1" title="submenu1">
          <MenuItem key="1">1</MenuItem>
        </SubMenu>
        <SubMenu key="s2" title="submenu2">
          <MenuItem key="2">2</MenuItem>
        </SubMenu>
      </Menu>
    );
  }

  it('don\'t show submenu when disabled', () => {
    const wrapper = mount(
      <Menu mode="vertical">
        <SubMenu key="s" title="submenu" disabled>
          <MenuItem key="1">1</MenuItem>
        </SubMenu>
      </Menu>
    );
    wrapper.find('.rc-menu-submenu-title').first().simulate('mouseEnter');
    expect(wrapper.state('openKeys')).toEqual([]);
  });

  describe('openSubMenuOnMouseEnter and closeSubMenuOnMouseLeave are ture', () => {
    it('toggles when mouse enter and leave', () => {
      const wrapper = mount(createMenu());

      wrapper.find('.rc-menu-submenu-title').first().simulate('mouseEnter');
      expect(wrapper.state('openKeys')).toEqual(['s1']);

      jest.useFakeTimers();
      wrapper.find('.rc-menu-submenu-title').first().simulate('mouseLeave');
      jest.runAllTimers();
      expect(wrapper.state('openKeys')).toEqual([]);
    });
  });

  describe('openSubMenuOnMouseEnter and closeSubMenuOnMouseLeave are false', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = mount(createMenu({
        triggerSubMenuAction: 'click',
      }));
    });

    it('toggles when mouse click', () => {
      wrapper.find('.rc-menu-submenu-title').first().simulate('click');
      expect(wrapper.state('openKeys')).toEqual(['s1']);

      wrapper.find('.rc-menu-submenu-title').first().simulate('click');
      expect(wrapper.state('openKeys')).toEqual([]);
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
      </Menu>
    );

    wrapper.find('.rc-menu-submenu-title').at(0).simulate('mouseEnter');
    expect(handleOpenChange).toBeCalledWith(['item_1']);

    wrapper.find('.rc-menu-submenu-title').at(1).simulate('mouseEnter');
    expect(handleOpenChange).toBeCalledWith(['item_1', 'item_1-menu-item_1']);
  });

  describe('unmount', () => {
    const App = ({ show }) => {
      return (
        <Menu>
          {show && (
            <SubMenu key="s1" title="submenu">
              <MenuItem key="1">1</MenuItem>
            </SubMenu>
          )}
        </Menu>
      );
    };

    it('removes self key from openKeys', () => {
      const wrapper = mount(<App show />);
      wrapper.find('.rc-menu-submenu-title').first().simulate('mouseEnter');
      expect(wrapper.find('Menu').instance().state.openKeys).toEqual(['s1']);
      wrapper.setProps({ show: false });
      expect(wrapper.find('Menu').instance().state.openKeys).toEqual([]);
    });

    it('clears parent timers', () => {
      const wrapper = mount(<App show />);
      const parentMenu = wrapper.find('Menu').first();

      wrapper.find('.rc-menu-submenu').first().simulate('mouseEnter');
      wrapper.find('.rc-menu-submenu-title').first().simulate('mouseEnter');
      wrapper.find('.rc-menu-submenu-title').first().simulate('mouseLeave');
      wrapper.find('.rc-menu-submenu').first().simulate('mouseLeave');

      expect(parentMenu.instance().subMenuLeaveFn).toBeTruthy();
      expect(parentMenu.instance().subMenuLeaveTimer).toBeTruthy();
      expect(parentMenu.instance().subMenuTitleLeaveFn).toBeTruthy();
      expect(parentMenu.instance().subMenuTitleLeaveTimer).toBeTruthy();

      wrapper.setProps({ show: false });

      expect(parentMenu.instance().subMenuLeaveFn).toBe(null);
      expect(parentMenu.instance().subMenuLeaveTimer).toBe(null);
      expect(parentMenu.instance().subMenuTitleLeaveFn).toBe(null);
      expect(parentMenu.instance().subMenuTitleLeaveTimer).toBe(null);
    });
  });

  describe('key press', () => {
    describe('enter key', () => {
      it('opens menu and active first item', () => {
        const wrapper = mount(createMenu());
        const title = wrapper.find('.rc-menu-submenu-title').first();

        title.simulate('mouseEnter').simulate('keyDown', { keyCode: KeyCode.ENTER });

        expect(wrapper.find('.rc-menu-sub').first().is('.rc-menu-hidden')).toBe(false);
        expect(wrapper.find('MenuItem').first().props().active).toBe(true);
      });
    });

    describe('left & right key', () => {
      it('toggles menu', () => {
        const wrapper = mount(createMenu());
        const title = wrapper.find('.rc-menu-submenu-title').first();

        title.simulate('mouseEnter').simulate('keyDown', { keyCode: KeyCode.LEFT });
        expect(wrapper.state('openKeys')).toEqual([]);
        title.simulate('keyDown', { keyCode: KeyCode.RIGHT });
        expect(wrapper.state('openKeys')).toEqual(['s1']);

        expect(wrapper.find('MenuItem').first().props().active).toBe(true);
      });
    });


    it('up & down key', () => {
      const wrapper = mount(createMenu());
      const titles = wrapper.find('.rc-menu-submenu-title');

      titles.first().simulate('mouseEnter')
                    .simulate('keyDown', { keyCode: KeyCode.LEFT })
                    .simulate('keyDown', { keyCode: KeyCode.DOWN });
      expect(wrapper.find('.rc-menu-submenu').last().is('.rc-menu-submenu-active')).toBe(true);

      titles.last().simulate('keyDown', { keyCode: KeyCode.UP });
      expect(wrapper.find('.rc-menu-submenu').first().is('.rc-menu-submenu-active')).toBe(true);
    });
  });

  it('fires select event', () => {
    const handleSelect = jest.fn();
    const wrapper = mount(createMenu({ onSelect: handleSelect }));
    wrapper.find('.rc-menu-submenu-title').first().simulate('mouseEnter');

    wrapper.find('MenuItem').first().simulate('click');
    expect(handleSelect.mock.calls[0][0].key).toBe('1');
  });

  it('fires deselect event for multiple menu', () => {
    const handleDeselect = jest.fn();
    const wrapper = mount(createMenu({
      multiple: true,
      onDeselect: handleDeselect,
    }));
    wrapper.find('.rc-menu-submenu-title').first().simulate('mouseEnter');

    wrapper.find('MenuItem').first().simulate('click');
    wrapper.find('MenuItem').first().simulate('click');

    expect(handleDeselect.mock.calls[0][0].key).toBe('1');
  });
});
