import React from 'react';
import { act, render } from '@testing-library/react';
import Menu from '../src';
import type { MenuProps } from '../src';

describe.each([false, true])('dynamic selection with StrictMode=%s', strictMode => {
  const wrapper = strictMode ? React.StrictMode : React.Fragment;

  describe.each(['defaultSelectedKeys', 'selectedKeys'] as const)('%s', selectionProp => {
    it.each<MenuProps['mode']>(['inline', 'vertical', 'horizontal'])(
      'highlights the parent and child when items load in %s mode',
      async mode => {
        const selectionProps = { [selectionProp]: ['child'] };
        const { container, getAllByText, rerender } = render(
          <Menu mode={mode} {...selectionProps} items={[]} forceSubMenuRender />,
          { wrapper },
        );

        await act(async () => {
          rerender(
            <Menu
              mode={mode}
              {...selectionProps}
              forceSubMenuRender
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
        getAllByText('Child').forEach(child => {
          expect(child.closest('.rc-menu-item')).toHaveClass('rc-menu-item-selected');
        });
      },
    );
  });
});
