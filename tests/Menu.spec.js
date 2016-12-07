/* eslint-disable no-undef */
import React from 'react';
import { mount } from 'enzyme';
import KeyCode from 'rc-util/lib/KeyCode';
import Menu, { MenuItem, SubMenu, Divider } from '../src';

describe('Menu', () => {
  it('Should set the correct item active', () => {
    const wrapper = mount(
      <Menu activeKey="item1">
        <MenuItem key="item1">Pill 1 content</MenuItem>
        <Divider/>
        <MenuItem key="item2">Pill 2 content</MenuItem>
      </Menu>
    );
    expect(wrapper.find('MenuItem').first().props().active).toBe(true);
    expect(wrapper.find('MenuItem').last().props().active).toBe(false);
  });

  it('Should call on select when item is selected', () => {
    const handleSelect = jest.fn();
    const wrapper = mount(
      <Menu activeKey="item1" onSelect={handleSelect}>
        <MenuItem key="item1" href="http://www.baidu.com">Tab 1 content</MenuItem>
        <MenuItem key="item2">
          Tab 2 content
        </MenuItem>
      </Menu>
    );
    wrapper.find('MenuItem').last().simulate('click');
    expect(handleSelect.mock.calls[0][0].key).toBe('item2');
  });

  it('active by mouse enter', () => {
    const wrapper = mount(
      <Menu>
        <MenuItem key="item1">item</MenuItem>
        <MenuItem disabled>disabled</MenuItem>
        <MenuItem key="item2">item2</MenuItem>
      </Menu>
    );
    const menuItem = wrapper.find('MenuItem').last();
    menuItem.simulate('mouseEnter');
    expect(menuItem.props().active).toBe(true);
  });

  it('active by key down', () => {
    const wrapper = mount(
      <Menu activeKey="item1">
        <MenuItem key="item1">Pill 1 content</MenuItem>
        <MenuItem disabled/>
        <MenuItem key="item2">Pill 2 content</MenuItem>
        <SubMenu key="item3" className="dropdown-submenu" title="right">
          <MenuItem key="231">inner inner</MenuItem>
          <MenuItem key="242">inner inner2</MenuItem>
        </SubMenu>
      </Menu>
    );

    wrapper.simulate('keyDown', { keyCode: KeyCode.DOWN });
    expect(wrapper.find('MenuItem').at(2).props().active).toBe(true);
  });
});
