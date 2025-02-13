/* eslint-disable no-undef, react/no-multi-comp, react/jsx-curly-brace-presence, max-classes-per-file */
import { fireEvent, render, act } from '@testing-library/react';
import KeyCode from 'rc-util/lib/KeyCode';
import { spyElementPrototypes } from 'rc-util/lib/test/domHook';
import React from 'react';
import Menu from '../src';
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
      <Menu
        mode="inline"
        openKeys={['light']}
        items={[
          {
            key: 'light',
            label: 'Light',
            children: [
              {
                key: 'bamboo',
                label: 'Bamboo',
              },
            ],
          },
        ]}
      />,
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
          <Menu
            items={this.state.items.map(i => ({
              key: i,
              label: i,
            }))}
          />
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
      <Menu
        defaultActiveFirst
        items={[
          {
            key: 'disabled-1',
            label: '',
            disabled: true,
          },
          {
            key: '1',
            label: '1',
          },
          {
            key: 'disabled-2',
            label: '',
            disabled: true,
          },
          {
            key: '2',
            label: '2',
          },
          {
            key: 'disabled-3',
            label: '',
            disabled: true,
          },
        ]}
      />,
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
      <Menu
        items={[
          {
            key: 's1',
            type: 'submenu',
            label: 'submenu1',
            children: [
              {
                key: 's1-1',
                label: '1',
              },
            ],
          },
        ]}
      />,
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
          <Menu
            mode="vertical"
            direction={direction}
            items={[
              {
                key: 'bamboo',
                type: 'submenu',
                label: 'Bamboo',
                children: [
                  {
                    key: 'light',
                    type: 'submenu',
                    label: 'Light',
                    children: [
                      {
                        key: 'little',
                        label: 'Little',
                      },
                    ],
                  },
                ],
              },
            ]}
          />,
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
      <Menu
        mode="inline"
        items={[
          {
            key: 'light',
            label: 'Light',
          },
          {
            key: 'bamboo',
            type: 'submenu',
            label: 'Bamboo',
            children: [
              {
                key: 'little',
                label: 'Little',
              },
            ],
          },
        ]}
      />,
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
      <Menu
        mode="inline"
        items={[
          {
            key: 'light',
            label: 'Light',
          },
          {
            key: 'bamboo',
            label: 'Bamboo',
          },
        ]}
      />,
    );

    keyDown(container, KeyCode.UP);
    isActive(container, 1);
  });

  it('Focus to link direct', () => {
    const { container } = render(
      <Menu
        mode="inline"
        items={[
          {
            key: 'light',
            label: <a href="https://ant.design">Light</a>,
          },
        ]}
      />,
    );

    const focusSpy = jest.spyOn(container.querySelector('a'), 'focus');

    keyDown(container, KeyCode.DOWN);
    expect(focusSpy).toHaveBeenCalled();
  });

  it('no dead loop', async () => {
    const { container } = render(
      <Menu
        mode="vertical"
        openKeys={['bamboo']}
        items={[
          {
            key: 'little',
            label: 'Little',
          },
        ]}
      />,
    );

    keyDown(container, KeyCode.DOWN);
    keyDown(container, KeyCode.LEFT);
    keyDown(container, KeyCode.RIGHT);
    isActive(container, 0);
  });
});
/* eslint-enable */
