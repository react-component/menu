/* eslint-disable no-undef */
import React from 'react';
import PropTypes from 'prop-types';
import { mount } from 'enzyme';
import KeyCode from 'rc-util/lib/KeyCode';
import Menu, { MenuItem, SubMenu } from '../src';

describe('SubMenu', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {});

  function createMenu(props) {
    return (
      <Menu {...props}>
        <SubMenu key="s1" title="submenu1">
          <MenuItem key="s1-1">1</MenuItem>
          <SubMenu key="s1-2" title="submenu1-1">
            <MenuItem key="s1-2-1">2</MenuItem>
          </SubMenu>
        </SubMenu>
        <SubMenu key="s2" title="submenu2">
          <MenuItem key="s2-2">2</MenuItem>
        </SubMenu>
      </Menu>
    );
  }

  function itemIcon() {
    return <span>MenuItemIcon</span>;
  }

  it("don't show submenu when disabled", () => {
    const wrapper = mount(
      <Menu mode="vertical">
        <SubMenu key="s" title="submenu" disabled>
          <MenuItem key="1">1</MenuItem>
        </SubMenu>
      </Menu>,
    );
    wrapper
      .find('.rc-menu-submenu-title')
      .first()
      .simulate('mouseEnter');
    expect(wrapper.instance().store.getState().openKeys).toEqual([]);
  });

  it('offsets the submenu popover', () => {
    const wrapper = mount(
      <Menu mode="horizontal">
        <SubMenu key="s" title="submenu" popupOffset={[0, 15]}>
          <MenuItem key="1">1</MenuItem>
        </SubMenu>
      </Menu>,
    );

    const popupAlign = wrapper
      .find('Trigger')
      .first()
      .prop('popupAlign');
    expect(popupAlign).toEqual({ offset: [0, 15] });
  });

  it('should render custom arrow icon correctly.', () => {
    const wrapper = mount(
      <Menu
        mode="vertical"
        itemIcon={itemIcon}
        expandIcon={<span>SubMenuIconNode</span>}
      >
        <SubMenu key="s" title="submenu">
          <MenuItem key="1">1</MenuItem>
          <MenuItem key="2">2</MenuItem>
        </SubMenu>
      </Menu>,
    );

    const wrapperWithExpandIconFunction = mount(
      <Menu
        mode="vertical"
        itemIcon={itemIcon}
        expandIcon={() => <span>SubMenuIconNode</span>}
      >
        <SubMenu key="s" title="submenu">
          <MenuItem key="1">1</MenuItem>
          <MenuItem key="2">2</MenuItem>
        </SubMenu>
      </Menu>,
    );

    const subMenuText = wrapper
      .find('.rc-menu-submenu-title')
      .first()
      .text();
    const subMenuTextWithExpandIconFunction = wrapperWithExpandIconFunction
      .find('.rc-menu-submenu-title')
      .first()
      .text();
    expect(subMenuText).toEqual('submenuSubMenuIconNode');
    expect(subMenuTextWithExpandIconFunction).toEqual('submenuSubMenuIconNode');
  });

  it('should Not render custom arrow icon in horizontal mode.', () => {
    const wrapper = mount(
      <Menu mode="horizontal">
        <SubMenu
          key="s"
          title="submenu"
          itemIcon={itemIcon}
          expandIcon={<span>SubMenuIconNode</span>}
        >
          <MenuItem key="1">1</MenuItem>
        </SubMenu>
      </Menu>,
    );

    const childText = wrapper
      .find('.rc-menu-submenu-title')
      .at(1)
      .text();
    expect(childText).toEqual('submenu');
  });

  describe('openSubMenuOnMouseEnter and closeSubMenuOnMouseLeave are true', () => {
    it('toggles when mouse enter and leave', () => {
      const wrapper = mount(createMenu());

      wrapper
        .find('.rc-menu-submenu-title')
        .first()
        .simulate('mouseEnter');
      jest.runAllTimers();
      expect(wrapper.instance().store.getState().openKeys).toEqual(['s1']);

      wrapper
        .find('.rc-menu-submenu-title')
        .first()
        .simulate('mouseLeave');
      jest.runAllTimers();
      expect(wrapper.instance().store.getState().openKeys).toEqual([]);
    });
  });

  describe('openSubMenuOnMouseEnter and closeSubMenuOnMouseLeave are false', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = mount(
        createMenu({
          triggerSubMenuAction: 'click',
        }),
      );
    });

    it('toggles when mouse click', () => {
      wrapper
        .find('.rc-menu-submenu-title')
        .first()
        .simulate('click');
      expect(wrapper.instance().store.getState().openKeys).toEqual(['s1']);

      wrapper
        .find('.rc-menu-submenu-title')
        .first()
        .simulate('click');
      expect(wrapper.instance().store.getState().openKeys).toEqual([]);
    });
  });

  it('fires openChange event', () => {
    const handleOpenChange = jest.fn();
    const wrapper = mount(
      <Menu onOpenChange={handleOpenChange}>
        <MenuItem key="1">1</MenuItem>
        <SubMenu title="s1">
          <MenuItem key="2">2</MenuItem>
          <SubMenu title="s2">
            <MenuItem key="3">3</MenuItem>
          </SubMenu>
        </SubMenu>
      </Menu>,
    );

    wrapper
      .find('.rc-menu-submenu-title')
      .at(0)
      .simulate('mouseEnter');
    jest.runAllTimers();
    expect(handleOpenChange).toHaveBeenCalledWith(['item_1']);

    wrapper.update();

    wrapper
      .find('.rc-menu-submenu-title')
      .at(1)
      .simulate('mouseEnter');
    jest.runAllTimers();
    expect(handleOpenChange).toHaveBeenCalledWith([
      'item_1',
      'item_1-menu-item_1',
    ]);
  });

  describe('mouse events', () => {
    it('mouse enter event on a submenu should not activate first item', () => {
      const wrapper = mount(createMenu({ openKeys: ['s1'] }));
      const title = wrapper.find('.rc-menu-submenu-title').first();
      title.simulate('mouseEnter');

      jest.runAllTimers();
      wrapper.update();

      expect(
        wrapper
          .find('.rc-menu-sub')
          .first()
          .is('.rc-menu-hidden'),
      ).toBe(false);
      expect(
        wrapper
          .find('MenuItem')
          .first()
          .props().active,
      ).toBe(false);
    });

    it('click to open a submenu should not activate first item', () => {
      const wrapper = mount(createMenu({ triggerSubMenuAction: 'click' }));
      const subMenuTitle = wrapper.find('.rc-menu-submenu-title').first();
      subMenuTitle.simulate('click');

      jest.runAllTimers();
      wrapper.update();

      expect(
        wrapper
          .find('.rc-menu-sub')
          .first()
          .is('.rc-menu-hidden'),
      ).toBe(false);
      expect(
        wrapper
          .find('MenuItem')
          .first()
          .props().active,
      ).toBe(false);
    });

    it('mouse enter/mouse leave on a subMenu item should trigger hooks', () => {
      const onMouseEnter = jest.fn();
      const onMouseLeave = jest.fn();
      const wrapper = mount(
        <Menu openKeys={['s1']}>
          <SubMenu
            key="s1"
            title="submenu1"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          >
            <MenuItem key="s1-1">1</MenuItem>
          </SubMenu>
        </Menu>,
      );
      const subMenu = wrapper.find('.rc-menu-submenu').first();

      subMenu.simulate('mouseEnter');
      expect(onMouseEnter).toHaveBeenCalledTimes(1);

      subMenu.simulate('mouseLeave');
      expect(onMouseLeave).toHaveBeenCalledTimes(1);
    });
  });

  describe('key press', () => {
    describe('enter key', () => {
      it('opens menu and active first item', () => {
        const wrapper = mount(createMenu());
        const title = wrapper.find('.rc-menu-submenu-title').first();

        title
          .simulate('mouseEnter')
          .simulate('keyDown', { keyCode: KeyCode.ENTER });

        jest.runAllTimers();
        wrapper.update();

        expect(
          wrapper
            .find('.rc-menu-sub')
            .first()
            .is('.rc-menu-hidden'),
        ).toBe(false);
        expect(
          wrapper
            .find('MenuItem')
            .first()
            .props().active,
        ).toBe(true);
      });
    });

    describe('left & right key', () => {
      it('toggles menu', () => {
        const wrapper = mount(createMenu({ defaultActiveFirst: true }));
        const title = wrapper.find('.rc-menu-submenu-title').first();

        title
          .simulate('mouseEnter')
          .simulate('keyDown', { keyCode: KeyCode.LEFT });
        expect(wrapper.instance().store.getState().openKeys).toEqual([]);
        title.simulate('keyDown', { keyCode: KeyCode.RIGHT });
        expect(wrapper.instance().store.getState().openKeys).toEqual(['s1']);
        expect(
          wrapper
            .find('MenuItem')
            .first()
            .props().active,
        ).toBe(true);
      });
    });

    it('up & down key', () => {
      const wrapper = mount(createMenu());
      const titles = wrapper.find('.rc-menu-submenu-title');

      titles
        .first()
        .simulate('mouseEnter')
        .simulate('keyDown', { keyCode: KeyCode.LEFT })
        .simulate('keyDown', { keyCode: KeyCode.DOWN });
      expect(
        wrapper
          .find('.rc-menu-submenu')
          .last()
          .is('.rc-menu-submenu-active'),
      ).toBe(true);

      titles.last().simulate('keyDown', { keyCode: KeyCode.UP });
      expect(
        wrapper
          .find('.rc-menu-submenu')
          .first()
          .is('.rc-menu-submenu-active'),
      ).toBe(true);
    });

    it('combined key presses', () => {
      const wrapper = mount(createMenu());
      const titles = wrapper.find('.rc-menu-submenu-title');
      const firstItem = titles.first();

      // testing keydown event after submenu is closed and then opened again
      firstItem
        .simulate('mouseEnter')
        .simulate('keyDown', { keyCode: KeyCode.RIGHT })
        .simulate('keyDown', { keyCode: KeyCode.LEFT })
        .simulate('keyDown', { keyCode: KeyCode.RIGHT })
        .simulate('keyDown', { keyCode: KeyCode.DOWN })
        .simulate('keyDown', { keyCode: KeyCode.DOWN })
        .simulate('keyDown', { keyCode: KeyCode.DOWN });

      expect(
        wrapper
          .find('[title="submenu1-1"]')
          .find('.rc-menu-submenu')
          .first()
          .is('.rc-menu-submenu-active'),
      ).toBe(true);
    });
  });

  it('fires select event', () => {
    const handleSelect = jest.fn();
    const wrapper = mount(createMenu({ onSelect: handleSelect }));
    wrapper
      .find('.rc-menu-submenu-title')
      .first()
      .simulate('mouseEnter');

    jest.runAllTimers();
    wrapper.update();

    wrapper
      .find('MenuItem')
      .first()
      .simulate('click');
    expect(handleSelect.mock.calls[0][0].key).toBe('s1-1');
  });

  it('fires select event with className', () => {
    const wrapper = mount(createMenu());
    wrapper
      .find('.rc-menu-submenu-title')
      .first()
      .simulate('mouseEnter');

    jest.runAllTimers();
    wrapper.update();

    wrapper
      .find('MenuItem')
      .first()
      .simulate('click');
    expect(
      wrapper
        .find('.rc-menu-submenu')
        .first()
        .is('.rc-menu-submenu-selected'),
    ).toBe(true);
  });

  it('fires deselect event for multiple menu', () => {
    const handleDeselect = jest.fn();
    const wrapper = mount(
      createMenu({
        multiple: true,
        onDeselect: handleDeselect,
      }),
    );
    wrapper
      .find('.rc-menu-submenu-title')
      .first()
      .simulate('mouseEnter');

    jest.runAllTimers();
    wrapper.update();

    wrapper
      .find('MenuItem')
      .first()
      .simulate('click');
    wrapper
      .find('MenuItem')
      .first()
      .simulate('click');

    expect(handleDeselect.mock.calls[0][0].key).toBe('s1-1');
  });

  describe('horizontal menu', () => {
    it('should automatically adjust width', () => {
      const props = {
        mode: 'horizontal',
        openKeys: ['s1'],
      };

      const wrapper = mount(
        <Menu {...props}>
          <MenuItem key="1">1</MenuItem>
          <SubMenu title="s1" key="s1">
            <MenuItem key="2">2</MenuItem>
          </SubMenu>
        </Menu>,
      );

      // every item has a prefixed overflow indicator as a submenu
      // so we have to get the 3rd submenu
      const subMenuInstance = wrapper
        .find('SubMenu')
        .at(2)
        .instance();
      const adjustWidthSpy = jest.spyOn(subMenuInstance, 'adjustWidth');

      jest.runAllTimers();

      expect(adjustWidthSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('submenu animation', () => {
    const appear = () => {};

    it('should animate with transition class', () => {
      const wrapper = mount(
        createMenu({
          openTransitionName: 'fade',
          mode: 'inline',
        }),
      );

      const title = wrapper.find('.rc-menu-submenu-title').first();

      title.simulate('click');
      jest.runAllTimers();

      expect(wrapper.find('CSSMotion').prop('motionName')).toEqual('fade');
    });

    it('should not animate on initially opened menu', () => {
      const wrapper = mount(
        createMenu({
          openAnimation: { appear },
          mode: 'inline',
          openKeys: ['s1'],
        }),
      );

      expect(
        wrapper
          .find('CSSMotion')
          .first()
          .prop('motionAppear'),
      ).toBeFalsy();
    });

    it('should animate with config', () => {
      const wrapper = mount(
        createMenu({
          openAnimation: { appear },
          mode: 'inline',
        }),
      );

      const title = wrapper.find('.rc-menu-submenu-title').first();

      title.simulate('click');
      jest.runAllTimers();

      expect(
        wrapper
          .find('CSSMotion')
          .first()
          .prop('motionAppear'),
      ).toBeTruthy();
    });
  });

  describe('.componentWillUnmount()', () => {
    it('should invoke hooks', () => {
      const onDestroy = jest.fn();
      const App = props => (
        <Menu>
          {props.show && (
            <SubMenu key="s1" title="submenu1" onDestroy={onDestroy}>
              <MenuItem key="s1-1">1</MenuItem>
            </SubMenu>
          )}
        </Menu>
      );

      App.propTypes = {
        show: PropTypes.bool,
      };

      const wrapper = mount(<App show />);

      wrapper.setProps({ show: false });

      expect(onDestroy).toHaveBeenCalledWith('s1');
    });
  });

  describe('customizing style', () => {
    it('should take style prop', () => {
      const App = () => (
        <Menu style={{ backgroundColor: 'black' }}>
          <SubMenu key="s1" title="submenu1">
            <MenuItem key="s1-1">1</MenuItem>
          </SubMenu>
        </Menu>
      );

      const wrapper = mount(<App show />);
      expect(wrapper.find('Menu ul').prop('style')).toEqual({
        backgroundColor: 'black',
      });
    });
  });
});
/* eslint-enable */
