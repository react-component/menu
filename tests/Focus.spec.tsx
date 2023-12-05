/* eslint-disable no-undef */
import { act, fireEvent, render } from '@testing-library/react';
import { spyElementPrototypes } from 'rc-util/lib/test/domHook';
import React from 'react';
import type { MenuRef } from '../src';
import Menu, { MenuItem, MenuItemGroup, SubMenu } from '../src';

describe('Focus', () => {
  beforeAll(() => {
    // Mock to force make menu item visible
    spyElementPrototypes(HTMLElement, {
      offsetParent: {
        get() {
          return this.parentElement;
        },
      },
    });
  });

  beforeEach(() => {
    global.triggerProps = null;
    global.popupTriggerProps = null;
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('Get focus', async () => {
    const { container } = await act(async () =>
      render(
        <Menu mode="inline" openKeys={['s']}>
          <SubMenu key="s" title="submenu">
            <MenuItem key="1">1</MenuItem>
          </SubMenu>
        </Menu>,
      ),
    );

    // Item focus
    fireEvent.focus(container.querySelector('.rc-menu-item'));
    expect(container.querySelector('.rc-menu-item')).toHaveClass(
      'rc-menu-item-active',
    );

    // Submenu focus
    fireEvent.focus(container.querySelector('.rc-menu-submenu-title'));
    expect(container.querySelector('.rc-menu-submenu-active')).toBeTruthy();
  });

  it('should support focus through ref', async () => {
    const menuRef = React.createRef<MenuRef>();
    const { getByTestId } = await act(async () =>
      render(
        <Menu ref={menuRef}>
          <SubMenu key="bamboo" title="Disabled" disabled>
            <MenuItem key="bamboo-child">Disabled child</MenuItem>
          </SubMenu>
          <MenuItem key="light" data-testid="first-focusable">
            Light
          </MenuItem>
        </Menu>,
      ),
    );

    act(() => menuRef.current.focus());

    const firstFocusableItem = getByTestId('first-focusable');
    expect(document.activeElement).toBe(firstFocusableItem);
    expect(firstFocusableItem).toHaveClass('rc-menu-item-active');
  });

  it('should focus active item through ref', async () => {
    const menuRef = React.createRef<MenuRef>();
    const { getByTestId } = await act(async () =>
      render(
        <Menu ref={menuRef} activeKey="cat">
          <MenuItem key="light">Light</MenuItem>
          <MenuItem key="cat" data-testid="active-key">
            Cat
          </MenuItem>
        </Menu>,
      ),
    );
    act(() => menuRef.current.focus());

    const activeKey = getByTestId('active-key');
    expect(document.activeElement).toBe(activeKey);
    expect(activeKey).toHaveClass('rc-menu-item-active');
  });

  it('should focus active item through ref without activeKey', async () => {
    const menuRef = React.createRef<MenuRef>();
    const { container } = await act(async () =>
      render(
        <Menu ref={menuRef}>
          <MenuItem key="light">Light</MenuItem>
          <MenuItem key="Cat">Cat</MenuItem>
        </Menu>,
      ),
    );

    act(() => menuRef.current.focus());

    // first li
    const activeLi = container.querySelector('li');
    expect(document.activeElement).toBe(activeLi);
    expect(activeLi).toHaveClass('rc-menu-item-active');
  });

  it('focus moves to the next accessible menu item if the first child is empty group', async () => {
    const menuRef = React.createRef<MenuRef>();
    const { getByTestId } = await act(async () =>
      render(
        <Menu ref={menuRef}>
          <MenuItemGroup title="group" key="group" />
          <SubMenu key="bamboo" title="Disabled" disabled>
            <MenuItem key="bamboo-child">Disabled child</MenuItem>
          </SubMenu>
          <MenuItem key="light" data-testid="first-focusable">
            Light
          </MenuItem>
        </Menu>,
      ),
    );

    act(() => menuRef.current.focus());

    const firstFocusableItem = getByTestId('first-focusable');
    expect(document.activeElement).toBe(firstFocusableItem);
    expect(firstFocusableItem).toHaveClass('rc-menu-item-active');
  });

  it('focus moves to the next accessible group item if the first child is non-empty group', async () => {
    const menuRef = React.createRef<MenuRef>();
    const { getByTestId } = await act(async () =>
      render(
        <Menu ref={menuRef}>
          <MenuItemGroup title="group" key="group">
            <MenuItem key="group-child-1" disabled>
              group-child-1
            </MenuItem>
            <MenuItem key="group-child-2" data-testid="first-focusable">
              group-child-2
            </MenuItem>
          </MenuItemGroup>
          <MenuItem key="light">Light</MenuItem>
        </Menu>,
      ),
    );

    act(() => menuRef.current.focus());

    const firstFocusableItem = getByTestId('first-focusable');
    expect(document.activeElement).toBe(firstFocusableItem);
    expect(firstFocusableItem).toHaveClass('rc-menu-item-active');
  });

  it('focus moves to nested group item correctly', async () => {
    const menuRef = React.createRef<MenuRef>();
    const { getByTestId } = await act(async () =>
      render(
        <Menu ref={menuRef}>
          <MenuItemGroup title="group" key="group">
            <MenuItem key="group-child-1" disabled>
              group-child-1
            </MenuItem>
            <MenuItemGroup title="nested group" key="nested-group">
              <MenuItem key="nested-group-child-1" disabled>
                nested-group-child-1
              </MenuItem>
              <MenuItem
                key="nested-group-child-2"
                data-testid="first-focusable"
              >
                nested-group-child-2
              </MenuItem>
            </MenuItemGroup>
            <MenuItem key="group-child-3">group-child-3</MenuItem>
          </MenuItemGroup>
        </Menu>,
      ),
    );

    act(() => menuRef.current.focus());

    const firstFocusableItem = getByTestId('first-focusable');
    expect(document.activeElement).toBe(firstFocusableItem);
    expect(firstFocusableItem).toHaveClass('rc-menu-item-active');
  });

  it('focus moves to submenu correctly', async () => {
    const menuRef = React.createRef<MenuRef>();
    const { getByTestId, getByTitle } = await act(async () =>
      render(
        <Menu ref={menuRef}>
          <SubMenu key="sub-menu-disabled" title="Disabled" disabled>
            <MenuItem key="sub-menu-disabled-child">Disabled child</MenuItem>
          </SubMenu>
          <SubMenu key="sub-menu" data-testid="sub-menu" title="Submenu">
            <MenuItem key="sub-menu-child-1">Submenu child</MenuItem>
          </SubMenu>
          <MenuItem key="light">Light</MenuItem>
        </Menu>,
      ),
    );

    act(() => menuRef.current.focus());

    expect(document.activeElement).toBe(getByTitle('Submenu'));
    expect(getByTestId('sub-menu')).toHaveClass('rc-menu-submenu-active');
  });
});
/* eslint-enable */
