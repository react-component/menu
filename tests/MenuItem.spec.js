/* eslint-disable no-undef */
import React from 'react';
import { mount } from 'enzyme';
import Menu, { MenuItem } from '../src';

describe('MenuItem', () => {
  it('Should add disabled class', () => {
    const wrapper = mount(
      <Menu>
        <MenuItem disabled>Pill 2 content</MenuItem>
      </Menu>
    );
    expect(wrapper.find('.rc-menu-item-disabled').length).toBe(1);
  });

  it('Should not call `onSelect` when item disabled and is selected', () => {
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
