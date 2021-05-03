/* eslint-disable no-undef, react/no-multi-comp, react/jsx-curly-brace-presence, max-classes-per-file */
import React from 'react';
import { act } from 'react-dom/test-utils';
import { spyElementPrototypes } from 'rc-util/lib/test/domHook';
import { render } from 'enzyme';
import { mount } from './util';
import type { ReactWrapper } from './util';
import KeyCode from 'rc-util/lib/KeyCode';
import Menu, { MenuItem, SubMenu } from '../src';

describe('Menu.Keyboard', () => {
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

  function keyDown(wrapper: ReactWrapper, keyCode: number) {
    wrapper.find('ul.rc-menu-root').simulate('keyDown', { which: keyCode });

    act(() => {
      jest.runAllTimers();
      wrapper.update();
    });
  }

  it('no data-menu-id by init', () => {
    const wrapper = render(
      <Menu mode="inline" openKeys={['light']}>
        <Menu.SubMenu key="light" title="Light">
          <Menu.Item key="bamboo">Bamboo</Menu.Item>
        </Menu.SubMenu>
      </Menu>,
    );

    expect(wrapper).toMatchSnapshot();
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

    const wrapper = mount(<App />, { attachTo: holder });

    wrapper.setState({ items: [0, 1] });
    await wrapper.flush();

    // First item
    keyDown(wrapper, KeyCode.DOWN);
    expect(wrapper.isActive(0)).toBeTruthy();

    // Next item
    keyDown(wrapper, KeyCode.DOWN);
    expect(wrapper.isActive(1)).toBeTruthy();
  });

  it('Skip disabled item', () => {
    const wrapper = mount(
      <Menu defaultActiveFirst>
        <MenuItem key="1">1</MenuItem>
        <MenuItem disabled />
        <MenuItem key="2">2</MenuItem>
      </Menu>,
      { attachTo: holder },
    );

    // Next item
    keyDown(wrapper, KeyCode.DOWN);
    expect(wrapper.isActive(2)).toBeTruthy();

    // Back to first item
    keyDown(wrapper, KeyCode.UP);
    expect(wrapper.isActive(0)).toBeTruthy();
  });

  it('Enter to open menu and active first item', () => {
    const wrapper = mount(
      <Menu>
        <SubMenu key="s1" title="submenu1">
          <MenuItem key="s1-1">1</MenuItem>
        </SubMenu>
      </Menu>,
      { attachTo: holder },
    );

    // Active first sub menu
    keyDown(wrapper, KeyCode.DOWN);

    // Open it
    keyDown(wrapper, KeyCode.ENTER);
    expect(wrapper.find('PopupTrigger').prop('visible')).toBeTruthy();
  });

  describe('go to children & back of parent', () => {
    function testDirection(
      direction: 'ltr' | 'rtl',
      subKey: number,
      parentKey: number,
    ) {
      it(`direction ${direction}`, () => {
        const wrapper = mount(
          <Menu mode="vertical" direction={direction}>
            <SubMenu key="bamboo" title="Bamboo">
              <SubMenu key="light" title="Light">
                <MenuItem key="little">Little</MenuItem>
              </SubMenu>
            </SubMenu>
          </Menu>,
          { attachTo: holder },
        );

        // Active first
        keyDown(wrapper, KeyCode.DOWN);

        // Open and active sub
        keyDown(wrapper, subKey);
        expect(
          wrapper.find('PopupTrigger').first().prop('visible'),
        ).toBeTruthy();

        expect(
          wrapper
            .find('.rc-menu-submenu-active .rc-menu-submenu-title')
            .last()
            .text(),
        ).toEqual('Light');

        // Open and active sub
        keyDown(wrapper, subKey);
        expect(
          wrapper.find('PopupTrigger').last().prop('visible'),
        ).toBeTruthy();
        expect(wrapper.find('.rc-menu-item-active').last().text()).toEqual(
          'Little',
        );

        // Back to parent
        keyDown(wrapper, parentKey);
        expect(wrapper.find('PopupTrigger').last().prop('visible')).toBeFalsy();
        expect(wrapper.find('.rc-menu-item-active')).toHaveLength(0);

        // Back to parent
        keyDown(wrapper, parentKey);

        expect(
          wrapper.find('PopupTrigger').first().prop('visible'),
        ).toBeFalsy();

        expect(wrapper.find('li.rc-menu-submenu-active')).toHaveLength(1);

        wrapper.unmount();
      });
    }

    testDirection('ltr', KeyCode.RIGHT, KeyCode.LEFT);
    testDirection('rtl', KeyCode.LEFT, KeyCode.RIGHT);
  });

  it('inline keyboard', () => {
    const wrapper = mount(
      <Menu mode="inline">
        <MenuItem key="light">Light</MenuItem>
        <SubMenu key="bamboo" title="Bamboo">
          <MenuItem key="little">Little</MenuItem>
        </SubMenu>
      </Menu>,
      { attachTo: holder },
    );

    // Nothing happen when no control key
    keyDown(wrapper, KeyCode.P);
    expect(wrapper.exists('.rc-menu-item-active')).toBeFalsy();

    // Active first
    keyDown(wrapper, KeyCode.DOWN);
    expect(wrapper.isActive(0)).toBeTruthy();

    // Active next
    keyDown(wrapper, KeyCode.DOWN);

    // Right will not open
    keyDown(wrapper, KeyCode.RIGHT);
    expect(wrapper.find('InlineSubMenuList').prop('open')).toBeFalsy();

    // Trigger open
    keyDown(wrapper, KeyCode.ENTER);
    expect(wrapper.find('InlineSubMenuList').prop('open')).toBeTruthy();
    expect(
      wrapper
        .find('.rc-menu-submenu')
        .last()
        .hasClass('rc-menu-submenu-active'),
    ).toBeTruthy();
    expect(wrapper.isActive(1)).toBeFalsy();

    // Active sub item
    keyDown(wrapper, KeyCode.DOWN);
    expect(wrapper.isActive(1)).toBeTruthy();
  });

  it('Focus last one', () => {
    const wrapper = mount(
      <Menu mode="inline">
        <MenuItem key="light">Light</MenuItem>
        <MenuItem key="bamboo">Bamboo</MenuItem>
      </Menu>,
      { attachTo: holder },
    );

    keyDown(wrapper, KeyCode.UP);
    expect(wrapper.isActive(1)).toBeTruthy();
  });

  it('Focus to link direct', () => {
    const wrapper = mount(
      <Menu mode="inline">
        <MenuItem key="light">
          <a href="https://ant.design">Light</a>
        </MenuItem>
      </Menu>,
      { attachTo: holder },
    );

    const focusSpy = jest.spyOn(
      (wrapper.find('a').instance() as any) as HTMLAnchorElement,
      'focus',
    );

    keyDown(wrapper, KeyCode.DOWN);
    expect(focusSpy).toHaveBeenCalled();
  });

  it('no dead loop', async () => {
    const wrapper = mount(
      <Menu mode="vertical" openKeys={['bamboo']}>
        <MenuItem key="little">Little</MenuItem>
      </Menu>,
      { attachTo: holder },
    );

    keyDown(wrapper, KeyCode.DOWN);
    keyDown(wrapper, KeyCode.LEFT);
    keyDown(wrapper, KeyCode.RIGHT);
    expect(wrapper.isActive(0)).toBeTruthy();
  });
});
/* eslint-enable */
