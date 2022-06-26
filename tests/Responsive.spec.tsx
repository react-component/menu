/* eslint-disable no-undef, react/no-multi-comp, react/jsx-curly-brace-presence, max-classes-per-file */
import { fireEvent, render } from '@testing-library/react';
import KeyCode from 'rc-util/lib/KeyCode';
import { act } from 'react-dom/test-utils';
import Menu, { MenuItem, SubMenu } from '../src';
import { OVERFLOW_KEY } from '../src/hooks/useKeyRecords';
import { last } from './util';

jest.mock('rc-resize-observer', () => {
  const React = require('react');
  let ResizeObserver = jest.requireActual('rc-resize-observer');
  ResizeObserver = ResizeObserver.default || ResizeObserver;

  let guid = 0;

  return React.forwardRef((props, ref) => {
    const [id] = React.useState(() => {
      guid += 1;
      return guid;
    });

    global.resizeProps = global.resizeProps || new Map<number, any>();
    global.resizeProps.set(id, props);

    return React.createElement(ResizeObserver, { ref, ...props });
  });
});

describe('Menu.Responsive', () => {
  beforeEach(() => {
    global.resizeProps = null;
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  function getResizeProps(): any[] {
    return Array.from(global.resizeProps!.values());
  }

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
      getResizeProps()[0].onResize({} as any, { clientWidth: 41 } as any);
      jest.runAllTimers();
    });

    // Resize every item
    getResizeProps()
      .slice(1)
      .forEach(props => {
        act(() => {
          props.onResize({ offsetWidth: 20 } as any, null);
          jest.runAllTimers();
        });
      });

    // Should show the rest icon
    expect(
      last(container.querySelectorAll('.rc-menu-overflow-item-rest')),
    ).not.toHaveStyle({
      opacity: '0',
    });

    // Should set active on rest
    expect(
      last(container.querySelectorAll('.rc-menu-overflow-item-rest')),
    ).toHaveClass('rc-menu-submenu-active');

    // Key down can open
    expect(onOpenChange).not.toHaveBeenCalled();
    rerender(genMenu({ activeKey: OVERFLOW_KEY }));
    act(() => {
      jest.runAllTimers();
    });

    fireEvent.keyDown(container.querySelector('ul.rc-menu-root'), {
      which: KeyCode.DOWN,
      keyCode: KeyCode.DOWN,
      charCode: KeyCode.DOWN,
    });

    expect(onOpenChange).toHaveBeenCalled();
  });
});
/* eslint-enable */
