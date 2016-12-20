/* eslint-disable no-undef */
import React from 'react';
import { mount } from 'enzyme';
import KeyCode from 'rc-util/lib/KeyCode';
import Menu, { MenuItem } from '../src';

describe('MenuItem', () => {
  describe('disabled', () => {
    it('can not be active by key down', () => {
      const wrapper = mount(
        <Menu activeKey="1">
          <MenuItem key="1">1</MenuItem>
          <MenuItem disabled/>
          <MenuItem key="2">2</MenuItem>
        </Menu>
      );

      wrapper.simulate('keyDown', { keyCode: KeyCode.DOWN });
      expect(wrapper.find('MenuItem').at(1).props().active).toBe(false);
    });

    it('not fires select event when selected', () => {
      const handleSelect = jest.fn();
      const wrapper = mount(
        <Menu>
          <MenuItem disabled onSelect={handleSelect}>
            <span className="xx">Item content</span>
          </MenuItem>
        </Menu>
      );

      wrapper.find('.xx').simulate('click');
      expect(handleSelect).not.toBeCalled();
    });
  });

  describe('unmount', () => {
    const App = ({ show }) => {
      return (
        <Menu>
          {show && (
            <MenuItem key="1">1</MenuItem>
          )}
        </Menu>
      );
    };

    it('removes self from selectedKeys', () => {
      const wrapper = mount(<App show />);
      wrapper.find('MenuItem').simulate('click');
      expect(wrapper.find('Menu').node.state.selectedKeys).toEqual(['1']);
      wrapper.setProps({ show: false });
      expect(wrapper.find('Menu').node.state.selectedKeys).toEqual([]);
    });

    it('clears mouse leave timer', () => {
      const wrapper = mount(<App show />);
      const menu = wrapper.find('Menu');
      wrapper.find('MenuItem').simulate('mouseEnter');
      wrapper.find('MenuItem').simulate('mouseLeave');
      expect(menu.node.menuItemMouseLeaveFn).toBeTruthy();
      expect(menu.node.menuItemMouseLeaveTimer).toBeTruthy();
      wrapper.setProps({ show: false });
      expect(menu.node.menuItemMouseLeaveFn).toBe(null);
      expect(menu.node.menuItemMouseLeaveTimer).toBe(null);
    });
  });
});
