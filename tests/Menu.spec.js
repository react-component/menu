/* eslint-disable no-undef */
import React from 'react';
import { render, mount } from 'enzyme';
import { renderToJson } from 'enzyme-to-json';
import KeyCode from 'rc-util/lib/KeyCode';
import Menu, { MenuItem, MenuItemGroup, SubMenu, Divider } from '../src';

describe('Menu', () => {
  describe('render', () => {
    function createMenu(props) {
      return (
        <Menu
          className="myMenu"
          openAnimation="fade"
          {...props}
        >
          <MenuItemGroup title="g1">
            <MenuItem key="1">1</MenuItem>
            <Divider/>
            <MenuItem key="2">2</MenuItem>
          </MenuItemGroup>
          <MenuItem key="3">3</MenuItem>
          <MenuItemGroup title="g2">
            <MenuItem key="4">4</MenuItem>
            <MenuItem key="5" disabled>5</MenuItem>
          </MenuItemGroup>
          <SubMenu title="submenu">
            <MenuItem key="6">6</MenuItem>
          </SubMenu>
        </Menu>
      );
    }

    ['vertical', 'horizontal', 'inline'].forEach((mode) => {
      it(`renders ${mode} menu correctly`, () => {
        const wrapper = render(createMenu({ [mode]: true }));
        expect(renderToJson(wrapper)).toMatchSnapshot();
      });
    });
  });


  it('set activeKey', () => {
    const wrapper = mount(
      <Menu activeKey="1">
        <MenuItem key="1">1</MenuItem>
        <MenuItem key="2">2</MenuItem>
      </Menu>
    );
    expect(wrapper.find('MenuItem').first().props().active).toBe(true);
    expect(wrapper.find('MenuItem').last().props().active).toBe(false);
  });

  it('active first item', () => {
    const wrapper = mount(
      <Menu defaultActiveFirst>
        <MenuItem key="1">1</MenuItem>
        <MenuItem key="2">2</MenuItem>
      </Menu>
    );
    expect(wrapper.find('MenuItem').first().props().active).toBe(true);
  });

  it('select multiple items', () => {
    const wrapper = mount(
      <Menu multiple>
        <MenuItem key="1">1</MenuItem>
        <MenuItem key="2">2</MenuItem>
      </Menu>
    );
    wrapper.find('MenuItem').first().simulate('click');
    wrapper.find('MenuItem').last().simulate('click');

    expect(wrapper.find('.rc-menu-item-selected').length).toBe(2);
  });

  it('can be controlled by selectedKeys', () => {
    const wrapper = mount(
      <Menu selectedKeys={['1']}>
        <MenuItem key="1">1</MenuItem>
        <MenuItem key="2">2</MenuItem>
      </Menu>
    );
    expect(wrapper.find('li').first().props().className).toContain('-selected');
    wrapper.setProps({ selectedKeys: ['2'] });
    expect(wrapper.find('li').last().props().className).toContain('-selected');
  });

  it('select default item', () => {
    const wrapper = mount(
      <Menu defaultSelectedKeys={['1']}>
        <MenuItem key="1">1</MenuItem>
        <MenuItem key="2">2</MenuItem>
      </Menu>
    );
    expect(wrapper.find('li').first().props().className).toContain('-selected');
  });

  it('can be controlled by openKeys', () => {
    const wrapper = mount(
      <Menu openKeys={['g1']}>
        <MenuItemGroup key="g1">
          <MenuItem key="1">1</MenuItem>
        </MenuItemGroup>
        <MenuItemGroup key="g2">
          <MenuItem key="2">2</MenuItem>
        </MenuItemGroup>
      </Menu>
    );
    expect(wrapper.find('ul').first().props().className).not.toContain('-hidden');
    wrapper.setProps({ openKeys: ['g2'] });
    expect(wrapper.find('ul').last().props().className).not.toContain('-hidden');
  });

  it('open default submenu', () => {
    const wrapper = mount(
      <Menu defaultOpenKeys={['g1']}>
        <MenuItemGroup key="g1">
          <MenuItem key="1">1</MenuItem>
        </MenuItemGroup>
        <MenuItemGroup key="g2">
          <MenuItem key="2">2</MenuItem>
        </MenuItemGroup>
      </Menu>
    );
    expect(wrapper.find('ul').first().props().className).not.toContain('-hidden');
  });

  it('fires select event', () => {
    const handleSelect = jest.fn();
    const wrapper = mount(
      <Menu onSelect={handleSelect}>
        <MenuItem key="1">1</MenuItem>
        <MenuItem key="2">2</MenuItem>
      </Menu>
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
      </Menu>
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
      </Menu>
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
      </Menu>
    );
    const menuItem = wrapper.find('MenuItem').last();
    menuItem.simulate('mouseEnter');
    expect(menuItem.props().active).toBe(true);
  });

  it('active by key down', () => {
    const wrapper = mount(
      <Menu activeKey="1">
        <MenuItem key="1">1</MenuItem>
        <MenuItem key="2">2</MenuItem>
      </Menu>
    );

    wrapper.simulate('keyDown', { keyCode: KeyCode.DOWN });
    expect(wrapper.find('MenuItem').at(1).props().active).toBe(true);
  });
});
