/* eslint-disable no-undef */
import React from 'react';
import { mount } from 'enzyme';
import Menu from '../src';

describe('Options', () => {
  it('should work', () => {
    const wrapper = mount(
      <Menu
        mode="inline"
        openKeys={['sub1']}
        options={[
          {
            title: 'SubMenu',
            key: 'sub1',
            children: [
              {
                type: 'group',
                title: 'Menu Group',
                children: [
                  {
                    title: 'Menu Item 1',
                    key: '1',
                  },
                  {
                    title: 'Menu Item 2',
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

    expect(wrapper.render()).toMatchSnapshot();
  });
});
/* eslint-enable */
