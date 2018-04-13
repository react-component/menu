/* eslint-disable no-undef */
import React from 'react';
import { mount } from 'enzyme';
import KeyCode from 'rc-util/lib/KeyCode';
import Menu, { MenuItem, SubMenu } from '../src';

describe('SubMenu', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
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

  it('don\'t show submenu when disabled', () => {
    const wrapper = mount(
      <Menu mode="vertical">
        <SubMenu key="s" title="submenu" disabled>
          <MenuItem key="1">1</MenuItem>
        </SubMenu>
      </Menu>
    );
    wrapper.find('.rc-menu-submenu-title').first().simulate('mouseEnter');
    expect(wrapper.instance().store.getState().openKeys).toEqual([]);
  });

  describe('openSubMenuOnMouseEnter and closeSubMenuOnMouseLeave are true', () => {
    it('toggles when mouse enter and leave', () => {
      const wrapper = mount(createMenu());

      wrapper.find('.rc-menu-submenu-title').first().simulate('mouseEnter');
      jest.runAllTimers();
      expect(wrapper.instance().store.getState().openKeys).toEqual(['s1']);

      wrapper.find('.rc-menu-submenu-title').first().simulate('mouseLeave');
      jest.runAllTimers();
      expect(wrapper.instance().store.getState().openKeys).toEqual([]);
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
      expect(wrapper.instance().store.getState().openKeys).toEqual(['s1']);

      wrapper.find('.rc-menu-submenu-title').first().simulate('click');
      expect(wrapper.instance().store.getState().openKeys).toEqual([]);
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
    jest.runAllTimers();
    expect(handleOpenChange).toBeCalledWith(['item_1']);

    wrapper.update();

    wrapper.find('.rc-menu-submenu-title').at(1).simulate('mouseEnter');
    jest.runAllTimers();
    expect(handleOpenChange).toBeCalledWith(['item_1', 'item_1-menu-item_1']);
  });

  describe('mouse events', () => {
    it('mouse enter event on a submenu should not activate first item', () => {
      const wrapper = mount(createMenu({ openKeys: ['s1'] }));
      const title = wrapper.find('.rc-menu-submenu-title').first();
      title.simulate('mouseEnter');

      jest.runAllTimers();
      wrapper.update();

      expect(wrapper.find('.rc-menu-sub').first().is('.rc-menu-hidden')).toBe(false);
      expect(wrapper.find('MenuItem').first().props().active).toBe(false);
    });

    it('click to open a submenu should not activate first item', () => {
      const wrapper = mount(createMenu({ triggerSubMenuAction: 'click' }));
      const subMenuTitle = wrapper.find('.rc-menu-submenu-title').first();
      subMenuTitle.simulate('click');

      jest.runAllTimers();
      wrapper.update();

      expect(wrapper.find('.rc-menu-sub').first().is('.rc-menu-hidden')).toBe(false);
      expect(wrapper.find('MenuItem').first().props().active).toBe(false);
    });
  });

  describe('key press', () => {
    describe('enter key', () => {
      it('opens menu and active first item', () => {
        const wrapper = mount(createMenu());
        const title = wrapper.find('.rc-menu-submenu-title').first();

        title.simulate('mouseEnter').simulate('keyDown', { keyCode: KeyCode.ENTER });

        jest.runAllTimers();
        wrapper.update();

        expect(wrapper.find('.rc-menu-sub').first().is('.rc-menu-hidden')).toBe(false);
        expect(wrapper.find('MenuItem').first().props().active).toBe(true);
      });
    });

    describe('left & right key', () => {
      it('toggles menu', () => {
        const wrapper = mount(createMenu({ defaultActiveFirst: true }));
        const title = wrapper.find('.rc-menu-submenu-title').first();

        title.simulate('mouseEnter').simulate('keyDown', { keyCode: KeyCode.LEFT });
        expect(wrapper.instance().store.getState().openKeys).toEqual([]);
        title.simulate('keyDown', { keyCode: KeyCode.RIGHT });
        expect(wrapper.instance().store.getState().openKeys).toEqual(['s1']);
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

    it('combined key presses', () => {
      const wrapper = mount(createMenu());
      const titles = wrapper.find('.rc-menu-submenu-title');
      const firstItem = titles.first();

      // testing keydown event after submenu is closed and then opened again
      firstItem.simulate('mouseEnter')
                    .simulate('keyDown', { keyCode: KeyCode.RIGHT })
                    .simulate('keyDown', { keyCode: KeyCode.LEFT })
                    .simulate('keyDown', { keyCode: KeyCode.RIGHT })
                    .simulate('keyDown', { keyCode: KeyCode.DOWN })
                    .simulate('keyDown', { keyCode: KeyCode.DOWN })
                    .simulate('keyDown', { keyCode: KeyCode.DOWN });

      expect(
        wrapper
          .find('[title="submenu1-1"]')
          .find('.rc-menu-submenu')
          .first()
          .is('.rc-menu-submenu-active')
      ).toBe(true);
    });
  });

  it('fires select event', () => {
    const handleSelect = jest.fn();
    const wrapper = mount(createMenu({ onSelect: handleSelect }));
    wrapper.find('.rc-menu-submenu-title').first().simulate('mouseEnter');

    jest.runAllTimers();
    wrapper.update();

    wrapper.find('MenuItem').first().simulate('click');
    expect(handleSelect.mock.calls[0][0].key).toBe('s1-1');
  });

  it('fires deselect event for multiple menu', () => {
    const handleDeselect = jest.fn();
    const wrapper = mount(createMenu({
      multiple: true,
      onDeselect: handleDeselect,
    }));
    wrapper.find('.rc-menu-submenu-title').first().simulate('mouseEnter');

    jest.runAllTimers();
    wrapper.update();

    wrapper.find('MenuItem').first().simulate('click');
    wrapper.find('MenuItem').first().simulate('click');

    expect(handleDeselect.mock.calls[0][0].key).toBe('s1-1');
  });
});
