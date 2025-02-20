/* eslint-disable no-undef, react/no-multi-comp, react/jsx-curly-brace-presence, max-classes-per-file */
import type { MenuMode } from '@/interface';
import { fireEvent, render, act } from '@testing-library/react';
import KeyCode from 'rc-util/lib/KeyCode';
import { resetWarned } from 'rc-util/lib/warning';
import React from 'react';
import type { MenuRef } from '../src';
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

jest.mock('rc-motion', () => {
  const react = require('react');
  let Motion = jest.requireActual('rc-motion');
  Motion = Motion.default || Motion;

  return react.forwardRef((props, ref) => {
    global.motionProps = props;
    return react.createElement(Motion, { ref, ...props });
  });
});

describe('Menu', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  describe('should render', () => {
    function createMenu(props?, subKey?) {
      return (
        <Menu
          disabledOverflow
          className="myMenu"
          openAnimation="fade"
          {...props}
          items={[
            {
              key: 'g1',
              type: 'group',
              label: 'g1',
              children: [
                {
                  key: '1',
                  label: '1',
                },
                {
                  type: 'divider',
                },
                {
                  key: '2',
                  label: '2',
                },
              ],
            },
            {
              key: '3',
              label: '3',
            },
            {
              key: 'g2',
              type: 'group',
              label: 'g2',
              children: [
                {
                  key: '4',
                  label: '4',
                },
                {
                  key: '5',
                  label: '5',
                  disabled: true,
                },
              ],
            },
            {
              key: subKey,
              label: 'submenu',
              children: [
                {
                  key: '6',
                  label: '6',
                },
              ],
            },
          ]}
        />
      );
    }

    it('popup with rtl has correct className', () => {
      const { container, unmount } = render(
        createMenu(
          { mode: 'vertical', direction: 'rtl', openKeys: ['sub'] },
          'sub',
        ),
      );

      act(() => {
        jest.runAllTimers();
      });

      expect(
        container.querySelector('.rc-menu-submenu-popup .rc-menu-rtl'),
      ).toBeTruthy();

      unmount();
    });

    (['vertical', 'horizontal', 'inline'] as MenuMode[]).forEach(mode => {
      it(`${mode} menu correctly`, () => {
        const { container } = render(createMenu({ mode }));
        expect(container.children).toMatchSnapshot();
      });

      it(`${mode} menu with empty children without error`, () => {
        expect(() => render(<Menu mode={mode}>{[]}</Menu>)).not.toThrow();
      });

      it(`${mode} menu with undefined children without error`, () => {
        expect(() => render(<Menu mode={mode} />)).not.toThrow();
      });

      it(`${mode} menu that has a submenu with undefined children without error`, () => {
        expect(() =>
          render(
            <Menu
              mode={mode}
              items={[
                {
                  key: 'submenu',
                  label: '',
                  children: undefined,
                },
              ]}
            />,
          ),
        ).not.toThrow();
      });

      it(`${mode} menu with rtl direction correctly`, () => {
        const { container } = render(createMenu({ mode, direction: 'rtl' }));
        expect(container.children).toMatchSnapshot();

        expect(container.querySelector('ul').className).toContain('-rtl');
      });
    });

    it('should support Fragment', () => {
      const { container } = render(
        <Menu
          items={[
            {
              key: 'submenu1',
              type: 'submenu',
              label: 'submenu',
              children: [
                {
                  key: '6',
                  label: '6',
                },
              ],
            },
            {
              key: '7',
              label: '6',
            },
            {
              key: 'submenu2',
              type: 'submenu',
              label: 'submenu',
              children: [
                {
                  key: '8',
                  label: '6',
                },
              ],
            },
            {
              key: '9',
              label: '6',
            },
          ]}
        />,
      );
      expect(container.children).toMatchSnapshot();
    });
  });

  describe('render role listbox', () => {
    function createMenu() {
      return (
        <Menu
          className="myMenu"
          role="listbox"
          items={[
            {
              key: '1',
              label: '1',
              role: 'option',
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
        />
      );
    }

    it('renders menu correctly', () => {
      const { container } = render(createMenu());
      expect(container.children).toMatchSnapshot();
    });
  });

  it('set activeKey', () => {
    const genMenu = (props?) => (
      <Menu
        activeKey="1"
        {...props}
        items={[
          {
            key: '1',
            label: '1',
          },
          {
            key: '2',
            label: '2',
          },
        ]}
      />
    );

    const { container, rerender } = render(genMenu());
    isActive(container, 0);
    isActive(container, 1, false);

    rerender(genMenu({ activeKey: '2' }));
    isActive(container, 0, false);
    isActive(container, 1);
  });

  it('active first item', () => {
    const { container } = render(
      <Menu
        defaultActiveFirst
        items={[
          {
            key: '1',
            label: '1',
          },
          {
            key: '2',
            label: '2',
          },
        ]}
      />,
    );
    expect(container.querySelector('.rc-menu-item')).toHaveClass(
      'rc-menu-item-active',
    );
  });

  it('select multiple items', () => {
    const { container } = render(
      <Menu
        multiple
        items={[
          {
            key: '1',
            label: '1',
          },
          {
            key: '2',
            label: '2',
          },
        ]}
      />,
    );

    fireEvent.click(container.querySelector('.rc-menu-item'));
    fireEvent.click(last(container.querySelectorAll('.rc-menu-item')));

    expect(container.querySelectorAll('.rc-menu-item-selected')).toHaveLength(
      2,
    );
  });

  it('items support ref', () => {
    const ref1 = React.createRef<HTMLLIElement>();
    const ref2 = React.createRef<HTMLLIElement>();
    const ref3 = React.createRef<HTMLLIElement>();
    const ref4 = React.createRef<HTMLLIElement>();

    render(
      <Menu
        items={[
          {
            label: 'Top Menu Item',
            key: 'top',
            ref: ref1,
          },
          {
            type: 'group',
            label: 'Top Menu Group without children',
            ref: ref2,
          },
          {
            type: 'group',
            label: 'Top Menu Group with children',
            ref: ref3,
            children: [
              {
                label: 'Menu Item 1',
                key: 'inner1',
              },
              {
                type: 'divider',
              },
              {
                label: 'Menu Item 2',
                key: 'inner2',
                ref: ref4,
              },
            ],
          },
        ]}
      />,
    );

    expect(ref1.current.innerHTML).toBeTruthy();
    expect(ref2.current.innerHTML).toBeTruthy();
    expect(ref3.current.innerHTML).toBeTruthy();
    expect(ref4.current.innerHTML).toBeTruthy();
  });

  it('can be controlled by selectedKeys', () => {
    const genMenu = (props?) => (
      <Menu
        selectedKeys={['1']}
        {...props}
        items={[
          {
            key: '1',
            label: '1',
          },
          {
            key: '2',
            label: '2',
          },
        ]}
      />
    );
    const { container, rerender } = render(genMenu());
    expect(container.querySelector('li').className).toContain('-selected');
    rerender(genMenu({ selectedKeys: ['2'] }));
    expect(last(container.querySelectorAll('li')).className).toContain(
      '-selected',
    );
  });

  it('empty selectedKeys not to throw', () => {
    render(
      <Menu
        selectedKeys={null}
        items={[
          {
            key: 'foo',
            label: 'foo',
          },
        ]}
      />,
    );
  });

  it('not selectable', () => {
    const onSelect = jest.fn();

    const genMenu = (props?) => (
      <Menu
        onSelect={onSelect}
        selectedKeys={[]}
        {...props}
        items={[
          {
            key: 'bamboo',
            label: 'Bamboo',
          },
        ]}
      />
    );

    const { container, rerender } = render(genMenu());

    fireEvent.click(container.querySelector('.rc-menu-item'));

    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ selectedKeys: ['bamboo'] }),
    );

    onSelect.mockReset();
    rerender(genMenu({ selectable: false }));
    fireEvent.click(container.querySelector('.rc-menu-item'));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('select default item', () => {
    const { container } = render(
      <Menu
        defaultSelectedKeys={['1']}
        items={[
          {
            key: '1',
            label: '1',
          },
          {
            key: '2',
            label: '2',
          },
        ]}
      />,
    );
    expect(container.querySelector('li').className).toContain('-selected');
  });

  it('should support legacy string type selectedKeys', () => {
    // don't use selectedKeys as string
    // it is a compatible feature for https://github.com/ant-design/ant-design/issues/29429
    const { container } = render(
      <Menu
        selectedKeys={'item_abc' as unknown as string[]}
        items={[
          {
            key: 'item_a',
            label: '1',
          },
          {
            key: 'item_abc',
            label: '2',
          },
        ]}
      />,
    );
    expect(container.querySelector('li').className).not.toContain('-selected');
    expect(container.querySelectorAll('li')[1].className).toContain(
      '-selected',
    );
  });

  describe('openKeys', () => {
    it('can be controlled by openKeys', () => {
      const genMenu = (props?) => (
        <Menu
          openKeys={['g1']}
          {...props}
          items={[
            {
              key: 'g1',
              type: 'submenu',
              label: 'g1',
              children: [
                {
                  key: '1',
                  label: '1',
                },
              ],
            },
            {
              key: 'g2',
              type: 'submenu',
              label: 'g2',
              children: [
                {
                  key: '2',
                  label: '2',
                },
              ],
            },
          ]}
        />
      );
      const { container, rerender } = render(genMenu());

      expect(
        container.querySelectorAll('.rc-menu-submenu-vertical')[0],
      ).toHaveClass('rc-menu-submenu-open');
      expect(
        container.querySelectorAll('.rc-menu-submenu-vertical')[1],
      ).not.toHaveClass('rc-menu-submenu-open');

      rerender(genMenu({ openKeys: ['g2'] }));
      expect(
        container.querySelectorAll('.rc-menu-submenu-vertical')[0],
      ).not.toHaveClass('rc-menu-submenu-open');
      expect(
        container.querySelectorAll('.rc-menu-submenu-vertical')[1],
      ).toHaveClass('rc-menu-submenu-open');
    });

    it('openKeys should allow to be empty', () => {
      const { container } = render(
        <Menu
          onClick={() => {}}
          onOpenChange={() => {}}
          openKeys={undefined}
          selectedKeys={['1']}
          mode="inline"
          items={[
            {
              key: 'submenu',
              type: 'submenu',
              label: '1231',
              children: [
                {
                  key: 'item1',
                  label: (
                    <a>
                      <span>123123</span>
                    </a>
                  ),
                },
              ],
            },
          ]}
        />,
      );
      expect(container.innerHTML).toBeTruthy();
    });

    it('null of openKeys', () => {
      const { container } = render(
        <Menu
          openKeys={null}
          mode="inline"
          items={[
            {
              key: 'bamboo',
              type: 'submenu',
              label: 'Bamboo',
              children: [
                {
                  key: 'light',
                  label: 'Light',
                },
              ],
            },
          ]}
        />,
      );
      expect(container.innerHTML).toBeTruthy();
    });
  });

  it('open default submenu', () => {
    const { container } = render(
      <Menu
        defaultOpenKeys={['g1']}
        items={[
          {
            key: 'g1',
            type: 'submenu',
            label: 'g1',
            children: [
              {
                key: '1',
                label: '1',
              },
            ],
          },
          {
            key: 'g2',
            type: 'submenu',
            label: 'g2',
            children: [
              {
                key: '2',
                label: '2',
              },
            ],
          },
        ]}
      />,
    );

    act(() => {
      jest.runAllTimers();
    });

    expect(
      container.querySelectorAll('.rc-menu-submenu-vertical')[0],
    ).toHaveClass('rc-menu-submenu-open');
    expect(
      container.querySelectorAll('.rc-menu-submenu-vertical')[1],
    ).not.toHaveClass('rc-menu-submenu-open');
  });

  it('fires select event', () => {
    const handleSelect = jest.fn();
    const { container } = render(
      <Menu
        onSelect={handleSelect}
        items={[
          {
            key: '1',
            label: '1',
          },
          {
            key: '2',
            label: '2',
          },
        ]}
      />,
    );
    fireEvent.click(container.querySelector('.rc-menu-item'));
    expect(handleSelect.mock.calls[0][0].key).toBe('1');
  });

  it('fires click event', () => {
    resetWarned();

    const errorSpy = jest.spyOn(console, 'error');

    const handleClick = jest.fn();
    const { container } = render(
      <Menu
        onClick={handleClick}
        openKeys={['parent']}
        items={[
          {
            key: '1',
            label: '1',
          },
          {
            key: '2',
            label: '2',
          },
          {
            key: 'parent',
            type: 'submenu',
            label: 'parent',
            children: [
              {
                key: '3',
                label: '3',
              },
            ],
          },
        ]}
      />,
    );

    act(() => {
      jest.runAllTimers();
    });

    fireEvent.click(container.querySelector('.rc-menu-item'));
    const info = handleClick.mock.calls[0][0];
    expect(info.key).toBe('1');
    expect(info.item).toBeTruthy();

    expect(errorSpy).toHaveBeenCalledWith(
      'Warning: `info.item` is deprecated since we will move to function component that not provides React Node instance in future.',
    );

    handleClick.mockReset();
    fireEvent.click(last(container.querySelectorAll('.rc-menu-item')));
    expect(handleClick.mock.calls[0][0].keyPath).toEqual(['3', 'parent']);

    errorSpy.mockRestore();
  });

  it('fires deselect event', () => {
    const handleDeselect = jest.fn();
    const { container } = render(
      <Menu
        multiple
        onDeselect={handleDeselect}
        items={[
          {
            key: '1',
            label: '1',
          },
          {
            key: '2',
            label: '2',
          },
        ]}
      />,
    );
    const item = container.querySelector('.rc-menu-item');
    fireEvent.click(item);
    fireEvent.click(item);
    expect(handleDeselect.mock.calls[0][0].key).toBe('1');
  });

  it('active by mouse enter', () => {
    const { container } = render(
      <Menu
        items={[
          {
            key: 'item1',
            label: 'item',
          },
          {
            key: 'disabled',
            label: 'disabled',
            disabled: true,
          },
          {
            key: 'item2',
            label: 'item2',
          },
        ]}
      />,
    );
    fireEvent.mouseEnter(last(container.querySelectorAll('.rc-menu-item')));
    isActive(container, 2);
  });

  it('active by key down', () => {
    const genMenu = (props?) => (
      <Menu
        activeKey="1"
        {...props}
        items={[
          {
            key: '1',
            label: '1',
          },
          {
            key: '2',
            label: '2',
          },
        ]}
      />
    );
    const { container, rerender } = render(genMenu());

    // KeyDown will not change activeKey since control
    fireEvent.keyDown(container.querySelector('.rc-menu-root'), {
      which: KeyCode.DOWN,
      keyCode: KeyCode.DOWN,
      charCode: KeyCode.DOWN,
    });
    isActive(container, 0);

    rerender(genMenu({ activeKey: '2' }));
    isActive(container, 1);
  });

  it('defaultActiveFirst', () => {
    const { container } = render(
      <Menu
        selectedKeys={['foo']}
        defaultActiveFirst
        items={[
          {
            key: 'foo',
            label: 'foo',
          },
        ]}
      />,
    );
    isActive(container, 0);
  });

  it('should accept builtinPlacements', () => {
    const builtinPlacements = {
      leftTop: {
        points: ['tr', 'tl'],
        overflow: {
          adjustX: 0,
          adjustY: 0,
        },
        offset: [0, 0],
      },
    };

    render(
      <Menu
        builtinPlacements={builtinPlacements}
        items={[
          {
            key: '1',
            label: 'menuItem',
          },
          {
            key: '2',
            type: 'submenu',
            label: 'submenu',
            children: [
              {
                key: '3',
                label: 'menuItem',
              },
            ],
          },
        ]}
      />,
    );

    expect(global.triggerProps.builtinPlacements.leftTop).toEqual(
      builtinPlacements.leftTop,
    );
  });

  describe('motion', () => {
    const defaultMotions = {
      inline: { motionName: 'inlineMotion' },
      horizontal: { motionName: 'horizontalMotion' },
      other: { motionName: 'defaultMotion' },
    };

    it('defaultMotions should work correctly', () => {
      const genMenu = (props?) => (
        <Menu
          mode="inline"
          defaultMotions={defaultMotions}
          {...props}
          items={[
            {
              key: 'bamboo',
              type: 'submenu',
              children: [
                {
                  key: 'light',
                  label: '',
                },
              ],
            },
          ]}
        />
      );

      const { rerender } = render(genMenu());

      // Inline
      rerender(genMenu({ mode: 'inline' }));
      expect(global.motionProps.motionName).toEqual('inlineMotion');

      // Horizontal
      rerender(genMenu({ mode: 'horizontal' }));
      expect(global.triggerProps.popupMotion.motionName).toEqual(
        'horizontalMotion',
      );

      // Default
      rerender(genMenu({ mode: 'vertical' }));
      expect(global.triggerProps.popupMotion.motionName).toEqual(
        'defaultMotion',
      );
    });

    it('motion is first level', () => {
      const genMenu = (props?) => (
        <Menu
          mode="inline"
          defaultMotions={defaultMotions}
          motion={{ motionName: 'bambooLight' }}
          {...props}
          items={[
            {
              key: 'bamboo',
              type: 'submenu',
              children: [
                {
                  key: 'light',
                  label: '',
                },
              ],
            },
          ]}
        />
      );
      const { rerender } = render(genMenu());

      // Inline
      rerender(genMenu({ mode: 'inline' }));
      expect(global.motionProps.motionName).toEqual('bambooLight');

      // Horizontal
      rerender(genMenu({ mode: 'horizontal' }));
      expect(global.triggerProps.popupMotion.motionName).toEqual('bambooLight');

      // Default
      rerender(genMenu({ mode: 'vertical' }));
      expect(global.triggerProps.popupMotion.motionName).toEqual('bambooLight');
    });

    it('inline does not affect vertical motion', () => {
      const genMenu = (props?) => (
        <Menu
          defaultMotions={defaultMotions}
          {...props}
          items={[
            {
              key: 'bamboo',
              type: 'submenu',
              children: [
                {
                  key: 'light',
                  label: '',
                },
              ],
            },
          ]}
        />
      );

      const { rerender } = render(genMenu({ mode: 'vertical' }));
      rerender(genMenu({ mode: 'inline' }));
      expect(global.triggerProps.popupMotion.motionName).toEqual(
        'defaultMotion',
      );
    });
  });

  it('onMouseEnter should work', () => {
    const onMouseEnter = jest.fn();
    const { container } = render(
      <Menu
        onMouseEnter={onMouseEnter}
        defaultSelectedKeys={['test1']}
        items={[
          {
            key: 'test1',
            label: 'Navigation One',
          },
          {
            key: 'test2',
            label: 'Navigation Two',
          },
        ]}
      />,
    );

    fireEvent.mouseEnter(container.querySelector('.rc-menu-root'));
    expect(onMouseEnter).toHaveBeenCalled();
  });

  it('Nest children active should bump to top', async () => {
    const { container } = render(
      <Menu
        activeKey="light"
        mode="vertical"
        items={[
          {
            key: 'bamboo',
            type: 'submenu',
            label: 'Bamboo',
            children: [
              {
                key: 'light',
                label: 'Light',
              },
            ],
          },
        ]}
      />,
    );

    expect(container.querySelector('.rc-menu-submenu-active')).toBeTruthy();
  });

  it('not warning on destroy', async () => {
    const errorSpy = jest.spyOn(console, 'error');

    const { unmount } = render(
      <Menu
        items={[
          {
            key: 'bamboo',
            label: 'Bamboo',
          },
        ]}
      />,
    );

    unmount();

    await Promise.resolve();

    expect(errorSpy).not.toHaveBeenCalled();

    errorSpy.mockRestore();
  });

  describe('Click should close Menu', () => {
    function test(name, props?) {
      it(name, async () => {
        const onOpenChange = jest.fn();

        const { container } = render(
          <Menu
            openKeys={['bamboo']}
            mode="vertical"
            onOpenChange={onOpenChange}
            {...props}
            items={[
              {
                key: 'bamboo',
                type: 'submenu',
                label: 'Bamboo',
                children: [
                  {
                    key: 'light',
                    label: 'Light',
                  },
                ],
              },
            ]}
          />,
        );

        // Open menu
        await act(async () => {
          jest.runAllTimers();
        });

        // wrapper.find('.rc-menu-item').last().simulate('click');
        fireEvent.click(last(container.querySelectorAll('.rc-menu-item')));
        expect(onOpenChange).toHaveBeenCalledWith([]);
      });
    }

    test('basic');
    test('not selectable', { selectable: false });
    test('inlineCollapsed', { mode: 'inline', inlineCollapsed: true });

    it('not close inline', async () => {
      const onOpenChange = jest.fn();

      const { container } = render(
        <Menu
          openKeys={['bamboo']}
          mode="inline"
          onOpenChange={onOpenChange}
          items={[
            {
              key: 'bamboo',
              type: 'submenu',
              label: 'Bamboo',
              children: [
                {
                  key: 'light',
                  label: 'Light',
                },
              ],
            },
          ]}
        />,
      );

      // Open menu
      await act(async () => {
        jest.runAllTimers();
      });

      fireEvent.click(last(container.querySelectorAll('.rc-menu-item')));
      expect(onOpenChange).not.toHaveBeenCalled();
    });
  });

  it('should support ref', () => {
    const menuRef = React.createRef<MenuRef>();
    const { container } = render(
      <Menu
        ref={menuRef}
        items={[
          {
            key: 'light',
            label: 'Light',
          },
        ]}
      />,
    );

    expect(menuRef.current?.list).toBe(container.querySelector('ul'));
    act(() => menuRef.current.focus());
    expect(document.activeElement).toBe(container.querySelector('li'));
  });

  it('should render a divider with role="separator"', () => {
    const menuRef = React.createRef<MenuRef>();
    const { container } = render(
      <Menu
        ref={menuRef}
        activeKey="cat"
        items={[
          {
            key: 'light',
            label: 'Light',
          },
          {
            type: 'divider',
          },
          {
            key: 'cat',
            label: 'Cat',
          },
        ]}
      />,
    );
    // Get the divider element with the rc-menu-item-divider class
    const divider = container.querySelector('.rc-menu-item-divider');

    // Assert that the divider element with rc-menu-item-divider class has role="separator"
    expect(divider).toHaveAttribute('role', 'separator');
  });

  it('expandIcon should be hidden when setting null or false', () => {
    const App = ({
      expand,
      subExpand,
    }: {
      expand?: React.ReactNode;
      subExpand?: React.ReactNode;
    }) => (
      <Menu
        expandIcon={expand}
        items={[
          {
            key: '1',
            type: 'submenu',
            label: 'sub menu',
            expandIcon: subExpand,
            children: [
              {
                key: '1-1',
                label: '0-1',
              },
              {
                key: '1-2',
                label: '0-2',
              },
            ],
          },
          {
            key: '2',
            type: 'submenu',
            label: 'sub menu2',
            children: [
              {
                key: '2-1',
                label: '0-1',
              },
              {
                key: '2-2',
                label: '0-2',
              },
            ],
          },
          {
            key: 'cat',
            label: 'Cat',
          },
        ]}
      />
    );

    const { container, rerender } = render(
      <App expand={null} subExpand={undefined} />,
    );
    expect(container.querySelectorAll('.rc-menu-submenu-arrow').length).toBe(0);

    rerender(<App expand={null} subExpand />);
    expect(container.querySelectorAll('.rc-menu-submenu-arrow').length).toBe(1);

    rerender(<App />);
    expect(container.querySelectorAll('.rc-menu-submenu-arrow').length).toBe(2);

    rerender(<App expand={false} subExpand={undefined} />);
    expect(container.querySelectorAll('.rc-menu-submenu-arrow').length).toBe(0);

    rerender(<App expand={false} subExpand />);
    expect(container.querySelectorAll('.rc-menu-submenu-arrow').length).toBe(1);
  });
});
/* eslint-enable */
