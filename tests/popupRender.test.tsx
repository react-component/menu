import React from 'react';
import { render } from '@testing-library/react';
import Menu, { SubMenu, Item as MenuItem } from '../src';
import type { ReactElement } from 'react';

describe('Menu PopupRender Tests', () => {
  const basicPopupRender = (node: ReactElement) => (
    <div className="custom-popup" data-testid="custom-popup">
      {React.cloneElement(node, {
        className: `${node.props.className || ''} custom-popup-content`,
      })}
    </div>
  );

  it('should render popup with custom wrapper', async () => {
    const { container } = render(
      <Menu
        mode="horizontal"
        popupRender={basicPopupRender}
        openKeys={['test']}
      >
        <SubMenu key="test" title="Test">
          <MenuItem key="child">Child</MenuItem>
        </SubMenu>
      </Menu>,
    );
    expect(
      container.querySelectorAll('.rc-menu-submenu-horizontal')[0],
    ).toHaveClass('rc-menu-submenu-open');
  });

  it('should work with items prop', async () => {
    const items = [
      {
        key: 'submenu1',
        label: 'SubMenu 1',
        children: [
          { key: 'child1', label: 'Child 1' },
          { key: 'child2', label: 'Child 2' },
        ],
      },
    ];

    const { container } = render(
      <Menu
        mode="horizontal"
        popupRender={basicPopupRender}
        items={items}
        openKeys={['submenu1']}
      />,
    );

    expect(
      container.querySelectorAll('.rc-menu-submenu-horizontal')[0],
    ).toHaveClass('rc-menu-submenu-open');
  });
});
