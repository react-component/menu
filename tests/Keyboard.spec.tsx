/* eslint-disable no-undef, react/no-multi-comp, react/jsx-curly-brace-presence, max-classes-per-file */
import React from 'react';
import { act } from 'react-dom/test-utils';
import { spyElementPrototypes } from 'rc-util/lib/test/domHook';
import { render, mount } from 'enzyme';
import { renderToJson } from 'enzyme-to-json';
import KeyCode from 'rc-util/lib/KeyCode';
import Menu, { MenuItem, MenuItemGroup, SubMenu, Divider } from '../src';
// import * as mockedUtil from '../src/util';
// import { getMotion } from '../src/utils/legacyUtil';

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

    const wrapper = mount(<App />);

    wrapper.setState({ items: [0, 1] });
    await wrapper.flush();

    // First item
    wrapper
      .find('ul.rc-menu-root')
      .simulate('keyDown', { which: KeyCode.DOWN });
    act(() => {
      jest.runAllTimers();
      wrapper.update();
    });
    expect(wrapper.isActive(0)).toBeTruthy();

    // Next item
    wrapper
      .find('ul.rc-menu-root')
      .simulate('keyDown', { which: KeyCode.DOWN });
    act(() => {
      jest.runAllTimers();
      wrapper.update();
    });
    expect(wrapper.isActive(1)).toBeTruthy();
  });
});
/* eslint-enable */
