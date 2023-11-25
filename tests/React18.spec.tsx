/* eslint-disable no-undef */
import { act, render } from '@testing-library/react';
import React from 'react';
import type { MenuProps } from '../src';
import Menu, { MenuItem, SubMenu } from '../src';

describe('React18', () => {
  function runAllTimer() {
    for (let i = 0; i < 10; i += 1) {
      act(() => {
        jest.runAllTimers();
      });
    }
  }

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  function createMenu(props?: MenuProps) {
    return (
      <React.StrictMode>
        <Menu {...props}>
          <SubMenu key="s1" title="submenu1">
            <MenuItem key="s1-1">1</MenuItem>
            <SubMenu key="s1-2" title="submenu1-1">
              <MenuItem key="s1-2-1">2</MenuItem>
            </SubMenu>
          </SubMenu>
          <SubMenu key="s2" title="submenu2">
            <MenuItem key="s2-2">2</MenuItem>
          </SubMenu>
        </Menu>
      </React.StrictMode>
    );
  }

  it("don't show submenu when disabled", () => {
    const { container } = render(
      createMenu({
        defaultOpenKeys: ['s1'],
        mode: 'horizontal',
      }),
    );

    runAllTimer();

    expect(
      container
        .querySelector('.rc-menu-submenu-open')
        .querySelector('.rc-menu-submenu-title').textContent,
    ).toEqual('submenu1');
  });
});
/* eslint-enable */
