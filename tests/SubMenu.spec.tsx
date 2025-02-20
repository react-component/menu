/* eslint-disable no-undef */
import { act, fireEvent, render } from '@testing-library/react';
import { resetWarned } from 'rc-util/lib/warning';
import React from 'react';
import Menu from '../src';
import { isActive, last } from './util';

jest.mock('@rc-component/trigger', () => {
  const react = require('react');
  let Trigger = jest.requireActual('@rc-component/trigger/lib/mock');
  Trigger = Trigger.default || Trigger;

  return react.forwardRef((props, ref) => {
    global.triggerProps = props;
    return react.createElement(Trigger, { ref, ...props });
  });
});

jest.mock('../src/SubMenu/PopupTrigger', () => {
  const react = require('react');
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
      <Menu
        {...props}
        items={[
          {
            key: 's1',
            label: 'submenu1',
            type: 'submenu',
            children: [
              {
                key: 's1-1',
                label: '1',
              },
              {
                key: 's1-2',
                label: 'submenu1-1',
                type: 'submenu',
                children: [
                  {
                    key: 's1-2-1',
                    label: '2',
                  },
                ],
              },
            ],
          },
          {
            key: 's2',
            label: 'submenu2',
            type: 'submenu',
            children: [
              {
                key: 's2-2',
                label: '2',
              },
            ],
          },
        ]}
      />
    );
  }

  function itemIcon() {
    return <span>MenuItemIcon</span>;
  }

  it("don't show submenu when disabled", () => {
    const { container } = render(
      <Menu
        mode="vertical"
        items={[
          {
            key: 's',
            label: 'submenu',
            type: 'submenu',
            disabled: true,
            children: [
              {
                key: '1',
                label: '1',
              },
            ],
          },
        ]}
      />,
    );
    fireEvent.mouseEnter(container.querySelector('.rc-menu-submenu-title'));

    expect(global.popupTriggerProps.visible).toBeFalsy();
  });

  it('offsets the submenu popover', () => {
    render(
      <Menu
        mode="horizontal"
        disabledOverflow
        items={[
          {
            key: 's',
            label: 'submenu',
            type: 'submenu',
            popupOffset: [0, 15],
            children: [
              {
                key: '1',
                label: '1',
              },
            ],
          },
        ]}
      />,
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
        items={[
          {
            key: 's',
            label: 'submenu',
            type: 'submenu',
            children: [
              {
                key: '1',
                label: '1',
              },
              {
                key: '2',
                label: '2',
              },
            ],
          },
        ]}
      />,
    );

    const wrapperWithExpandIconFunction = render(
      <Menu
        mode="vertical"
        itemIcon={itemIcon}
        expandIcon={() => <span>SubMenuIconNode</span>}
        items={[
          {
            key: 's',
            label: 'submenu',
            type: 'submenu',
            children: [
              {
                key: '1',
                label: '1',
              },
              {
                key: '2',
                label: '2',
              },
            ],
          },
        ]}
      />,
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
      <Menu
        mode="horizontal"
        disabledOverflow
        items={[
          {
            key: 's',
            label: 'submenu',
            type: 'submenu',
            itemIcon: itemIcon,
            expandIcon: <span>SubMenuIconNode</span>,
            children: [
              {
                key: '1',
                label: '1',
              },
            ],
          },
        ]}
      />,
    );

    const childText = container.querySelector(
      '.rc-menu-submenu-title',
    ).textContent;
    expect(childText).toEqual('submenu');
  });

  it(`The submenu item with key '' must not persistently remain active`, () => {
    const { container } = render(
      <Menu
        mode="horizontal"
        items={[
          {
            label: '菜单一',
            key: '1',
          },
          {
            label: '菜单二',
            key: '',
            children: [
              {
                label: 'Navigation One1',
                key: 'mail1',
              },
            ],
          },
        ]}
      />,
    );
    expect(container.querySelector('.rc-menu-submenu-active')).toBeFalsy();
  });

  describe('openSubMenuOnMouseEnter and closeSubMenuOnMouseLeave are true', () => {
    it('toggles when mouse enter and leave', () => {
      const { container } = render(
        <Menu
          items={[
            {
              key: 's1',
              label: 'submenu1',
              type: 'submenu',
              children: [
                {
                  key: 's1-1',
                  label: '1',
                },
              ],
            },
          ]}
        />,
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
      <Menu
        onOpenChange={handleOpenChange}
        items={[
          {
            key: '1',
            label: '1',
          },
          {
            key: 's1',
            label: 's1',
            type: 'submenu',
            children: [
              {
                key: '2',
                label: '2',
              },
              {
                key: 's2',
                label: 's2',
                type: 'submenu',
                children: [
                  {
                    key: '3',
                    label: '3',
                  },
                ],
              },
            ],
          },
        ]}
      />,
    );

    // First
    fireEvent.mouseEnter(container.querySelector('.rc-menu-submenu-title'));
    runAllTimer();
    expect(handleOpenChange).toHaveBeenCalledWith(['s1']);

    // Second
    fireEvent.mouseEnter(
      container.querySelectorAll('.rc-menu-submenu-title')[1],
    );
    runAllTimer();
    expect(handleOpenChange).toHaveBeenCalledWith(['s1', 's2']);
  });

  describe('undefined key', () => {
    it('should not warning', () => {
      resetWarned();
      const errors: any[] = [];
      const errorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation((msg, ...args) => {
          // Only collect non-act related warnings
          if (!msg.includes('act(...)')) {
            errors.push([msg, ...args]);
          }
        });

      render(
        <Menu
          items={[
            {
              type: 'divider',
            },
          ]}
        />,
      );

      // Check if there are any non-act related warnings
      expect(errors).toHaveLength(0);
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
        <Menu
          openKeys={['s1']}
          items={[
            {
              key: 's1',
              label: 'submenu1',
              type: 'submenu',
              onMouseEnter,
              onMouseLeave,
              children: [
                {
                  key: 's1-1',
                  label: '1',
                },
              ],
            },
          ]}
        />,
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
    const { container } = render(
      <Menu
        style={{ backgroundColor: 'black' }}
        items={[
          {
            key: 's1',
            label: 'submenu1',
            type: 'submenu',
            children: [
              {
                key: 's1-1',
                label: '1',
              },
            ],
          },
        ]}
      />,
    );
    expect(container.querySelector('.rc-menu')).toHaveStyle({
      backgroundColor: 'black',
    });
  });

  it('not pass style into sub menu item', () => {
    const { container } = render(
      <Menu
        mode="horizontal"
        style={{ background: 'green' }}
        disabledOverflow
        items={[
          {
            key: '1',
            label: '1',
            style: { color: 'red' },
          },
        ]}
      />,
    );

    expect(container.querySelector('.rc-menu-item')).toHaveStyle({
      color: 'red',
    });
  });

  it('inline click for open', () => {
    const onOpenChange = jest.fn();

    const { container } = render(
      <Menu
        mode="inline"
        onOpenChange={onOpenChange}
        items={[
          {
            key: 'bamboo',
            label: 'Bamboo',
            type: 'submenu',
            disabled: true,
            children: [
              {
                key: 'little',
                label: 'Little',
              },
            ],
          },
          {
            key: 'light',
            label: 'Light',
            type: 'submenu',
            children: [
              {
                key: 'sub',
                label: 'Sub',
              },
            ],
          },
        ]}
      />,
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
      <Menu
        mode="horizontal"
        openKeys={['light']}
        disabledOverflow
        items={[
          {
            key: 'light',
            type: 'submenu',
            children: [
              {
                key: 'bamboo',
                type: 'submenu',
                children: [],
              },
            ],
          },
        ]}
      />,
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
      <Menu
        rootClassName="custom-className"
        defaultOpenKeys={['1', '1-1']}
        items={[
          {
            key: '1',
            label: 'submenu1',
            type: 'submenu',
            children: [
              {
                key: '1-1',
                label: 'submenu7',
                role: 'option',
              },
            ],
          },
          {
            key: '2',
            label: '2',
            role: 'option',
          },
          {
            key: '3',
            label: '3',
            role: 'option',
          },
        ]}
      />,
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

  it('submenu should support popupStyle', () => {
    const { container } = render(
      <Menu
        items={[
          {
            key: 's1',
            label: 'submenu1',
            type: 'submenu',
            popupStyle: { zIndex: 100, width: 150 },
            children: [
              {
                key: 's1-1',
                label: '1',
              },
            ],
          },
        ]}
      />,
    );

    fireEvent.mouseEnter(container.querySelector('.rc-menu-submenu-title'));
    runAllTimer();
    expect(
      (container.querySelector('.rc-menu-submenu-popup') as HTMLElement).style
        .zIndex,
    ).toEqual('100');
    expect(
      (container.querySelector('.rc-menu-submenu-popup') as HTMLElement).style
        .width,
    ).toEqual('150px');
  });
});
/* eslint-enable */
