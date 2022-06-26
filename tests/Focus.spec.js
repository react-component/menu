/* eslint-disable no-undef */
import { act, fireEvent, render } from '@testing-library/react';
import Menu, { MenuItem, SubMenu } from '../src';

describe('Focus', () => {
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

  it('Get focus', () => {
    const { container } = render(
      <Menu mode="inline" openKeys={['s']}>
        <SubMenu key="s" title="submenu">
          <MenuItem key="1">1</MenuItem>
        </SubMenu>
      </Menu>,
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
});
/* eslint-enable */
