/* eslint-disable no-undef, react/no-multi-comp, react/jsx-curly-brace-presence */
import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import Menu, { MenuItem, SubMenu } from '../src';

describe('Menu.Collapsed', () => {
  describe('inlineCollapse and siderCollapsed', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should always follow openKeys when mode is switched', () => {
      const wrapper = mount(
        <Menu openKeys={['1']} mode="inline">
          <SubMenu key="1" title="submenu1">
            <MenuItem key="submenu1">Option 1</MenuItem>
            <MenuItem key="submenu2">Option 2</MenuItem>
          </SubMenu>
          <MenuItem key="2">menu2</MenuItem>
        </Menu>,
      );
      expect(
        wrapper
          .find('ul.rc-menu-sub')
          .at(0)
          .hasClass('rc-menu-hidden'),
      ).toBe(false);
      wrapper.setProps({ mode: 'vertical' });
      expect(
        wrapper
          .find('ul.rc-menu-sub')
          .at(0)
          .hasClass('rc-menu-hidden'),
      ).toBe(false);
      wrapper.setProps({ mode: 'inline' });
      expect(
        wrapper
          .find('ul.rc-menu-sub')
          .at(0)
          .hasClass('rc-menu-hidden'),
      ).toBe(false);
    });

    it('should always follow openKeys when inlineCollapsed is switched', () => {
      const wrapper = mount(
        <Menu defaultOpenKeys={['1']} mode="inline">
          <MenuItem key="menu1">
            <span>Option</span>
          </MenuItem>
          <SubMenu key="1" title="submenu1">
            <MenuItem key="submenu1">Option</MenuItem>
            <MenuItem key="submenu2">Option</MenuItem>
          </SubMenu>
        </Menu>,
      );
      expect(
        wrapper
          .find('ul.rc-menu-sub')
          .at(0)
          .hasClass('rc-menu-inline'),
      ).toBe(true);
      expect(
        wrapper
          .find('ul.rc-menu-sub')
          .at(0)
          .hasClass('rc-menu-hidden'),
      ).toBe(false);

      wrapper.setProps({ inlineCollapsed: true });
      // 动画结束后套样式;
      jest.runAllTimers();
      wrapper.update();
      wrapper.simulate('transitionEnd', { propertyName: 'width' });

      // Flush SubMenu raf state update
      act(() => {
        jest.runAllTimers();
        wrapper.update();
      });

      expect(
        wrapper
          .find('ul.rc-menu-root')
          .at(0)
          .hasClass('rc-menu-vertical'),
      ).toBe(true);
      expect(wrapper.find('ul.rc-menu-sub').length).toBe(0);

      wrapper.setProps({ inlineCollapsed: false });
      jest.runAllTimers();
      wrapper.update();

      expect(
        wrapper
          .find('ul.rc-menu-sub')
          .at(0)
          .hasClass('rc-menu-inline'),
      ).toBe(true);
      expect(
        wrapper
          .find('ul.rc-menu-sub')
          .at(0)
          .hasClass('rc-menu-hidden'),
      ).toBe(false);
    });

    it('inlineCollapsed should works well when specify a not existed default openKeys', () => {
      const wrapper = mount(
        <Menu defaultOpenKeys={['not-existed']} mode="inline">
          <MenuItem key="menu1">
            <span>Option</span>
          </MenuItem>
          <SubMenu key="1" title="submenu1">
            <MenuItem key="submenu1">Option</MenuItem>
            <MenuItem key="submenu2">Option</MenuItem>
          </SubMenu>
        </Menu>,
      );
      expect(wrapper.find('.rc-menu-sub').length).toBe(0);

      // Do collapsed
      wrapper.setProps({ inlineCollapsed: true });

      jest.runAllTimers();
      wrapper.update();

      wrapper.simulate('transitionEnd', { propertyName: 'width' });

      // Wait internal raf work
      act(() => {
        jest.runAllTimers();
        wrapper.update();
      });

      // Hover to show
      wrapper
        .find('.rc-menu-submenu-title')
        .at(0)
        .simulate('mouseEnter');

      jest.runAllTimers();
      wrapper.update();

      expect(
        wrapper
          .find('.rc-menu-submenu')
          .at(0)
          .hasClass('rc-menu-submenu-vertical'),
      ).toBe(true);
      expect(
        wrapper
          .find('.rc-menu-submenu')
          .at(0)
          .hasClass('rc-menu-submenu-open'),
      ).toBe(true);
      expect(
        wrapper
          .find('ul.rc-menu-sub')
          .at(0)
          .hasClass('rc-menu-vertical'),
      ).toBe(true);
      expect(
        wrapper
          .find('ul.rc-menu-sub')
          .at(0)
          .hasClass('rc-menu-hidden'),
      ).toBe(false);
    });

    it('inlineCollapsed MenuItem Tooltip can be removed', () => {
      const wrapper = mount(
        <Menu
          defaultOpenKeys={['not-existed']}
          mode="inline"
          inlineCollapsed
          getPopupContainer={node => node.parentNode}
        >
          <MenuItem key="menu1">item</MenuItem>
          <MenuItem key="menu2" title="title">
            item
          </MenuItem>
          <MenuItem key="menu3" title={undefined}>
            item
          </MenuItem>
          <MenuItem key="menu4" title={null}>
            item
          </MenuItem>
          <MenuItem key="menu5" title="">
            item
          </MenuItem>
          <MenuItem key="menu6" title={false}>
            item
          </MenuItem>
        </Menu>,
      );
      expect(
        wrapper
          .find(MenuItem)
          .at(0)
          .getDOMNode().title,
      ).toBe('');
      expect(
        wrapper
          .find(MenuItem)
          .at(1)
          .getDOMNode().title,
      ).toBe('title');
      expect(
        wrapper
          .find(MenuItem)
          .at(2)
          .getDOMNode().title,
      ).toBe('');
      expect(
        wrapper
          .find(MenuItem)
          .at(3)
          .getDOMNode().title,
      ).toBe('');
      expect(
        wrapper
          .find(MenuItem)
          .at(4)
          .getDOMNode().title,
      ).toBe('');
      expect(
        wrapper
          .find(MenuItem)
          .at(4)
          .getDOMNode().title,
      ).toBe('');
    });

    it('should use siderCollapsed when siderCollapsed is passed', () => {
      const wrapper = mount(
        <Menu
          openKeys={['1']}
          mode="inline"
          inlineCollapsed
          siderCollapsed={false}
        >
          <SubMenu key="1" title="submenu1">
            <MenuItem key="submenu1">Option 1</MenuItem>
            <MenuItem key="submenu2">Option 2</MenuItem>
          </SubMenu>
          <MenuItem key="2">menu2</MenuItem>
        </Menu>,
      );
      expect(wrapper.instance().getInlineCollapsed()).toBe(false);
    });

    // https://github.com/ant-design/ant-design/issues/18825
    // https://github.com/ant-design/ant-design/issues/8587
    it('should keep selectedKeys in state when collapsed to 0px', () => {
      const wrapper = mount(
        <Menu
          mode="inline"
          inlineCollapsed={false}
          defaultSelectedKeys={['1']}
          collapsedWidth={0}
          openKeys={['3']}
        >
          <MenuItem key="1">Option 1</MenuItem>
          <MenuItem key="2">Option 2</MenuItem>
          <SubMenu key="3" title="Option 3">
            <MenuItem key="4">Option 4</MenuItem>
          </SubMenu>
        </Menu>,
      );
      expect(
        wrapper.find('.rc-menu-item-selected').getDOMNode().textContent,
      ).toBe('Option 1');
      wrapper
        .find('.rc-menu-item')
        .at(1)
        .simulate('click');
      expect(
        wrapper.find('.rc-menu-item-selected').getDOMNode().textContent,
      ).toBe('Option 2');
      wrapper.setProps({ inlineCollapsed: true });
      jest.runAllTimers();
      wrapper.update();
      expect(
        wrapper
          .find('Trigger')
          .map(node => node.prop('popupVisible'))
          .findIndex(node => !!node),
      ).toBe(-1);
      wrapper.setProps({ inlineCollapsed: false });
      expect(
        wrapper.find('.rc-menu-item-selected').getDOMNode().textContent,
      ).toBe('Option 2');
    });

    it('should hideMenu in initial state  when collapsed to 0px', () => {
      const wrapper = mount(
        <Menu
          mode="inline"
          inlineCollapsed
          defaultSelectedKeys={['1']}
          collapsedWidth={0}
          openKeys={['3']}
        >
          <MenuItem key="1">Option 1</MenuItem>
          <MenuItem key="2">Option 2</MenuItem>
          <SubMenu key="3" title="Option 3">
            <MenuItem key="4">Option 4</MenuItem>
          </SubMenu>
        </Menu>,
      );
      expect(
        wrapper
          .find('Trigger')
          .map(node => node.prop('popupVisible'))
          .findIndex(node => !!node),
      ).toBe(-1);
      wrapper.setProps({ inlineCollapsed: false });
      jest.runAllTimers();
      wrapper.update();
      expect(
        wrapper.find('.rc-menu-item-selected').getDOMNode().textContent,
      ).toBe('Option 1');
    });
  });
});
/* eslint-enable */
