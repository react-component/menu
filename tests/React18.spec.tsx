/* eslint-disable no-undef */
import { act, render } from '@testing-library/react';
import React from 'react';
import type { MenuProps } from '../src';
import Menu from '../src';

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
        <Menu
          {...props}
          items={[
            {
              key: 's1',
              label: 'submenu1',
              type: 'submenu',
              children: [
                {
                  key: 's1-1',
                  label: '1',
                },
                {
                  key: 's1-2',
                  label: 'submenu1-1',
                  type: 'submenu',
                  children: [
                    {
                      key: 's1-2-1',
                      label: '2',
                    },
                  ],
                },
              ],
            },
            {
              key: 's2',
              label: 'submenu2',
              type: 'submenu',
              children: [
                {
                  key: 's2-2',
                  label: '2',
                },
              ],
            },
          ]}
        />
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
