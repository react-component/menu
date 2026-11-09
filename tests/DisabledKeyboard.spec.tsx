import { fireEvent, render } from '@testing-library/react';
import { KeyCode } from '@rc-component/util';
import React from 'react';
import Menu, { MenuItem } from '../src';

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
