/* eslint-disable no-undef, react/no-multi-comp, react/jsx-curly-brace-presence, max-classes-per-file */
import React from 'react';
import { spyElementPrototypes } from 'rc-util/lib/test/domHook';
import { render } from 'enzyme';
import { mount, keyDown } from './util';
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

    const menuItems = document.querySelectorAll('.rc-menu-item');

    // First item
    keyDown(wrapper, KeyCode.DOWN);
    expect(menuItems[0] === document.activeElement).toBeTruthy();
    keyDown(wrapper, KeyCode.ENTER);
    expect(
      menuItems[0].classList.contains('rc-menu-item-selected'),
    ).toBeTruthy();

    // // Next item
    keyDown(wrapper, KeyCode.DOWN);
    expect(menuItems[1] === document.activeElement).toBeTruthy();

    keyDown(wrapper, KeyCode.ENTER);
    expect(
      menuItems[0].classList.contains('rc-menu-item-selected'),
    ).toBeFalsy();
    expect(
      menuItems[1].classList.contains('rc-menu-item-selected'),
    ).toBeTruthy();
  });

  it('Skip disabled item', () => {
    const wrapper = mount(
      <Menu>
        <MenuItem key="1">1</MenuItem>
        <MenuItem disabled />
        <MenuItem key="2">2</MenuItem>
        <MenuItem disabled />
      </Menu>,
      { attachTo: holder },
    );

    const menuItems = document.querySelectorAll('.rc-menu-item');

    // Next item
    keyDown(wrapper, KeyCode.DOWN);
    keyDown(wrapper, KeyCode.ENTER);
    expect(
      menuItems[0].classList.contains('rc-menu-item-selected'),
    ).toBeTruthy();

    // Go to next item
    keyDown(wrapper, KeyCode.DOWN);
    keyDown(wrapper, KeyCode.ENTER);
    expect(
      menuItems[2].classList.contains('rc-menu-item-selected'),
    ).toBeTruthy();
  });

  it('Enter to open submenu and focus first item', () => {
    const wrapper = mount(
      <Menu mode="vertical">
        <SubMenu key="s1" title="submenu1">
          <MenuItem key="s1-1">1</MenuItem>
        </SubMenu>
      </Menu>,
      { attachTo: holder },
    );

    // Open it
    keyDown(wrapper, KeyCode.DOWN);
    keyDown(wrapper, KeyCode.ENTER);
    expect(wrapper.find('PopupTrigger').prop('visible')).toBeTruthy();

    const popupMenuItems = document
      .querySelector('.rc-menu-sub')
      .querySelectorAll('.rc-menu-item');
    expect(popupMenuItems[0] === document.activeElement).toBeTruthy();
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

        let sumMenuTitles;

        // Focus first
        keyDown(wrapper, KeyCode.DOWN);
        sumMenuTitles = document.querySelectorAll('.rc-menu-submenu-title');
        expect(sumMenuTitles[0] === document.activeElement).toBeTruthy();

        // Open and focus sub
        keyDown(wrapper, subKey);
        expect(
          wrapper.find('PopupTrigger').first().prop('visible'),
        ).toBeTruthy();

        sumMenuTitles = document.querySelectorAll('.rc-menu-submenu-title');
        expect(sumMenuTitles[1] === document.activeElement).toBeTruthy();

        // Open and focus sub
        keyDown(wrapper, subKey);
        expect(
          wrapper.find('PopupTrigger').last().prop('visible'),
        ).toBeTruthy();

        const menuItems = document.querySelectorAll('.rc-menu-item');
        expect(menuItems[0] === document.activeElement).toBeTruthy();

        // Back to parent
        keyDown(wrapper, parentKey);
        expect(wrapper.find('PopupTrigger').last().prop('visible')).toBeFalsy();
        expect(sumMenuTitles[1] === document.activeElement).toBeTruthy();

        // Back to parent
        keyDown(wrapper, parentKey);

        expect(
          wrapper.find('PopupTrigger').first().prop('visible'),
        ).toBeFalsy();

        expect(sumMenuTitles[0] === document.activeElement).toBeTruthy();

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

    const menuRoot = document.querySelector('.rc-menu-root');

    // Nothing happen when no control key
    keyDown(wrapper, KeyCode.P);
    expect(document.body === document.activeElement).toBeTruthy();

    // Focus first
    keyDown(wrapper, KeyCode.DOWN);
    expect(menuRoot.childNodes[0] === document.activeElement).toBeTruthy();

    // Focus next
    keyDown(wrapper, KeyCode.DOWN);
    expect(
      menuRoot.querySelector('.rc-menu-submenu-title') ===
        document.activeElement,
    );

    // Right will not open
    keyDown(wrapper, KeyCode.RIGHT);
    expect(wrapper.find('InlineSubMenuList').prop('open')).toBeFalsy();

    // Trigger open
    keyDown(wrapper, KeyCode.ENTER);
    expect(wrapper.find('InlineSubMenuList').prop('open')).toBeTruthy();
    expect(
      wrapper.find('.rc-menu-submenu').last().hasClass('rc-menu-submenu-open'),
    ).toBeTruthy();

    // Focus sub item
    keyDown(wrapper, KeyCode.DOWN);

    const items = document.querySelectorAll('.rc-menu-item');
    expect(items[items.length - 1] === document.activeElement).toBeTruthy();
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
    keyDown(wrapper, KeyCode.ENTER);

    const menuItems = document.querySelectorAll('.rc-menu-item');
    expect(menuItems[1] === document.activeElement).toBeTruthy();
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
      wrapper.find('a').instance() as any as HTMLAnchorElement,
      'focus',
    );

    keyDown(wrapper, KeyCode.DOWN);
    keyDown(wrapper, KeyCode.ENTER);
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

    const menuItems = document.querySelectorAll('.rc-menu-item');

    expect(menuItems[0] === document.activeElement).toBeTruthy();
  });
});
/* eslint-enable */
