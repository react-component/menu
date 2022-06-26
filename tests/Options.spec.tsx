/* eslint-disable no-undef */
import { render } from '@testing-library/react';
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
});
/* eslint-enable */
