/* eslint-disable no-undef */
import { act, fireEvent, render } from '@testing-library/react';
import { resetWarned } from 'rc-util/lib/warning';
import React from 'react';
import Menu, { MenuItem, SubMenu } from '../src';
import { isActive, last } from './util';

jest.mock('@rc-component/trigger', () => {
  const react  = require('react');
  let Trigger = jest.requireActual('rc-trigger/lib/mock');
  Trigger = Trigger.default || Trigger;

  return react.forwardRef((props, ref) => {
    global.triggerProps = props;
    return react.createElement(Trigger, { ref, ...props });
  });
});

jest.mock('../src/SubMenu/PopupTrigger', () => {
  const react  = require('react');
  let PopupTrigger = jest.requireActual('../src/SubMenu/PopupTrigger');
  PopupTrigger = PopupTrigger.default || PopupTrigger;

  return react.forwardRef((props, ref) => {
    global.popupTriggerProps = props;
    return react.createElement(PopupTrigger, { ref, ...props });
  });
});

describe('SubMenu', () => {
  function runAllTimer() {
    for (let i = 0; i < 10; i += 1) {
      act(() => {
        jest.runAllTimers();
      });
    }
  }

  beforeEach(() => {
    global.triggerProps = null;
    global.popupTriggerProps = null;
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  function createMenu(props?) {
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
    const { container } = render(
      <Menu mode="vertical">
        <SubMenu key="s" title="submenu" disabled>
          <MenuItem key="1">1</MenuItem>
        </SubMenu>
      </Menu>,
    );
    fireEvent.mouseEnter(container.querySelector('.rc-menu-submenu-title'));

    expect(global.popupTriggerProps.visible).toBeFalsy();
  });

  it('offsets the submenu popover', () => {
    render(
      <Menu mode="horizontal" disabledOverflow>
        <SubMenu key="s" title="submenu" popupOffset={[0, 15]}>
          <MenuItem key="1">1</MenuItem>
        </SubMenu>
      </Menu>,
    );

    const { popupAlign } = global.triggerProps;
    expect(popupAlign).toEqual({ offset: [0, 15] });
  });

  it('should render custom arrow icon correctly.', () => {
    const { container } = render(
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

    const wrapperWithExpandIconFunction = render(
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

    const subMenuText = container.querySelector(
      '.rc-menu-submenu-title',
    ).textContent;
    const subMenuTextWithExpandIconFunction =
      wrapperWithExpandIconFunction.container.querySelector(
        '.rc-menu-submenu-title',
      ).textContent;
    expect(subMenuText).toEqual('submenuSubMenuIconNode');
    expect(subMenuTextWithExpandIconFunction).toEqual('submenuSubMenuIconNode');
  });

  it('should Not render custom arrow icon in horizontal mode.', () => {
    const { container } = render(
      <Menu mode="horizontal" disabledOverflow>
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

    const childText = container.querySelector(
      '.rc-menu-submenu-title',
    ).textContent;
    expect(childText).toEqual('submenu');
  });

  describe('openSubMenuOnMouseEnter and closeSubMenuOnMouseLeave are true', () => {
    it('toggles when mouse enter and leave', () => {
      const { container } = render(
        <Menu>
          <SubMenu key="s1" title="submenu1">
            <MenuItem key="s1-1">1</MenuItem>
          </SubMenu>
        </Menu>,
      );

      // Enter
      fireEvent.mouseEnter(container.querySelector('.rc-menu-submenu-title'));
      runAllTimer();
      expect(container.querySelector('.rc-menu-submenu-open')).toBeTruthy();

      // Leave
      fireEvent.mouseLeave(container.querySelector('.rc-menu-submenu-title'));
      act(() => {
        jest.runAllTimers();
      });
      expect(container.querySelector('.rc-menu-submenu-open')).toBeFalsy();
    });
  });

  describe('openSubMenuOnMouseEnter and closeSubMenuOnMouseLeave are false', () => {
    it('toggles when mouse click', () => {
      const { container } = render(
        createMenu({
          triggerSubMenuAction: 'click',
        }),
      );

      fireEvent.click(container.querySelector('.rc-menu-submenu-title'));
      runAllTimer();
      expect(container.querySelector('.rc-menu-submenu-open')).toBeTruthy();

      fireEvent.click(container.querySelector('.rc-menu-submenu-title'));
      act(() => {
        jest.runAllTimers();
      });
      expect(container.querySelector('.rc-menu-submenu-open')).toBeFalsy();
    });
  });

  it('fires openChange event', () => {
    const handleOpenChange = jest.fn();
    const { container } = render(
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

    // First
    fireEvent.mouseEnter(container.querySelector('.rc-menu-submenu-title'));
    runAllTimer();
    expect(handleOpenChange).toHaveBeenCalledWith(['tmp_key-1']);

    // Second
    fireEvent.mouseEnter(
      container.querySelectorAll('.rc-menu-submenu-title')[1],
    );
    runAllTimer();
    expect(handleOpenChange).toHaveBeenCalledWith([
      'tmp_key-1',
      'tmp_key-tmp_key-1-1',
    ]);
  });

  describe('undefined key', () => {
    it('warning item', () => {
      resetWarned();

      const errorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      render(
        <Menu>
          <MenuItem>1</MenuItem>
        </Menu>,
      );

      expect(errorSpy).toHaveBeenCalledWith(
        'Warning: MenuItem should not leave undefined `key`.',
      );

      errorSpy.mockRestore();
    });

    it('warning sub menu', () => {
      resetWarned();

      const errorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      render(
        <Menu>
          <SubMenu />
        </Menu>,
      );

      expect(errorSpy).toHaveBeenCalledWith(
        'Warning: SubMenu should not leave undefined `key`.',
      );

      errorSpy.mockRestore();
    });

    it('should not warning', () => {
      resetWarned();

      const errorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      render(
        <Menu>
          <Menu.Divider />
        </Menu>,
      );

      expect(errorSpy).not.toHaveBeenCalled();

      errorSpy.mockRestore();
    });
  });

  describe('mouse events', () => {
    it('mouse enter event on a submenu should not activate first item', () => {
      const { container } = render(createMenu({ openKeys: ['s1'] }));
      fireEvent.mouseEnter(container.querySelector('.rc-menu-submenu-title'));

      runAllTimer();

      expect(container.querySelector('.rc-menu-submenu-open')).toBeTruthy();
      isActive(container, 0, false);
    });

    it('click to open a submenu should not activate first item', () => {
      const { container } = render(
        createMenu({ triggerSubMenuAction: 'click' }),
      );
      fireEvent.click(container.querySelector('.rc-menu-submenu-title'));

      runAllTimer();

      expect(container.querySelector('.rc-menu-submenu-open')).toBeTruthy();
      isActive(container, 0, false);
    });

    it('mouse enter/mouse leave on a subMenu item should trigger hooks', () => {
      const onMouseEnter = jest.fn();
      const onMouseLeave = jest.fn();
      const { container } = render(
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
      fireEvent.mouseEnter(container.querySelector('.rc-menu-submenu-title'));
      expect(onMouseEnter).toHaveBeenCalledTimes(1);

      fireEvent.mouseLeave(container.querySelector('.rc-menu-submenu-title'));
      expect(onMouseLeave).toHaveBeenCalledTimes(1);
    });
  });

  it('fires select event', () => {
    const handleSelect = jest.fn();
    const { container } = render(createMenu({ onSelect: handleSelect }));
    fireEvent.mouseEnter(container.querySelector('.rc-menu-submenu-title'));

    runAllTimer();

    fireEvent.click(container.querySelector('.rc-menu-item'));
    expect(handleSelect.mock.calls[0][0].key).toBe('s1-1');
  });

  it('fires select event with className', () => {
    const { container } = render(createMenu());
    fireEvent.mouseEnter(container.querySelector('.rc-menu-submenu-title'));

    runAllTimer();

    fireEvent.click(container.querySelector('.rc-menu-item'));
    expect(container.querySelector('.rc-menu-submenu')).toHaveClass(
      'rc-menu-submenu-selected',
    );
  });

  it('fires deselect event for multiple menu', () => {
    const handleDeselect = jest.fn();
    const { container } = render(
      createMenu({
        multiple: true,
        onDeselect: handleDeselect,
      }),
    );
    fireEvent.mouseEnter(container.querySelector('.rc-menu-submenu-title'));

    runAllTimer();

    fireEvent.click(container.querySelector('.rc-menu-item'));
    fireEvent.click(container.querySelector('.rc-menu-item'));
    expect(handleDeselect.mock.calls[0][0].key).toBe('s1-1');
  });

  it('should take style prop', () => {
    const App = () => (
      <Menu style={{ backgroundColor: 'black' }}>
        <SubMenu key="s1" title="submenu1">
          <MenuItem key="s1-1">1</MenuItem>
        </SubMenu>
      </Menu>
    );

    const { container } = render(<App />);
    expect(container.querySelector('.rc-menu')).toHaveStyle({
      backgroundColor: 'black',
    });
  });

  it('not pass style into sub menu item', () => {
    const { container } = render(
      <Menu mode="horizontal" style={{ background: 'green' }} disabledOverflow>
        <MenuItem style={{ color: 'red' }} key="1">
          1
        </MenuItem>
      </Menu>,
    );

    expect(container.querySelector('.rc-menu-item')).toHaveStyle({
      color: 'red',
    });
  });

  it('inline click for open', () => {
    const onOpenChange = jest.fn();

    const { container } = render(
      <Menu mode="inline" onOpenChange={onOpenChange}>
        <SubMenu key="bamboo" title="Bamboo" disabled>
          <MenuItem key="little">Little</MenuItem>
        </SubMenu>
        <SubMenu key="light" title="Light">
          <MenuItem key="sub">Sub</MenuItem>
        </SubMenu>
      </Menu>,
    );

    // Disabled
    fireEvent.click(container.querySelector('.rc-menu-submenu-title'));
    expect(onOpenChange).not.toHaveBeenCalled();

    // Disabled
    fireEvent.click(last(container.querySelectorAll('.rc-menu-submenu-title')));
    expect(onOpenChange).toHaveBeenCalledWith(['light']);
  });

  it('popup className should correct', () => {
    const { container } = render(
      <Menu mode="horizontal" openKeys={['light']} disabledOverflow>
        <SubMenu key="light">
          <SubMenu key="bamboo" />
        </SubMenu>
      </Menu>,
    );

    runAllTimer();

    expect(container.querySelector('.rc-menu-submenu')).toHaveClass(
      'rc-menu-submenu-horizontal',
    );

    expect(last(container.querySelectorAll('.rc-menu-submenu'))).toHaveClass(
      'rc-menu-submenu-vertical',
    );
  });

  it('should support rootClassName', () => {
    const { container } = render(
      <Menu rootClassName="custom-className" defaultOpenKeys={['1', '1-1']}>
        <SubMenu key="1" title="submenu1">
          <MenuItem key="1-1" role="option">
            submenu7
          </MenuItem>
        </SubMenu>
        <MenuItem key="2" role="option">
          2
        </MenuItem>
        <MenuItem key="3" role="option">
          3
        </MenuItem>
      </Menu>,
    );
    expect(container.children).toMatchSnapshot();

    expect(container.querySelector('.rc-menu-root')).toHaveClass(
      'custom-className',
    );
    expect(container.querySelectorAll('.rc-menu-submenu-popup')).toHaveLength(
      0,
    );

    runAllTimer();

    // Enter
    fireEvent.mouseEnter(container.querySelector('.rc-menu-submenu-title'));

    runAllTimer();

    expect(container.querySelector('.rc-menu-submenu-popup')).toHaveClass(
      'custom-className',
    );

    expect(container.children).toMatchSnapshot();
  });
});
/* eslint-enable */
