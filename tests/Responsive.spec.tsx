/* eslint-disable no-undef, react/no-multi-comp, react/jsx-curly-brace-presence, max-classes-per-file */
import React from 'react';
import { act } from 'react-dom/test-utils';
import ResizeObserver from 'rc-resize-observer';
import { mount } from './util';
import Menu, { MenuItem, SubMenu } from '../src';

describe('Menu.Responsive', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('show rest', () => {
    const wrapper = mount(
      <Menu mode="horizontal">
        <MenuItem key="light">Light</MenuItem>
        <MenuItem key="bamboo">Bamboo</MenuItem>
        <SubMenu key="home" title="Home">
          <MenuItem key="little">Little</MenuItem>
        </SubMenu>
      </Menu>,
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
          .onResize({ offsetWidth: 20 } as any, null);
        jest.runAllTimers();
        wrapper.update();
      });
    });

    // Should show the rest icon
    expect(
      wrapper.find('.rc-menu-overflow-item-rest').last().prop('style').opacity,
    ).not.toEqual(0);
  });
});
/* eslint-enable */
