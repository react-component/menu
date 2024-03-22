/* eslint-disable no-undef */
import { fireEvent, render } from '@testing-library/react';
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

  it('key type is matched', () => {
    const onSelect = jest.fn();

    const { container } = render(
      <Menu
        items={[
          {
            label: 'Menu Item 1',
            key: "1",
          },
          {
            label: 'Menu Item 2',
            key: 2,
          },
        ]}
        onSelect={onSelect}
      />,
    );

    fireEvent.click(container.querySelectorAll('.rc-menu-item')[0]);
    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ selectedKeys: ['1'] }),
    );

    fireEvent.click(container.querySelectorAll('.rc-menu-item')[1]);
    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ selectedKeys: [2] }),
    );
  });
});
/* eslint-enable */
