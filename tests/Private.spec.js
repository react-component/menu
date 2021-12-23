/* eslint-disable no-undef */
import React from 'react';
import { mount } from 'enzyme';
import classnames from 'classnames';
import Menu, { MenuItem, SubMenu } from '../src';

describe('Private Props', () => {
  it('_internalRenderMenuItem', () => {
    const wrapper = mount(
      <Menu
        _internalRenderMenuItem={node =>
          React.cloneElement(node, {
            className: classnames(node.props.className, 'inject-cls'),
          })
        }
      >
        <MenuItem key="1">1</MenuItem>
      </Menu>,
    );

    expect(wrapper.exists('.inject-cls')).toBeTruthy();
  });

  it('_internalRenderSubMenuItem', () => {
    const wrapper = mount(
      <Menu
        mode="inline"
        openKeys={['1']}
        _internalRenderSubMenuItem={node =>
          React.cloneElement(node, {
            className: classnames(node.props.className, 'inject-cls'),
          })
        }
      >
        <SubMenu key="1" title="1">
          <MenuItem key="1-1">1-1</MenuItem>
        </SubMenu>
      </Menu>,
    );

    expect(wrapper.exists('.inject-cls')).toBeTruthy();
  });
});
/* eslint-enable */
