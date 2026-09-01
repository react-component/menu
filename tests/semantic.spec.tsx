/* eslint-disable no-undef */
import { act, fireEvent, render } from '@testing-library/react';
import React from 'react';
import Menu, { MenuItem, MenuItemGroup, SubMenu } from '../src';
describe('semantic', () => {
  function runAllTimer() {
    for (let i = 0; i < 10; i += 1) {
      act(() => {
        jest.runAllTimers();
      });
    }
  }
  beforeEach(() => {
    global.triggerProps = null;
    global.popupTriggerProps = null;
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('support classNames and styles for subMenu', () => {
    const testClassNames = {
      list: 'test-list',
      listTitle: 'test-list-title',
    };
    const testStyles = {
      list: { color: 'red' },
      listTitle: { color: 'blue' },
    };
    const { container } = render(
      <Menu openKeys={['s1']}>
        <SubMenu key="s1" title="submenu1" classNames={testClassNames} styles={testStyles}>
          <MenuItemGroup title="group 1" key="2">
            <MenuItem key="s1-1">1</MenuItem>
          </MenuItemGroup>
        </SubMenu>
      </Menu>,
    );
    fireEvent.mouseEnter(container.querySelector('.rc-menu-submenu-title'));
    runAllTimer();
    const list = container.querySelector('.rc-menu-item-group-list');
    const listTitle = container.querySelector('.rc-menu-item-group-title');
    expect(list).toHaveClass(testClassNames.list);
    expect(list).toHaveStyle(testStyles.list);
    expect(listTitle).toHaveClass(testClassNames.listTitle);
    expect(listTitle).toHaveStyle(testStyles.listTitle);
  });
  it('support classNames and styles for SubMenu self node (subItem / subItemTitle)', () => {
    const testClassNames = {
      subItem: 'test-sub-item',
      subItemTitle: 'test-sub-item-title',
    };
    const testStyles = {
      subItem: { width: '200px' },
      subItemTitle: { whiteSpace: 'normal' },
    };
    const { container } = render(
      <Menu mode="inline" openKeys={['s1', 's1-2']}>
        <SubMenu key="s1" title="submenu1" classNames={testClassNames} styles={testStyles}>
          <SubMenu key="s1-2" title="submenu1-1" classNames={testClassNames} styles={testStyles}>
            <MenuItem key="s1-2-1">2-1</MenuItem>
          </SubMenu>
        </SubMenu>
      </Menu>,
    );

    const subItem = container.querySelector('.rc-menu-submenu');
    const subItemTitle = container.querySelector('.rc-menu-submenu-title');
    expect(subItem).toHaveClass(testClassNames.subItem);
    expect(subItem).toHaveStyle(testStyles.subItem);
    expect(subItemTitle).toHaveClass(testClassNames.subItemTitle);
    expect(subItemTitle).toHaveStyle(testStyles.subItemTitle);

    const nestedSubItem = container.querySelector('.rc-menu-submenu .rc-menu-submenu');
    const nestedSubItemTitle = nestedSubItem.querySelector('.rc-menu-submenu-title');
    expect(nestedSubItem).toHaveClass(testClassNames.subItem);
    expect(nestedSubItem).toHaveStyle(testStyles.subItem);
    expect(nestedSubItemTitle).toHaveClass(testClassNames.subItemTitle);
    expect(nestedSubItemTitle).toHaveStyle(testStyles.subItemTitle);
  });
  it('support classNames and styles for Menu', () => {
    const testClassNames = {
      list: 'test-list',
      listTitle: 'test-list-title',
    };
    const testStyles = {
      list: { color: 'red' },
      listTitle: { color: 'blue' },
    };
    const { container } = render(
      <Menu onClick={() => console.log('click')} classNames={testClassNames} styles={testStyles}>
        <MenuItemGroup title="group 1" key="2">
          <MenuItem key="21">2</MenuItem>
          <MenuItem key="22">3</MenuItem>
        </MenuItemGroup>
        <MenuItemGroup title="group 2" key="3">
          <MenuItem key="31">4</MenuItem>
          <MenuItem key="32">5</MenuItem>
        </MenuItemGroup>
      </Menu>,
    );
    const list = container.querySelector('.rc-menu-item-group-list');
    const listTitle = container.querySelector('.rc-menu-item-group-title');
    expect(list).toHaveClass(testClassNames.list);
    expect(list).toHaveStyle(testStyles.list);
    expect(listTitle).toHaveClass(testClassNames.listTitle);
    expect(listTitle).toHaveStyle(testStyles.listTitle);
  });
});
