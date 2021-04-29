/* eslint-disable no-undef */
import React from 'react';
import { mount } from 'enzyme';
import KeyCode from 'rc-util/lib/KeyCode';
import Menu, { MenuItem, MenuItemGroup, SubMenu } from '../src';

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
      const menuItemText = wrapper.find('.rc-menu-item').first().text();
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
      const menuItemText = wrapper.find('.rc-menu-item').first().text();
      expect(menuItemText).toEqual(`1${targetText}`);
    });
  });

  it('not fires select event when disabled', () => {
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

  describe('menuItem events', () => {
    function mountMenu(props, itemProps) {
      return mount(
        <Menu {...props}>
          <MenuItem key="light" {...itemProps} />
        </Menu>,
      );
    }

    it('on enter key down should trigger onClick', () => {
      const onItemClick = jest.fn();
      const wrapper = mountMenu(null, { onClick: onItemClick });
      wrapper.findItem().simulate('keyDown', { which: KeyCode.ENTER });
      expect(onItemClick).toHaveBeenCalledWith(
        expect.objectContaining({ domEvent: expect.anything() }),
      );
    });

    it('on mouse enter should trigger onMouseEnter', () => {
      const onItemMouseEnter = jest.fn();
      const wrapper = mountMenu(null, { onMouseEnter: onItemMouseEnter });
      wrapper.findItem().simulate('mouseEnter', { which: KeyCode.ENTER });
      expect(onItemMouseEnter).toHaveBeenCalledWith(
        expect.objectContaining({ key: 'light', domEvent: expect.anything() }),
      );
    });

    it('on mouse leave should trigger onMouseLeave', () => {
      const onItemMouseLeave = jest.fn();
      const wrapper = mountMenu(null, { onMouseLeave: onItemMouseLeave });
      wrapper.findItem().simulate('mouseLeave', { which: KeyCode.ENTER });
      expect(onItemMouseLeave).toHaveBeenCalledWith(
        expect.objectContaining({ key: 'light', domEvent: expect.anything() }),
      );
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
        <Menu mode="inline" activeKey="1" openKeys={['bamboo']}>
          <MenuItem key="1" {...restProps}>
            1
          </MenuItem>
          <SubMenu key="bamboo" {...restProps}>
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

      wrapper.findItem().simulate('click');
      expect(onClick).toHaveBeenCalledTimes(1);

      wrapper.find('.rc-menu-sub').simulate('click');
      expect(onClick).toHaveBeenCalledTimes(1);

      wrapper.find('.rc-menu-item-group').simulate('click');
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('overwrite default role', () => {
    it('should set role to none if null', () => {
      const wrapper = mount(
        <Menu>
          <MenuItem role={null}>test</MenuItem>
        </Menu>,
      );

      expect(wrapper.find('li').render()).toMatchSnapshot();
    });

    it('should set role to none if none', () => {
      const wrapper = mount(
        <Menu>
          <MenuItem role="none">test</MenuItem>
        </Menu>,
      );

      expect(wrapper.find('li').render()).toMatchSnapshot();
    });

    it('should set role to listitem', () => {
      const wrapper = mount(
        <Menu>
          <MenuItem role="listitem">test</MenuItem>
        </Menu>,
      );

      expect(wrapper.find('li').render()).toMatchSnapshot();
    });

    it('should set role to option', () => {
      const wrapper = mount(
        <Menu>
          <MenuItem role="option">test</MenuItem>
        </Menu>,
      );

      expect(wrapper.find('li').render()).toMatchSnapshot();
    });
  });
});
