import { act, fireEvent, render } from '@testing-library/react';
import { KeyCode } from '@rc-component/util';
import React from 'react';
import Menu, { MenuItem, SubMenu } from '../src';

describe('Disabled menu keyboard selection', () => {
  it('ignores Enter after a focused item becomes disabled', () => {
    const onSelect = jest.fn();
    const menu = (disabled = false) => (
      <Menu disabled={disabled} defaultSelectedKeys={['apple']} onSelect={onSelect}>
        <MenuItem key="apple">Apple</MenuItem>
        <MenuItem key="orange">Orange</MenuItem>
      </Menu>
    );
    const { getByRole, rerender } = render(menu());
    const orange = getByRole('menuitem', { name: 'Orange' });
    orange.focus();
    rerender(menu(true));

    fireEvent.keyDown(orange, { key: 'Enter', keyCode: KeyCode.ENTER, which: KeyCode.ENTER });
    expect(onSelect).not.toHaveBeenCalled();

    rerender(menu());
    fireEvent.keyDown(orange, { key: 'Enter', keyCode: KeyCode.ENTER, which: KeyCode.ENTER });
    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});

describe('Disabled submenus', () => {
  it.each(['inline', 'vertical'] as const)(
    'ignores keyboard opening after a focused %s submenu becomes disabled',
    mode => {
      const onOpenChange = jest.fn();
      const menu = (disabled: boolean) => (
        <Menu mode={mode} disabled={disabled} onOpenChange={onOpenChange}>
          <SubMenu key="parent" title="Parent">
            <MenuItem key="child">Child</MenuItem>
          </SubMenu>
        </Menu>
      );
      const { getByRole, rerender } = render(menu(false));
      const submenu = getByRole('menuitem', { name: 'Parent' });
      act(() => submenu.focus());
      rerender(menu(true));

      const key = mode === 'inline' ? KeyCode.ENTER : KeyCode.RIGHT;
      fireEvent.keyDown(submenu, { which: key, keyCode: key });
      expect(onOpenChange).not.toHaveBeenCalled();

      rerender(menu(false));
      fireEvent.keyDown(submenu, { which: key, keyCode: key });
      expect(onOpenChange).toHaveBeenCalledWith(['parent']);
    },
  );

  it.each(['inline', 'vertical'] as const)(
    'blocks selection in an open %s submenu while it is disabled',
    async mode => {
      const onSelect = jest.fn();
      const onOpenChange = jest.fn();
      const menu = (disabled: boolean) => (
        <Menu mode={mode} openKeys={['parent']} onSelect={onSelect} onOpenChange={onOpenChange}>
          <SubMenu key="parent" title="Parent" disabled={disabled}>
            <MenuItem key="child">Child</MenuItem>
          </SubMenu>
        </Menu>
      );
      const { findByRole, rerender } = render(menu(false));
      const item = await findByRole('menuitem', { name: 'Child' });
      act(() => item.focus());
      rerender(menu(true));

      fireEvent.click(item);
      fireEvent.keyDown(item, { which: KeyCode.ENTER, keyCode: KeyCode.ENTER });
      expect(onSelect).not.toHaveBeenCalled();
      expect(onOpenChange).not.toHaveBeenCalled();

      rerender(menu(false));
      fireEvent.click(item);
      expect(onSelect).toHaveBeenCalledTimes(1);
    },
  );
});
