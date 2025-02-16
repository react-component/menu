import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Menu, { SubMenu, Item as MenuItem } from '../src';
import type { ReactElement } from 'react';

describe('Menu PopupRender Tests', () => {
  // 基础测试数据
  const basicItems = [
    {
      key: 'submenu1',
      label: 'SubMenu 1',
      children: [
        { key: 'child1', label: 'Child 1' },
        { key: 'child2', label: 'Child 2' },
      ],
    },
  ];

  // 基础 popupRender 函数
  const basicPopupRender = jest.fn((node: ReactElement) => {
    return (
      <div className="custom-popup" data-testid="custom-popup">
        {React.cloneElement(node, {
          className: `${node.props.className || ''} custom-popup-content`,
        })}
      </div>
    );
  });

  describe('Basic PopupRender Functionality', () => {
    it('should apply custom wrapper to popup content', async () => {
      render(
        <Menu mode="horizontal" popupRender={basicPopupRender}>
          <SubMenu key="test" title="Test">
            <MenuItem key="child">Child</MenuItem>
          </SubMenu>
        </Menu>,
      );
      fireEvent.mouseEnter(screen.getByText('Test'));
      // 验证自定义包装器
      await waitFor(() => {
        expect(screen.getByTestId('custom-popup')).toBeInTheDocument();
      });
    });

    it('should work with items prop configuration', async () => {
      render(
        <Menu
          mode="horizontal"
          popupRender={basicPopupRender}
          items={basicItems}
        />,
      );
      fireEvent.mouseEnter(screen.getByText('SubMenu 1'));
      await waitFor(() => {
        expect(screen.getByTestId('custom-popup')).toBeInTheDocument();
        expect(screen.getByText('Child 1')).toBeInTheDocument();
      });
    });
  });

  describe('Nested PopupRender Behavior', () => {
    const nestedPopupRender = (
      node: ReactElement,
      info: { keys: string[] },
    ) => (
      <div
        className={`level-${info.keys.length}`}
        data-testid={`level-${info.keys.length}`}
      >
        {node}
      </div>
    );

    it('should handle nested popupRender with different levels', async () => {
      render(
        <Menu mode="horizontal" popupRender={nestedPopupRender}>
          <SubMenu key="level1" title="Level 1">
            <SubMenu key="level2" title="Level 2">
              <MenuItem key="child">Child</MenuItem>
            </SubMenu>
          </SubMenu>
        </Menu>,
      );

      // 触发一级菜单
      fireEvent.mouseEnter(screen.getByText('Level 1'));
      await waitFor(() => {
        expect(screen.getByTestId('level-1')).toBeInTheDocument();
      });

      // 触发二级菜单
      fireEvent.mouseEnter(screen.getByText('Level 2'));
      await waitFor(() => {
        expect(screen.getByTestId('level-2')).toBeInTheDocument();
      });
    });
  });

  describe('Conditional PopupRender', () => {
    const conditionalPopupRender = (
      node: ReactElement,
      info: { keys: string[] },
    ) => {
      if (info.keys.length === 1) {
        return (
          <div className="style-a" data-testid="style-a">
            {node}
          </div>
        );
      }
      return (
        <div className="style-b" data-testid="style-b">
          {node}
        </div>
      );
    };

    it('should apply different styles based on conditions', async () => {
      render(
        <Menu mode="horizontal" popupRender={conditionalPopupRender}>
          <SubMenu key="main" title="Main">
            <SubMenu key="sub" title="Sub">
              <MenuItem key="child">Child</MenuItem>
            </SubMenu>
          </SubMenu>
        </Menu>,
      );

      fireEvent.mouseEnter(screen.getByText('Main'));
      await waitFor(() => {
        expect(screen.getByTestId('style-a')).toBeInTheDocument();
      });

      fireEvent.mouseEnter(screen.getByText('Sub'));
      await waitFor(() => {
        expect(screen.getByTestId('style-b')).toBeInTheDocument();
      });
    });
  });

  describe('PopupRender with Content Modification', () => {
    const contentModifyingPopupRender = (node: ReactElement) => {
      return (
        <div className="enhanced-popup" data-testid="enhanced-popup">
          <div className="popup-header" data-testid="popup-header">
            Menu
          </div>
          {node}
          <div className="popup-footer" data-testid="popup-footer">
            Footer
          </div>
        </div>
      );
    };

    it('should add additional content to popup', async () => {
      render(
        <Menu mode="horizontal" popupRender={contentModifyingPopupRender}>
          <SubMenu key="test" title="Test">
            <MenuItem key="child">Child</MenuItem>
          </SubMenu>
        </Menu>,
      );

      fireEvent.mouseEnter(screen.getByText('Test'));

      await waitFor(() => {
        expect(screen.getByTestId('popup-header')).toBeInTheDocument();
        expect(screen.getByTestId('popup-footer')).toBeInTheDocument();
        expect(screen.getByText('Child')).toBeInTheDocument();
      });
    });
  });
});
