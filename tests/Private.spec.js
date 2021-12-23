/* eslint-disable no-undef */
import React from 'react';
import { mount } from 'enzyme';
import classnames from 'classnames';
import Menu, { MenuItem } from '../src';

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

    console.log(wrapper.html());

    expect(wrapper.exists('.inject-cls')).toBeTruthy();
  });
});
/* eslint-enable */
