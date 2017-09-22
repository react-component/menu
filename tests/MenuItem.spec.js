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
    it('removes self from selectedKeys', () => {
      const wrapper = mount(
        <Menu>
          <MenuItem key="1">1</MenuItem>
        </Menu>
      );
      wrapper.find('MenuItem').simulate('click');
      expect(wrapper.state('selectedKeys')).toEqual(['1']);
      wrapper.setProps({ children: null });
      expect(wrapper.state('selectedKeys')).toEqual([]);
    });
  });
});
