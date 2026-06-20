/* eslint-disable no-undef */
import { render } from '@testing-library/react';
import React from 'react';
import Menu from '../src';

describe('Options', () => {
  it('should work', () => {
    const { container } = render(
      <Menu
        mode="inline"
        openKeys={['sub1']}
        items={[
          // Invalid
          null,
          {
            label: 'SubMenu',
            key: 'sub1',
            children: [
              {
                type: 'group',
                label: 'Menu Group',
                children: [
                  {
                    label: 'Menu Item 1',
                    key: '1',
                  },
                  {
                    label: 'Menu Item 2',
                    key: '2',
                  },
                ],
              },
            ],
          },
          {
            type: 'divider',
          },
        ]}
      />,
    );

    expect(container.children).toMatchSnapshot();
  });

  it('uses submenu item title as native title without replacing label', () => {
    const { container } = render(
      <Menu
        items={[
          {
            label: 'Users',
            key: 'sub1',
            title: 'People',
            children: [
              {
                label: 'User 1',
                key: 'user1',
              },
            ],
          },
        ]}
      />,
    );

    const titleNode = container.querySelector('.rc-menu-submenu-title');

    expect(titleNode).toHaveTextContent('Users');
    expect(titleNode).toHaveAttribute('title', 'People');
  });
});
/* eslint-enable */
