/* eslint-disable no-undef */
import { act, fireEvent, render } from '@testing-library/react';
import { spyElementPrototypes } from 'rc-util/lib/test/domHook';
import React from 'react';
import Menu, { MenuRef } from '../src';

// TODO: use userEvent instead of fireEvent for better focus testing
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
        <Menu
          mode="inline"
          openKeys={['s']}
          items={[
            {
              key: 's',
              type: 'submenu',
              label: 'submenu',
              children: [
                {
                  key: '1',
                  label: '1',
                },
              ],
            },
          ]}
        />,
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
        <Menu
          ref={menuRef}
          items={[
            {
              key: 'bamboo',
              type: 'submenu',
              label: 'Disabled',
              disabled: true,
              children: [
                {
                  key: 'bamboo-child',
                  label: 'Disabled child',
                },
              ],
            },
            {
              key: 'light',
              label: 'Light',
              // @ts-ignore
              'data-testid': 'first-focusable',
            },
          ]}
        />,
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
        <Menu
          ref={menuRef}
          activeKey="cat"
          items={[
            {
              key: 'light',
              label: 'Light',
            },
            {
              key: 'cat',
              label: 'Cat',
              // @ts-ignore
              'data-testid': 'active-key',
            },
          ]}
        />,
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
        <Menu
          ref={menuRef}
          items={[
            {
              key: 'group',
              type: 'group',
              label: 'group',
            },
            {
              key: 'bamboo',
              type: 'submenu',
              label: 'Disabled',
              disabled: true,
              children: [
                {
                  key: 'bamboo-child',
                  label: 'Disabled child',
                },
              ],
            },
            {
              key: 'light',
              label: 'Light',
              // @ts-ignore
              'data-testid': 'first-focusable',
            },
          ]}
        />,
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
        <Menu
          ref={menuRef}
          items={[
            {
              key: 'group',
              type: 'group',
              label: 'group',
              children: [
                {
                  key: 'group-child-1',
                  label: 'group-child-1',
                  disabled: true,
                },
                {
                  key: 'group-child-2',
                  label: 'group-child-2',
                  // @ts-ignore
                  'data-testid': 'first-focusable',
                },
              ],
            },
            {
              key: 'light',
              label: 'Light',
            },
          ]}
        />,
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
        <Menu
          ref={menuRef}
          items={[
            {
              key: 'group',
              type: 'group',
              label: 'group',
              children: [
                {
                  key: 'group-child-1',
                  label: 'group-child-1',
                  disabled: true,
                },
                {
                  key: 'nested-group',
                  type: 'group',
                  label: 'nested group',
                  children: [
                    {
                      key: 'nested-group-child-1',
                      label: 'nested-group-child-1',
                      disabled: true,
                    },
                    {
                      key: 'nested-group-child-2',
                      label: 'nested-group-child-2',
                      // @ts-ignore
                      'data-testid': 'first-focusable',
                    },
                  ],
                },
                {
                  key: 'group-child-3',
                  label: 'group-child-3',
                },
              ],
            },
          ]}
        />,
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
        <Menu
          ref={menuRef}
          items={[
            {
              key: 'sub-menu-disabled',
              type: 'submenu',
              label: 'Disabled',
              disabled: true,
              children: [
                {
                  key: 'sub-menu-disabled-child',
                  label: 'Disabled child',
                },
              ],
            },
            {
              key: 'sub-menu',
              type: 'submenu',
              label: 'Submenu',
              // @ts-ignore
              'data-testid': 'sub-menu',
              children: [
                {
                  key: 'sub-menu-child-1',
                  label: 'Submenu child',
                },
              ],
            },
            {
              key: 'light',
              label: 'Light',
            },
          ]}
        />,
      ),
    );

    act(() => menuRef.current.focus());

    expect(document.activeElement).toBe(getByTitle('Submenu'));
    expect(getByTestId('sub-menu')).toHaveClass('rc-menu-submenu-active');
  });
});
/* eslint-enable */
