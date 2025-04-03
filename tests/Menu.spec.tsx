/* eslint-disable no-undef, react/no-multi-comp, react/jsx-curly-brace-presence, max-classes-per-file */
import type { MenuMode } from '@/interface';
import { fireEvent, render } from '@testing-library/react';
import KeyCode from '@rc-component/util/lib/KeyCode';
import { resetWarned } from '@rc-component/util/lib/warning';
import React from 'react';
import { act } from 'react-dom/test-utils';
import type { MenuRef } from '../src';
import Menu, { Divider, MenuItem, MenuItemGroup, SubMenu } from '../src';
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

jest.mock('@rc-component/motion', () => {
  const react = require('react');
  let Motion = jest.requireActual('@rc-component/motion');
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
        <Menu disabledOverflow className="myMenu" openAnimation="fade" {...props}>
          <MenuItemGroup title="g1">
            <MenuItem key="1">1</MenuItem>
            <Divider />
            <MenuItem key="2">2</MenuItem>
          </MenuItemGroup>
          <MenuItem key="3">3</MenuItem>
          <MenuItemGroup title="g2">
            <MenuItem key="4">4</MenuItem>
            <MenuItem key="5" disabled>
              5
            </MenuItem>
          </MenuItemGroup>
          <SubMenu key={subKey} title="submenu">
            <MenuItem key="6">6</MenuItem>
          </SubMenu>
        </Menu>
      );
    }

    it('popup with rtl has correct className', () => {
      const { container, unmount } = render(
        createMenu({ mode: 'vertical', direction: 'rtl', openKeys: ['sub'] }, 'sub'),
      );

      act(() => {
        jest.runAllTimers();
      });

      expect(container.querySelector('.rc-menu-submenu-popup .rc-menu-rtl')).toBeTruthy();

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
            <Menu mode={mode}>
              <SubMenu />
            </Menu>,
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
        <Menu>
          <SubMenu title="submenu">
            <MenuItem key="6">6</MenuItem>
          </SubMenu>
          <MenuItem key="7">6</MenuItem>
          <>
            <SubMenu title="submenu">
              <MenuItem key="8">6</MenuItem>
            </SubMenu>
            <MenuItem key="9">6</MenuItem>
          </>
        </Menu>,
      );
      expect(container.children).toMatchSnapshot();
    });
  });

  describe('render role listbox', () => {
    function createMenu() {
      return (
        <Menu className="myMenu" role="listbox">
          <MenuItem key="1" role="option">
            1
          </MenuItem>
          <MenuItem key="2" role="option">
            2
          </MenuItem>
          <MenuItem key="3" role="option">
            3
          </MenuItem>
        </Menu>
      );
    }

    it('renders menu correctly', () => {
      const { container } = render(createMenu());
      expect(container.children).toMatchSnapshot();
    });
  });

  it('set activeKey', () => {
    const genMenu = (props?) => (
      <Menu activeKey="1" {...props}>
        <MenuItem key="1">1</MenuItem>
        <MenuItem key="2">2</MenuItem>
      </Menu>
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
      <Menu defaultActiveFirst>
        <MenuItem key="1">1</MenuItem>
        <MenuItem key="2">2</MenuItem>
      </Menu>,
    );
    expect(container.querySelector('.rc-menu-item')).toHaveClass('rc-menu-item-active');
  });

  it('should render none menu item children', () => {
    expect(() => {
      render(
        <Menu activeKey="1">
          <MenuItem key="1">1</MenuItem>
          <MenuItem key="2">2</MenuItem>
          string
          {'string'}
          {null}
          {undefined}
          {12345}
          <div />
          <input />
        </Menu>,
      );
    }).not.toThrow();
  });

  it('select multiple items', () => {
    const { container } = render(
      <Menu multiple>
        <MenuItem key="1">1</MenuItem>
        <MenuItem key="2">2</MenuItem>
      </Menu>,
    );

    fireEvent.click(container.querySelector('.rc-menu-item'));
    fireEvent.click(last(container.querySelectorAll('.rc-menu-item')));

    expect(container.querySelectorAll('.rc-menu-item-selected')).toHaveLength(2);
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
      <Menu selectedKeys={['1']} {...props}>
        <MenuItem key="1">1</MenuItem>
        <MenuItem key="2">2</MenuItem>
      </Menu>
    );
    const { container, rerender } = render(genMenu());
    expect(container.querySelector('li').className).toContain('-selected');
    rerender(genMenu({ selectedKeys: ['2'] }));
    expect(last(container.querySelectorAll('li')).className).toContain('-selected');
  });

  it('empty selectedKeys not to throw', () => {
    render(
      <Menu selectedKeys={null}>
        <MenuItem key="foo">foo</MenuItem>
      </Menu>,
    );
  });

  it('not selectable', () => {
    const onSelect = jest.fn();

    const genMenu = (props?) => (
      <Menu onSelect={onSelect} selectedKeys={[]} {...props}>
        <MenuItem key="bamboo">Bamboo</MenuItem>
      </Menu>
    );

    const { container, rerender } = render(genMenu());

    fireEvent.click(container.querySelector('.rc-menu-item'));

    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ selectedKeys: ['bamboo'] }));

    onSelect.mockReset();
    rerender(genMenu({ selectable: false }));
    fireEvent.click(container.querySelector('.rc-menu-item'));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('select default item', () => {
    const { container } = render(
      <Menu defaultSelectedKeys={['1']}>
        <MenuItem key="1">1</MenuItem>
        <MenuItem key="2">2</MenuItem>
      </Menu>,
    );
    expect(container.querySelector('li').className).toContain('-selected');
  });

  it('should support legacy string type selectedKeys', () => {
    // don't use selectedKeys as string
    // it is a compatible feature for https://github.com/ant-design/ant-design/issues/29429
    const { container } = render(
      <Menu selectedKeys={'item_abc' as unknown as string[]}>
        <MenuItem key="item_a">1</MenuItem>
        <MenuItem key="item_abc">2</MenuItem>
      </Menu>,
    );
    expect(container.querySelector('li').className).not.toContain('-selected');
    expect(container.querySelectorAll('li')[1].className).toContain('-selected');
  });

  describe('openKeys', () => {
    it('can be controlled by openKeys', () => {
      const genMenu = (props?) => (
        <Menu openKeys={['g1']} {...props}>
          <Menu.SubMenu key="g1">
            <MenuItem key="1">1</MenuItem>
          </Menu.SubMenu>
          <Menu.SubMenu key="g2">
            <MenuItem key="2">2</MenuItem>
          </Menu.SubMenu>
        </Menu>
      );
      const { container, rerender } = render(genMenu());

      expect(container.querySelectorAll('.rc-menu-submenu-vertical')[0]).toHaveClass(
        'rc-menu-submenu-open',
      );
      expect(container.querySelectorAll('.rc-menu-submenu-vertical')[1]).not.toHaveClass(
        'rc-menu-submenu-open',
      );

      rerender(genMenu({ openKeys: ['g2'] }));
      expect(container.querySelectorAll('.rc-menu-submenu-vertical')[0]).not.toHaveClass(
        'rc-menu-submenu-open',
      );
      expect(container.querySelectorAll('.rc-menu-submenu-vertical')[1]).toHaveClass(
        'rc-menu-submenu-open',
      );
    });

    it('openKeys should allow to be empty', () => {
      const { container } = render(
        <Menu
          onClick={() => {}}
          onOpenChange={() => {}}
          openKeys={undefined}
          selectedKeys={['1']}
          mode="inline"
        >
          <SubMenu title="1231">
            <MenuItem>
              <a>
                <span>123123</span>
              </a>
            </MenuItem>
          </SubMenu>
        </Menu>,
      );
      expect(container.innerHTML).toBeTruthy();
    });

    it('null of openKeys', () => {
      const { container } = render(
        <Menu openKeys={null} mode="inline">
          <SubMenu key="bamboo" title="Bamboo">
            <MenuItem key="light">Light</MenuItem>
          </SubMenu>
        </Menu>,
      );
      expect(container.innerHTML).toBeTruthy();
    });
  });

  it('open default submenu', () => {
    const { container } = render(
      <Menu defaultOpenKeys={['g1']}>
        <SubMenu key="g1">
          <MenuItem key="1">1</MenuItem>
        </SubMenu>
        <SubMenu key="g2">
          <MenuItem key="2">2</MenuItem>
        </SubMenu>
      </Menu>,
    );

    act(() => {
      jest.runAllTimers();
    });

    expect(container.querySelectorAll('.rc-menu-submenu-vertical')[0]).toHaveClass(
      'rc-menu-submenu-open',
    );
    expect(container.querySelectorAll('.rc-menu-submenu-vertical')[1]).not.toHaveClass(
      'rc-menu-submenu-open',
    );
  });

  it('fires select event', () => {
    const handleSelect = jest.fn();
    const { container } = render(
      <Menu onSelect={handleSelect}>
        <MenuItem key="1">1</MenuItem>
        <MenuItem key="2">2</MenuItem>
      </Menu>,
    );
    fireEvent.click(container.querySelector('.rc-menu-item'));
    expect(handleSelect.mock.calls[0][0].key).toBe('1');
  });

  it('fires click event', () => {
    resetWarned();

    const errorSpy = jest.spyOn(console, 'error');

    const handleClick = jest.fn();
    const { container } = render(
      <Menu onClick={handleClick} openKeys={['parent']}>
        <MenuItem key="1">1</MenuItem>
        <MenuItem key="2">2</MenuItem>
        <Menu.SubMenu key="parent">
          <MenuItem key="3">3</MenuItem>
        </Menu.SubMenu>
      </Menu>,
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
      <Menu multiple onDeselect={handleDeselect}>
        <MenuItem key="1">1</MenuItem>
        <MenuItem key="2">2</MenuItem>
      </Menu>,
    );
    const item = container.querySelector('.rc-menu-item');
    fireEvent.click(item);
    fireEvent.click(item);
    expect(handleDeselect.mock.calls[0][0].key).toBe('1');
  });

  it('active by mouse enter', () => {
    const { container } = render(
      <Menu>
        <MenuItem key="item1">item</MenuItem>
        <MenuItem disabled>disabled</MenuItem>
        <MenuItem key="item2">item2</MenuItem>
      </Menu>,
    );
    // wrapper.find('li').last().simulate('mouseEnter');
    fireEvent.mouseEnter(last(container.querySelectorAll('.rc-menu-item')));
    // expect(wrapper.isActive(2)).toBeTruthy();
    isActive(container, 2);
  });

  it('active by key down', () => {
    const genMenu = (props?) => (
      <Menu activeKey="1" {...props}>
        <MenuItem key="1">1</MenuItem>
        <MenuItem key="2">2</MenuItem>
      </Menu>
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
      <Menu selectedKeys={['foo']} defaultActiveFirst>
        <MenuItem key="foo">foo</MenuItem>
      </Menu>,
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
      <Menu builtinPlacements={builtinPlacements}>
        <MenuItem>menuItem</MenuItem>
        <SubMenu title="submenu">
          <MenuItem>menuItem</MenuItem>
        </SubMenu>
      </Menu>,
    );

    expect(global.triggerProps.builtinPlacements.leftTop).toEqual(builtinPlacements.leftTop);
  });

  describe('motion', () => {
    const defaultMotions = {
      inline: { motionName: 'inlineMotion' },
      horizontal: { motionName: 'horizontalMotion' },
      other: { motionName: 'defaultMotion' },
    };

    it('defaultMotions should work correctly', () => {
      const genMenu = (props?) => (
        <Menu mode="inline" defaultMotions={defaultMotions} {...props}>
          <SubMenu key="bamboo">
            <MenuItem key="light" />
          </SubMenu>
        </Menu>
      );

      const { rerender } = render(genMenu());

      // Inline
      rerender(genMenu({ mode: 'inline' }));
      expect(global.motionProps.motionName).toEqual('inlineMotion');

      // Horizontal
      rerender(genMenu({ mode: 'horizontal' }));
      expect(global.triggerProps.popupMotion.motionName).toEqual('horizontalMotion');

      // Default
      rerender(genMenu({ mode: 'vertical' }));
      expect(global.triggerProps.popupMotion.motionName).toEqual('defaultMotion');
    });

    it('motion is first level', () => {
      const genMenu = (props?) => (
        <Menu
          mode="inline"
          defaultMotions={defaultMotions}
          motion={{ motionName: 'bambooLight' }}
          {...props}
        >
          <SubMenu key="bamboo">
            <MenuItem key="light" />
          </SubMenu>
        </Menu>
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
        <Menu defaultMotions={defaultMotions} {...props}>
          <SubMenu key="bamboo">
            <MenuItem key="light" />
          </SubMenu>
        </Menu>
      );

      const { rerender } = render(genMenu({ mode: 'vertical' }));
      rerender(genMenu({ mode: 'inline' }));
      expect(global.triggerProps.popupMotion.motionName).toEqual('defaultMotion');
    });
  });

  it('onMouseEnter should work', () => {
    const onMouseEnter = jest.fn();
    const { container } = render(
      <Menu onMouseEnter={onMouseEnter} defaultSelectedKeys={['test1']}>
        <MenuItem key="test1">Navigation One</MenuItem>
        <MenuItem key="test2">Navigation Two</MenuItem>
      </Menu>,
    );

    fireEvent.mouseEnter(container.querySelector('.rc-menu-root'));
    expect(onMouseEnter).toHaveBeenCalled();
  });

  it('Nest children active should bump to top', async () => {
    const { container } = render(
      <Menu activeKey="light" mode="vertical">
        <SubMenu key="bamboo" title="Bamboo">
          <MenuItem key="light">Light</MenuItem>
        </SubMenu>
      </Menu>,
    );

    expect(container.querySelector('.rc-menu-submenu-active')).toBeTruthy();
  });

  it('not warning on destroy', async () => {
    const errorSpy = jest.spyOn(console, 'error');

    const { unmount } = render(
      <Menu>
        <MenuItem key="bamboo">Bamboo</MenuItem>
      </Menu>,
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
          <Menu openKeys={['bamboo']} mode="vertical" onOpenChange={onOpenChange} {...props}>
            <SubMenu key="bamboo" title="Bamboo">
              <MenuItem key="light">Light</MenuItem>
            </SubMenu>
          </Menu>,
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
        <Menu openKeys={['bamboo']} mode="inline" onOpenChange={onOpenChange}>
          <SubMenu key="bamboo" title="Bamboo">
            <MenuItem key="light">Light</MenuItem>
          </SubMenu>
        </Menu>,
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
      <Menu ref={menuRef}>
        <MenuItem key="light">Light</MenuItem>
      </Menu>,
    );

    expect(menuRef.current?.list).toBe(container.querySelector('ul'));
    act(() => menuRef.current.focus());
    expect(document.activeElement).toBe(container.querySelector('li'));
  });

  it('should render a divider with role="separator"', () => {
    const menuRef = React.createRef<MenuRef>();
    const { container } = render(
      <Menu ref={menuRef} activeKey="cat">
        <MenuItem key="light">Light</MenuItem>
        <Divider />
        <MenuItem key="cat">Cat</MenuItem>
      </Menu>,
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
      <Menu expandIcon={expand}>
        <SubMenu title="sub menu" key="1" expandIcon={subExpand}>
          <MenuItem key="1-1">0-1</MenuItem>
          <MenuItem key="1-2">0-2</MenuItem>
        </SubMenu>
        ,
        <SubMenu title="sub menu2" key="2">
          <MenuItem key="2-1">0-1</MenuItem>
          <MenuItem key="2-2">0-2</MenuItem>
        </SubMenu>
        ,<MenuItem key="cat">Cat</MenuItem>
      </Menu>
    );

    const { container, rerender } = render(<App expand={null} subExpand={undefined} />);
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

  it('should find item by key', () => {
    const menuRef = React.createRef<MenuRef>();
    const { container } = render(
      <Menu ref={menuRef}>
        <MenuItem key="light">Light</MenuItem>
        <MenuItem key="cat">Cat</MenuItem>
      </Menu>,
    );

    const lightItem = menuRef.current?.findItem({ key: 'light' });
    const catItem = menuRef.current?.findItem({ key: 'cat' });
    const nonExistentItem = menuRef.current?.findItem({ key: 'dog' });

    expect(lightItem).toBe(container.querySelectorAll('li')[0]);
    expect(catItem).toBe(container.querySelectorAll('li')[1]);
    expect(nonExistentItem).toBe(null);
  });
});
/* eslint-enable */
