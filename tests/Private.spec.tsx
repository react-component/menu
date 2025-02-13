/* eslint-disable no-undef */
import { render } from '@testing-library/react';
import classnames from 'classnames';
import React from 'react';
import Menu from '../src';

describe('Private Props', () => {
  it('_internalRenderMenuItem', () => {
    const { container } = render(
      <Menu
        _internalRenderMenuItem={node =>
          React.cloneElement(node, {
            className: classnames(node.props.className, 'inject-cls'),
          })
        }
        items={[
          {
            key: '1',
            label: '1',
          },
        ]}
      />,
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
        items={[
          {
            key: '1',
            type: 'submenu',
            label: '1',
            children: [
              {
                key: '1-1',
                label: '1-1',
              },
            ],
          },
        ]}
      />,
    );

    expect(container.querySelector('.inject-cls')).toBeTruthy();
  });
});
/* eslint-enable */
