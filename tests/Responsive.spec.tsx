/* eslint-disable no-undef, react/no-multi-comp, react/jsx-curly-brace-presence, max-classes-per-file */
import { fireEvent, render } from '@testing-library/react';
import { _rs as onResize } from 'rc-resize-observer/lib/utils/observerUtil';
import KeyCode from 'rc-util/lib/KeyCode';
import { act } from 'react-dom/test-utils';
import Menu, { MenuItem, SubMenu } from '../src';
import { OVERFLOW_KEY } from '../src/hooks/useKeyRecords';

describe('Menu.Responsive', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('ssr render full', () => {
    const { container } = render(
      <Menu mode="horizontal">
        <MenuItem key="light">Light</MenuItem>
        <SubMenu key="bamboo">Bamboo</SubMenu>
        <MenuItem key="little">Little</MenuItem>
      </Menu>,
    );

    expect(container.children).toMatchSnapshot();
  });

  it('show rest', () => {
    const onOpenChange = jest.fn();
    const genMenu = (props?: any) => (
      <Menu
        mode="horizontal"
        activeKey="little"
        onOpenChange={onOpenChange}
        {...props}
      >
        <MenuItem key="light">Light</MenuItem>
        <MenuItem key="bamboo">Bamboo</MenuItem>
        <SubMenu key="home" title="Home">
          <MenuItem key="little">Little</MenuItem>
        </SubMenu>
      </Menu>
    );
    const { container, rerender } = render(genMenu());

    act(() => {
      jest.runAllTimers();
    });

    // Set container width
    act(() => {
      onResize([
        {
          target: container.querySelector('.rc-menu-overflow'),
        } as any,
      ]);
    });
    act(() => {
      jest.runAllTimers();
    });

    // Resize every item
    container.querySelectorAll('.rc-menu-item').forEach(item => {
      act(() => {
        onResize([
          {
            target: item,
          } as any,
        ]);
      });
    });
    act(() => {
      jest.runAllTimers();
    });

    // Should show the rest icon
    expect(
      container.querySelector<HTMLElement>('.rc-menu-overflow-item-rest').style
        .opacity,
    ).not.toEqual(0);

    // Should set active on rest
    expect(
      container.querySelector<HTMLElement>('.rc-menu-overflow-item-rest'),
    ).toHaveClass('rc-menu-submenu-active');

    // Key down can open
    expect(onOpenChange).not.toHaveBeenCalled();
    rerender(genMenu({ activeKey: OVERFLOW_KEY }));
    fireEvent.keyDown(container.querySelector<HTMLElement>('.rc-menu-root'), {
      which: KeyCode.DOWN,
      keyCode: KeyCode.DOWN,
    });
    expect(onOpenChange).toHaveBeenCalled();
  });
});
/* eslint-enable */
