/* eslint-disable no-undef */
import { act, fireEvent, render } from '@testing-library/react';
import { spyElementPrototypes } from '@rc-component/util/lib/test/domHook';
import KeyCode from '@rc-component/util/lib/KeyCode';
import React from 'react';
import Menu, { MenuItem, MenuItemGroup, MenuRef, SubMenu } from '../src';
import { isActive } from './util';

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

  function keyDown(container: HTMLElement, keyCode: number) {
    fireEvent.keyDown(container.querySelector('ul.rc-menu-root'), {
      which: keyCode,
      keyCode,
      charCode: keyCode,
    });

    // SubMenu raf need slow than accessibility
    for (let i = 0; i < 20; i += 1) {
      act(() => {
        jest.advanceTimersByTime(10);
      });
    }
    act(() => {
      jest.runAllTimers();
    });
  }

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
    expect(container.querySelector('.rc-menu-item')).toHaveClass('rc-menu-item-active');

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
              <MenuItem key="nested-group-child-2" data-testid="first-focusable">
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

  it('When selectable is not configured, the focus should move to the first available item instead of keeping the previously focused item', async () => {
    const menuRef = React.createRef<MenuRef>();
    const items = [
      { key: '0', label: 'First Item' },
      { key: '1', label: 'Second Item' },
      { key: '2', label: 'Third Item' },
    ];
    const TestApp = () => {
      return (
        <div>
          <Menu data-testid="menu" selectable={false} ref={menuRef}>
            {items.map(item => (
              <MenuItem key={item.key} data-testid={item.key}>
                {item.label}
              </MenuItem>
            ))}
          </Menu>
        </div>
      );
    };
    const { getByTestId, container } = render(<TestApp />);
    // ================ check keydown ==============
    // first item
    keyDown(container, KeyCode.DOWN);
    isActive(container, 0);
    // second item
    keyDown(container, KeyCode.DOWN);
    isActive(container, 1);
    // select second item
    keyDown(container, KeyCode.ENTER);

    // mock focus on item 0 to make sure it gets focused
    const item0 = getByTestId('0');
    const focusSpy = jest.spyOn(item0, 'focus').mockImplementation(() => {});
    menuRef.current.focus();
    expect(focusSpy).toHaveBeenCalled();

    // ================ check click ==============
    // click third item
    const item2 = getByTestId('2');
    fireEvent.click(item2);
    menuRef.current.focus();
    expect(focusSpy).toHaveBeenCalled();
    // cleanup
    focusSpy.mockRestore();
  });
  it('When selectable is configured, the focus should move to the selected item if there is a selection, else to the first item, not retain on last focused item', async () => {
    const menuRef = React.createRef<MenuRef>();
    const items = [
      { key: '0', label: 'First Item' },
      { key: '1', label: 'Second Item' },
      { key: '2', label: 'Third Item' },
    ];
    const TestApp = () => {
      return (
        <div>
          <Menu data-testid="menu" selectable ref={menuRef}>
            {items.map(item => (
              <MenuItem key={item.key} data-testid={item.key}>
                {item.label}
              </MenuItem>
            ))}
          </Menu>
        </div>
      );
    };
    const { getByTestId, container } = render(<TestApp />);
    // ================ check keydown ==============
    // first item
    keyDown(container, KeyCode.DOWN);
    isActive(container, 0);
    // second item
    keyDown(container, KeyCode.DOWN);
    isActive(container, 1);
    // select second item
    keyDown(container, KeyCode.ENTER);
    // mock focus on item 1 to make sure it gets focused
    const item1 = getByTestId('1');
    const focusSpy = jest.spyOn(item1, 'focus').mockImplementation(() => {});
    menuRef.current.focus();
    expect(focusSpy).toHaveBeenCalled();

    // ================ check click ==============
    // click third item
    const item2 = getByTestId('2');
    fireEvent.click(item2);
    menuRef.current.focus();
    // mock focus on item 2 to make sure it gets focused
    expect(focusSpy).toHaveBeenCalled();
    // cleanup
    focusSpy.mockRestore();
  });
});
/* eslint-enable */
