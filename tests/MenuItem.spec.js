/* eslint-disable no-undef */
import React from 'react';
import { mount, shallow } from 'enzyme';
import KeyCode from 'rc-util/lib/KeyCode';
import Menu, { MenuItem, MenuItemGroup, SubMenu } from '../src';

import { MenuItem as NakedMenuItem } from '../src/MenuItem';

describe('MenuItem', () => {
  const subMenuIconText = 'SubMenuIcon';
  const menuItemIconText = 'MenuItemIcon';
  function itemIcon() {
    return <span>{menuItemIconText}</span>;
  }

  function expandIcon() {
    return <span>{subMenuIconText}</span>;
  }

  describe('custom icon', () => {
    it('should render custom arrow icon correctly.', () => {
      const wrapper = mount(
        <Menu mode="vertical" itemIcon={itemIcon} expandIcon={expandIcon}>
          <MenuItem key="1">1</MenuItem>
        </Menu>,
      );
      const menuItemText = wrapper
        .find('.rc-menu-item')
        .first()
        .text();
      expect(menuItemText).toEqual(`1${menuItemIconText}`);
    });

    it('should render custom arrow icon correctly (with children props).', () => {
      const targetText = 'target';
      const wrapper = mount(
        <Menu mode="vertical" itemIcon={itemIcon} expandIcon={expandIcon}>
          <MenuItem key="1" itemIcon={() => <span>{targetText}</span>}>
            1
          </MenuItem>
          <MenuItem key="2">2</MenuItem>
        </Menu>,
      );
      const menuItemText = wrapper
        .find('.rc-menu-item')
        .first()
        .text();
      expect(menuItemText).toEqual(`1${targetText}`);
    });
  });

  describe('disabled', () => {
    it('can not be active by key down', () => {
      const wrapper = mount(
        <Menu activeKey="1">
          <MenuItem key="1">1</MenuItem>
          <MenuItem disabled />
          <MenuItem key="2">2</MenuItem>
        </Menu>,
      );

      wrapper.simulate('keyDown', { keyCode: KeyCode.DOWN });
      expect(
        wrapper
          .find('MenuItem')
          .at(1)
          .props().active,
      ).toBe(false);
    });

    it('not fires select event when selected', () => {
      const handleSelect = jest.fn();
      const wrapper = mount(
        <Menu>
          <MenuItem disabled onSelect={handleSelect}>
            <span className="xx">Item content</span>
          </MenuItem>
        </Menu>,
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
        >
          1
        </NakedMenuItem>,
      );
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

  describe('rest props', () => {
    it('onClick event should only trigger 1 time along the component hierarchy', () => {
      const onClick = jest.fn();
      const restProps = {
        onClick,
        'data-whatever': 'whatever',
        title: 'title',
        className: 'className',
        style: { fontSize: 20 },
      };
      const wrapper = mount(
        <Menu mode="inline" activeKey="1">
          <MenuItem key="1" {...restProps}>
            1
          </MenuItem>
          <SubMenu {...restProps}>
            <MenuItem key="2" {...restProps}>
              3
            </MenuItem>
          </SubMenu>
          <MenuItemGroup {...restProps}>
            <MenuItem key="3" {...restProps}>
              4
            </MenuItem>
          </MenuItemGroup>
        </Menu>,
      );

      expect(wrapper.render()).toMatchSnapshot();
      wrapper
        .find('MenuItem')
        .at(0)
        .simulate('click');
      expect(onClick).toHaveBeenCalledTimes(1);

      wrapper
        .find('SubMenu')
        .at(0)
        .simulate('click');
      expect(onClick).toHaveBeenCalledTimes(1);

      wrapper
        .find('MenuItemGroup')
        .at(0)
        .simulate('click');
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('overwrite default role', () => {
    it('should set role to none if null', () => {
      const wrapper = shallow(<NakedMenuItem role={null}>test</NakedMenuItem>);

      expect(wrapper.render()).toMatchSnapshot();
    });

    it('should set role to none if none', () => {
      const wrapper = shallow(<NakedMenuItem role="none">test</NakedMenuItem>);

      expect(wrapper.render()).toMatchSnapshot();
    });

    it('should set role to listitem', () => {
      const wrapper = shallow(
        <NakedMenuItem role="listitem">test</NakedMenuItem>,
      );

      expect(wrapper.render()).toMatchSnapshot();
    });

    it('should set role to option', () => {
      const wrapper = shallow(
        <NakedMenuItem role="option">test</NakedMenuItem>,
      );

      expect(wrapper.render()).toMatchSnapshot();
    });
  });
});
