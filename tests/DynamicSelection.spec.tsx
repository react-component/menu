import React from 'react';
import { act, render } from '@testing-library/react';
import Menu from '../src';
import type { MenuProps } from '../src';

describe.each([false, true])('dynamic selection with StrictMode=%s', strictMode => {
  const wrapper = strictMode ? React.StrictMode : React.Fragment;

  describe.each(['defaultSelectedKeys', 'selectedKeys'] as const)('%s', selectionProp => {
    it.each<MenuProps['mode']>(['inline', 'vertical', 'horizontal'])(
      'highlights the parent when items load in %s mode',
      async mode => {
        const selectionProps = { [selectionProp]: ['child'] };
        const { container, rerender } = render(
          <Menu mode={mode} {...selectionProps} items={[]} />,
          { wrapper },
        );

        await act(async () => {
          rerender(
            <Menu
              mode={mode}
              {...selectionProps}
              items={[
                {
                  key: 'parent',
                  label: 'Parent',
                  children: [
                    {
                      type: 'group',
                      label: 'Group',
                      children: [{ key: 'child', label: 'Child' }],
                    },
                  ],
                },
              ]}
            />,
          );
        });

        expect(container.querySelector('.rc-menu-submenu')).toHaveClass('rc-menu-submenu-selected');
      },
    );
  });
});
