/* eslint-disable no-undef, react/no-multi-comp, react/jsx-curly-brace-presence, max-classes-per-file */
import React from 'react';
import { act } from 'react-dom/test-utils';
import KeyCode from 'rc-util/lib/KeyCode';
import { spyElementPrototypes } from 'rc-util/lib/test/domHook';
import { render } from 'enzyme';
import ResizeObserver from 'rc-resize-observer';
import { mount, keyDown } from './util';
import Menu, { MenuItem, SubMenu } from '../src';

describe('Menu.Responsive', () => {
  let holder: HTMLDivElement;

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
    holder = document.createElement('div');
    document.body.appendChild(holder);
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    holder.parentElement.removeChild(holder);
  });

  it('ssr render full', () => {
    const wrapper = render(
      <Menu mode="horizontal">
        <MenuItem key="light">Light</MenuItem>
        <SubMenu key="bamboo">Bamboo</SubMenu>
        <MenuItem key="little">Little</MenuItem>
      </Menu>,
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('show rest', () => {
    const onOpenChange = jest.fn();
    const wrapper = mount(
      <Menu mode="horizontal" onOpenChange={onOpenChange}>
        <MenuItem key="light">Light</MenuItem>
        <MenuItem key="bamboo">Bamboo</MenuItem>
        <SubMenu key="home" title="Home">
          <MenuItem key="little">Little</MenuItem>
        </SubMenu>
      </Menu>,
      { attachTo: holder },
    );

    act(() => {
      jest.runAllTimers();
      wrapper.update();
    });

    // Set container width
    act(() => {
      wrapper
        .find(ResizeObserver)
        .first()
        .props()
        .onResize({} as any, { clientWidth: 41 } as any);
      jest.runAllTimers();
      wrapper.update();
    });

    // Resize every item
    wrapper.find('Item').forEach(item => {
      act(() => {
        item
          .find(ResizeObserver)
          .props()
          .onResize({ offsetWidth: 20, width: 20 } as any, {} as any);
        jest.runAllTimers();
        wrapper.update();
      });
    });

    // Should show the rest icon
    expect(
      wrapper.find('.rc-menu-overflow-item-rest').last().prop('style').opacity,
    ).not.toEqual(0);

    expect(onOpenChange).not.toHaveBeenCalled();

    // open submenu
    keyDown(wrapper, KeyCode.DOWN);
    keyDown(wrapper, KeyCode.RIGHT);
    keyDown(wrapper, KeyCode.ENTER);

    expect(onOpenChange).toHaveBeenCalled();
  });
});
/* eslint-enable */
