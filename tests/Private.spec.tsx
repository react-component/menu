/* eslint-disable no-undef */
import { render } from '@testing-library/react';
import classnames from 'classnames';
import React from 'react';
import Menu, { MenuItem, SubMenu } from '../src';

describe('Private Props', () => {
  it('_internalRenderMenuItem', () => {
    const { container } = render(
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

    expect(container.querySelector('.inject-cls')).toBeTruthy();
  });

  it('_internalRenderSubMenuItem', () => {
    const { container } = render(
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

    expect(container.querySelector('.inject-cls')).toBeTruthy();
  });
});
/* eslint-enable */
