/* eslint-disable no-undef, react/no-multi-comp, react/jsx-curly-brace-presence, max-classes-per-file */
import { fireEvent, render } from '@testing-library/react';
import KeyCode from '@rc-component/util/lib/KeyCode';
import { spyElementPrototypes } from '@rc-component/util/lib/test/domHook';
import React from 'react';
import { act } from 'react-dom/test-utils';
import Menu, { MenuItem, SubMenu } from '../src';
import { isActive, last } from './util';

describe('Menu.Keyboard', () => {
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

  it('no data-menu-id by init', () => {
    const { container } = render(
      <Menu mode="inline" openKeys={['light']}>
        <Menu.SubMenu key="light" title="Light">
          <Menu.Item key="bamboo">Bamboo</Menu.Item>
        </Menu.SubMenu>
      </Menu>,
    );

    expect(container.children).toMatchSnapshot();
  });

  it('keydown works when children change', async () => {
    class App extends React.Component {
      state = {
        items: [1, 2, 3],
      };

      render() {
        return (
          <Menu>
            {this.state.items.map(i => (
              <MenuItem key={i}>{i}</MenuItem>
            ))}
          </Menu>
        );
      }
    }

    const { container } = render(<App />);

    // First item
    keyDown(container, KeyCode.DOWN);
    isActive(container, 0);

    // Next item
    keyDown(container, KeyCode.DOWN);
    isActive(container, 1);

    // Very first item
    keyDown(container, KeyCode.HOME);
    isActive(container, 0);

    // Very last item
    keyDown(container, KeyCode.END);
    isActive(container, 2);
  });

  it('Skip disabled item', () => {
    const { container } = render(
      <Menu defaultActiveFirst>
        <MenuItem disabled />
        <MenuItem key="1">1</MenuItem>
        <MenuItem disabled />
        <MenuItem key="2">2</MenuItem>
        <MenuItem disabled />
      </Menu>,
    );

    // Next item
    keyDown(container, KeyCode.DOWN);
    keyDown(container, KeyCode.DOWN);
    isActive(container, 3);

    // Back to first item
    keyDown(container, KeyCode.UP);
    isActive(container, 1);

    // To the last available item
    keyDown(container, KeyCode.END);
    isActive(container, 3);

    // To the first available item
    keyDown(container, KeyCode.HOME);
    isActive(container, 1);
  });

  it('Enter to open menu and active first item', () => {
    const { container } = render(
      <Menu>
        <SubMenu key="s1" title="submenu1">
          <MenuItem key="s1-1">1</MenuItem>
        </SubMenu>
      </Menu>,
    );

    // Active first sub menu
    keyDown(container, KeyCode.DOWN);

    // Open it
    keyDown(container, KeyCode.ENTER);
    act(() => {
      jest.runAllTimers();
    });
    expect(container.querySelector('.rc-menu-submenu-open')).toBeTruthy();
  });

  describe('go to children & back of parent', () => {
    function testDirection(
      direction: 'ltr' | 'rtl',
      subKey: number,
      parentKey: number,
    ) {
      it(`direction ${direction}`, () => {
        const { container, unmount } = render(
          <Menu mode="vertical" direction={direction}>
            <SubMenu key="bamboo" title="Bamboo">
              <SubMenu key="light" title="Light">
                <MenuItem key="little">Little</MenuItem>
              </SubMenu>
            </SubMenu>
          </Menu>,
        );

        // Active first
        keyDown(container, KeyCode.DOWN);

        // Open and active sub
        keyDown(container, subKey);
        expect(container.querySelector('.rc-menu-submenu-open')).toBeTruthy();
        expect(
          last(
            container.querySelectorAll(
              '.rc-menu-submenu-active > .rc-menu-submenu-title',
            ),
          ).textContent,
        ).toEqual('Light');

        // Open and active sub
        keyDown(container, subKey);
        expect(
          container.querySelectorAll('.rc-menu-submenu-open'),
        ).toHaveLength(2);
        expect(
          last(container.querySelectorAll('.rc-menu-item-active')).textContent,
        ).toEqual('Little');

        // Back to parent
        keyDown(container, parentKey);
        expect(
          container.querySelectorAll('.rc-menu-submenu-open'),
        ).toHaveLength(1);
        expect(container.querySelector('.rc-menu-item-active')).toBeFalsy();

        // Back to parent
        keyDown(container, parentKey);
        expect(container.querySelector('.rc-menu-submenu-open')).toBeFalsy();
        expect(
          container.querySelectorAll('.rc-menu-submenu-active'),
        ).toHaveLength(1);

        unmount();
      });
    }

    testDirection('ltr', KeyCode.RIGHT, KeyCode.LEFT);
    testDirection('rtl', KeyCode.LEFT, KeyCode.RIGHT);
  });

  it('inline keyboard', () => {
    const { container } = render(
      <Menu mode="inline">
        <MenuItem key="light">Light</MenuItem>
        <SubMenu key="bamboo" title="Bamboo">
          <MenuItem key="little">Little</MenuItem>
        </SubMenu>
      </Menu>,
    );

    // Nothing happen when no control key
    keyDown(container, KeyCode.P);
    expect(container.querySelector('.rc-menu-item-active')).toBeFalsy();

    // Active first
    keyDown(container, KeyCode.DOWN);
    isActive(container, 0);

    // Active next
    keyDown(container, KeyCode.DOWN);

    // Right will not open
    keyDown(container, KeyCode.RIGHT);
    expect(container.querySelector('.rc-menu-submenu-open')).toBeFalsy();

    // Trigger open
    keyDown(container, KeyCode.ENTER);
    expect(container.querySelector('.rc-menu-submenu-open')).toBeTruthy();
    expect(last(container.querySelectorAll('.rc-menu-submenu'))).toHaveClass(
      'rc-menu-submenu-active',
    );
    isActive(container, 1, false);

    // Active sub item
    keyDown(container, KeyCode.DOWN);
    isActive(container, 1);
  });

  it('Focus last one', () => {
    const { container } = render(
      <Menu mode="inline">
        <MenuItem key="light">Light</MenuItem>
        <MenuItem key="bamboo">Bamboo</MenuItem>
      </Menu>,
    );

    keyDown(container, KeyCode.UP);
    isActive(container, 1);
  });

  it('Focus to link direct', () => {
    const { container } = render(
      <Menu mode="inline">
        <MenuItem key="light">
          <a href="https://ant.design">Light</a>
        </MenuItem>
      </Menu>,
    );

    const focusSpy = jest.spyOn(container.querySelector('a'), 'focus');

    keyDown(container, KeyCode.DOWN);
    expect(focusSpy).toHaveBeenCalled();
  });

  it('no dead loop', async () => {
    const { container } = render(
      <Menu mode="vertical" openKeys={['bamboo']}>
        <MenuItem key="little">Little</MenuItem>
      </Menu>,
    );

    keyDown(container, KeyCode.DOWN);
    keyDown(container, KeyCode.LEFT);
    keyDown(container, KeyCode.RIGHT);
    isActive(container, 0);
  });
});
/* eslint-enable */
