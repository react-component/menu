/* eslint-disable no-undef */
import React from 'react';
import { mount, shallow } from 'enzyme';
import KeyCode from 'rc-util/lib/KeyCode';
import Menu, { MenuItem } from '../src';

import { MenuItem as NakedMenuItem } from '../src/MenuItem';

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

  describe('menuItem events', () => {
    let onMouseEnter;
    let onMouseLeave;
    let onItemHover;
    let wrapper;
    let instance;
    const domEvent = { keyCode: 13 };
    const key = '1';

    beforeEach(() => {
      onMouseEnter = jest.fn();
      onMouseLeave = jest.fn();
      onItemHover = jest.fn();

      wrapper = shallow(
        <NakedMenuItem
          eventKey={key}
          onMouseEnter={onMouseEnter}
          onItemHover={onItemHover}
          onMouseLeave={onMouseLeave}
        >1</NakedMenuItem>);
      instance = wrapper.instance();
    });

    it('on enter key down should trigger mouse click', () => {
      instance.onClick = jest.fn();
      instance.onKeyDown(domEvent);

      expect(instance.onClick).toHaveBeenCalledWith(domEvent);
    });

    it('on mouse enter should trigger props.onItemHover props.onMouseEnter', () => {
      instance.onMouseEnter(domEvent);

      expect(onItemHover).toHaveBeenCalledWith({ key, hover: true });
      expect(onMouseEnter).toHaveBeenCalledWith({ key, domEvent });
    });

    it('on mouse leave should trigger props.onItemHover props.onMouseLeave', () => {
      instance.onMouseLeave(domEvent);

      expect(onItemHover).toHaveBeenCalledWith({ key, hover: false });
      expect(onMouseLeave).toHaveBeenCalledWith({ key, domEvent });
    });
  });
});
