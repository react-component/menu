/* eslint-disable no-undef, react/no-multi-comp, react/jsx-curly-brace-presence */
import { act, fireEvent, render } from '@testing-library/react';
import Menu, { MenuItem, SubMenu } from '../src';

describe('Menu.Collapsed', () => {
  describe('inlineCollapse and siderCollapsed', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should always follow openKeys when mode is switched', () => {
      const genMenu = props => (
        <Menu openKeys={['1']} mode="inline" {...props}>
          <SubMenu key="1" title="submenu1">
            <MenuItem key="submenu1">Option 1</MenuItem>
            <MenuItem key="submenu2">Option 2</MenuItem>
          </SubMenu>
          <MenuItem key="2">menu2</MenuItem>
        </Menu>
      );

      const { container, rerender } = render(genMenu());

      // Inline
      expect(container.querySelector('ul.rc-menu-sub')).not.toHaveClass(
        'rc-menu-hidden',
      );

      // Vertical
      rerender(genMenu({ mode: 'vertical' }));
      act(() => {
        jest.runAllTimers();
      });
      expect(container.querySelector('ul.rc-menu-sub')).not.toHaveClass(
        'rc-menu-hidden',
      );

      // Inline
      rerender(genMenu({ mode: 'inline' }));
      expect(container.querySelector('ul.rc-menu-sub')).not.toHaveClass(
        'rc-menu-hidden',
      );
    });

    it('should always follow submenu popup hidden when mode is switched', () => {
      const genMenu = props => (
        <Menu mode="vertical" {...props}>
          <SubMenu key="1" title="submenu1">
            <SubMenu key="1-1" title="submenu1-1">
              <MenuItem key="Option-1">Option 1</MenuItem>
            </SubMenu>
          </SubMenu>
        </Menu>
      );

      const { container, rerender } = render(genMenu());

      // Hover submenu1
      fireEvent.mouseEnter(
        container.querySelectorAll('.rc-menu-submenu-title')[0],
      );

      act(() => {
        jest.runAllTimers();
      });
      act(() => {
        jest.runAllTimers();
      });

      // Hover submenu1-1
      fireEvent.mouseEnter(
        container.querySelectorAll('.rc-menu-submenu-title')[1],
      );

      act(() => {
        jest.runAllTimers();
      });
      act(() => {
        jest.runAllTimers();
      });

      rerender(genMenu({ mode: 'inline' }));

      // Click submenu1
      fireEvent.click(container.querySelectorAll('.rc-menu-submenu-title')[0]);
      // Click submenu1-1
      fireEvent.click(container.querySelectorAll('.rc-menu-submenu-title')[2]);

      act(() => {
        jest.runAllTimers();
      });

      expect(container.querySelectorAll('.rc-menu-submenu')[3]).toHaveClass(
        'rc-menu-submenu-hidden',
      );
    });

    it('should always follow openKeys when inlineCollapsed is switched', () => {
      const genMenu = props => (
        <Menu defaultOpenKeys={['1']} mode="inline" {...props}>
          <MenuItem key="menu1">
            <span>Option</span>
          </MenuItem>
          <SubMenu key="1" title="submenu1">
            <MenuItem key="submenu1">Option</MenuItem>
            <MenuItem key="submenu2">Option</MenuItem>
          </SubMenu>
        </Menu>
      );

      const { container, rerender } = render(genMenu());
      expect(container.querySelector('ul.rc-menu-sub')).toHaveClass(
        'rc-menu-inline',
      );
      expect(container.querySelector('ul.rc-menu-sub')).not.toHaveClass(
        'rc-menu-hidden',
      );

      rerender(genMenu({ inlineCollapsed: true }));
      // 动画结束后套样式;
      act(() => {
        jest.runAllTimers();
      });
      fireEvent.transitionEnd(container.querySelector('.rc-menu-root'), {
        propertyName: 'width',
      });

      // Flush SubMenu raf state update
      act(() => {
        jest.runAllTimers();
      });

      expect(container.querySelector('ul.rc-menu-root')).toHaveClass(
        'rc-menu-vertical',
      );
      expect(container.querySelectorAll('ul.rc-menu-sub')).toHaveLength(0);

      rerender(genMenu({ inlineCollapsed: false }));
      act(() => {
        jest.runAllTimers();
      });

      expect(container.querySelector('ul.rc-menu-sub')).toHaveClass(
        'rc-menu-inline',
      );
      expect(container.querySelector('ul.rc-menu-sub')).not.toHaveClass(
        'rc-menu-hidden',
      );
    });

    it('inlineCollapsed should works well when specify a not existed default openKeys', () => {
      const genMenu = props => (
        <Menu defaultOpenKeys={['not-existed']} mode="inline" {...props}>
          <MenuItem key="menu1">
            <span>Option</span>
          </MenuItem>
          <SubMenu key="1" title="submenu1">
            <MenuItem key="submenu1">Option</MenuItem>
            <MenuItem key="submenu2">Option</MenuItem>
          </SubMenu>
        </Menu>
      );

      const { container, rerender } = render(genMenu());
      expect(container.querySelectorAll('.rc-menu-sub')).toHaveLength(0);

      // Do collapsed
      rerender(genMenu({ inlineCollapsed: true }));

      act(() => {
        jest.runAllTimers();
      });

      //   wrapper
      //     .find('Overflow')
      //     .simulate('transitionEnd', { propertyName: 'width' });
      fireEvent.transitionEnd(container.querySelector('.rc-menu-root'), {
        propertyName: 'width',
      });

      // Wait internal raf work
      act(() => {
        jest.runAllTimers();
      });

      // Hover to show
      //   wrapper.find('.rc-menu-submenu-title').at(0).simulate('mouseEnter');
      fireEvent.mouseEnter(container.querySelector('.rc-menu-submenu-title'));

      act(() => {
        jest.runAllTimers();
      });
      act(() => {
        jest.runAllTimers();
      });

      expect(container.querySelector('.rc-menu-submenu')).toHaveClass(
        'rc-menu-submenu-vertical',
      );

      expect(container.querySelector('.rc-menu-submenu')).toHaveClass(
        'rc-menu-submenu-open',
      );

      expect(container.querySelector('ul.rc-menu-sub')).toHaveClass(
        'rc-menu-vertical',
      );
      expect(container.querySelector('ul.rc-menu-sub')).not.toHaveClass(
        'rc-menu-hidden',
      );
    });

    it('inlineCollapsed MenuItem Tooltip can be removed', () => {
      const { container } = render(
        <Menu
          defaultOpenKeys={['not-existed']}
          mode="inline"
          inlineCollapsed
          getPopupContainer={node => node.parentNode}
        >
          <MenuItem key="menu1">item</MenuItem>
          <MenuItem key="menu2" title="title">
            item
          </MenuItem>
          <MenuItem key="menu3" title={undefined}>
            item
          </MenuItem>
          <MenuItem key="menu4" title={null}>
            item
          </MenuItem>
          <MenuItem key="menu5" title="">
            item
          </MenuItem>
          <MenuItem key="menu6" title={false}>
            item
          </MenuItem>
        </Menu>,
      );

      expect(
        Array.from(container.querySelectorAll('.rc-menu-item')).map(
          node => node.title,
        ),
      ).toEqual(['', 'title', '', '', '', '']);
    });

    // https://github.com/ant-design/ant-design/issues/18825
    // https://github.com/ant-design/ant-design/issues/8587
    it('should keep selectedKeys in state when collapsed to 0px', () => {
      const genMenu = props => (
        <Menu
          mode="inline"
          inlineCollapsed={false}
          defaultSelectedKeys={['1']}
          openKeys={['3']}
          {...props}
        >
          <MenuItem key="1">Option 1</MenuItem>
          <MenuItem key="2">Option 2</MenuItem>
          <SubMenu key="3" title="Option 3">
            <MenuItem key="4">Option 4</MenuItem>
          </SubMenu>
        </Menu>
      );

      const { container, rerender } = render(genMenu());

      // Default
      expect(
        container.querySelector('.rc-menu-item-selected').textContent,
      ).toBe('Option 1');

      // Click to change select
      fireEvent.click(container.querySelectorAll('.rc-menu-item')[1]);
      expect(
        container.querySelector('.rc-menu-item-selected').textContent,
      ).toBe('Option 2');

      // Collapse it
      rerender(genMenu({ inlineCollapsed: true }));
      act(() => {
        jest.runAllTimers();
      });

      // Open since controlled
      expect(container.querySelector('.rc-menu-submenu-popup')).toBeTruthy();

      // Expand it
      rerender(genMenu({ inlineCollapsed: false }));
      expect(
        container.querySelector('.rc-menu-item-selected').textContent,
      ).toBe('Option 2');
    });

    it('should hideMenu in initial state when collapsed', () => {
      const genMenu = props => (
        <Menu
          mode="inline"
          inlineCollapsed
          defaultSelectedKeys={['1']}
          openKeys={['3']}
          {...props}
        >
          <MenuItem key="1">Option 1</MenuItem>
          <MenuItem key="2">Option 2</MenuItem>
          <SubMenu key="3" title="Option 3">
            <MenuItem key="4">Option 4</MenuItem>
          </SubMenu>
        </Menu>
      );

      const { container, rerender } = render(genMenu());

      act(() => {
        jest.runAllTimers();
      });

      expect(container.querySelector('.rc-menu-submenu-popup')).toBeTruthy();

      rerender(genMenu({ inlineCollapsed: false }));
      act(() => {
        jest.runAllTimers();
      });

      expect(
        container.querySelector('.rc-menu-item-selected').textContent,
      ).toBe('Option 1');
    });

    it('vertical also support inlineCollapsed', () => {
      const { container } = render(<Menu mode="vertical" inlineCollapsed />);

      expect(container.querySelector('.rc-menu-inline-collapsed')).toBeTruthy();
    });
  });
});
/* eslint-enable */
