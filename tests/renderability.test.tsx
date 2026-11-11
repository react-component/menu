import React from 'react';
import { render } from '@testing-library/react';
import Menu from '../src';

describe('icon renderability', () => {
  it('renders a global zero item icon', () => {
    const { container } = render(<Menu itemIcon={0} items={[{ key: 'a', label: 'A' }]} />);
    expect(container.querySelector('.rc-menu-item').textContent).toBe('A0');
  });

  it('lets a zero item icon override the global icon', () => {
    const { container } = render(
      <Menu itemIcon="GLOBAL" items={[{ key: 'a', label: 'A', itemIcon: 0 }]} />,
    );
    expect(container.querySelector('.rc-menu-item').textContent).toBe('A0');
  });

  it.each([0, false, null])('preserves the expand icon %s', expandIcon => {
    const { container } = render(
      <Menu
        mode="inline"
        expandIcon={expandIcon}
        items={[{ key: 'a', label: 'A', children: [{ key: 'b', label: 'B' }] }]}
      />,
    );
    expect(container.querySelector('.rc-menu-submenu-title').textContent).toBe(
      expandIcon === 0 ? 'A0' : 'A',
    );
    expect(container.querySelector('.rc-menu-submenu-arrow')).toBeNull();
  });
});
