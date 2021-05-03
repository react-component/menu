/* eslint-disable no-undef, react/no-multi-comp, react/jsx-curly-brace-presence, max-classes-per-file */
import React from 'react';
import { act } from 'react-dom/test-utils';
import KeyCode from 'rc-util/lib/KeyCode';
import { render } from 'enzyme';
import ResizeObserver from 'rc-resize-observer';
import { mount } from './util';
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
      <Menu mode="horizontal" activeKey="little" onOpenChange={onOpenChange}>
        <MenuItem key="light">Light</MenuItem>
        <MenuItem key="bamboo">Bamboo</MenuItem>
        <SubMenu key="home" title="Home">
          <MenuItem key="little">Little</MenuItem>
        </SubMenu>
      </Menu>,
      { attachTo: document.body },
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

    // Should set active on rest
    expect(
      wrapper
        .find('.rc-menu-overflow-item-rest')
        .last()
        .hasClass('rc-menu-submenu-active'),
    ).toBeTruthy();

    // Key down can open
    expect(onOpenChange).not.toHaveBeenCalled();
    wrapper.setProps({ activeKey: OVERFLOW_KEY });
    wrapper
      .find('ul.rc-menu-root')
      .simulate('keyDown', { which: KeyCode.DOWN });
    expect(onOpenChange).toHaveBeenCalled();
  });
});
/* eslint-enable */
