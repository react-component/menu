import React from 'react';
import Menu, { SubMenu, Item as MenuItem } from '../../src';
import type { ReactElement } from 'react';
import './customPopupRender.less';

const NavigationDemo = () => {
  const menuItems = [
    {
      key: 'home',
      label: 'Home',
    },
    {
      key: 'features',
      label: 'Features',
      children: [
        {
          key: 'getting-started',
          label: (
            <a href="/docs">
              <h3>Getting Started</h3>
              <p>Quick start guide and learn the basics.</p>
            </a>
          ),
        },
        {
          key: 'components',
          label: (
            <a href="/components">
              <h3>Components</h3>
              <p>Explore our component library.</p>
            </a>
          ),
        },
        {
          key: 'templates',
          label: (
            <a href="/templates">
              <h3>Templates</h3>
              <p>Ready-to-use template designs.</p>
            </a>
          ),
        },
      ],
    },
    {
      key: 'resources',
      label: 'Resources',
      children: [
        {
          key: 'blog',
          label: (
            <a href="/blog">
              <h3>Blog</h3>
              <p>Latest updates and articles.</p>
            </a>
          ),
        },
        {
          key: 'community',
          label: (
            <a href="/community">
              <h3>Community</h3>
              <p>Join our developer community.</p>
            </a>
          ),
        },
      ],
    },
  ];
  const popupRender = (node: ReactElement) => (
    <div className="navigation-popup">
      <div className="navigation-grid">
        {React.Children.map(node.props.children.props.children, child => (
          <div className="navigation-item">
            {React.cloneElement(child, {
              className: `${child.props.className || ''} navigation-menu-item`,
            })}
          </div>
        ))}
      </div>
    </div>
  );

  return <Menu mode="horizontal" popupRender={popupRender} items={menuItems} />;
};

const MixedPanelDemo = () => {
  const totalPopupRender = (node: ReactElement, info: { item: any; keys: string[] }) => {
    const isSecondLevel = info.keys.length == 2;
    if (isSecondLevel) {
      return (
        <div className="navigation-popup">
          <div className="navigation-grid">
            {React.Children.map(node.props.children.props.children, child => (
              <div className="navigation-item">
                {React.cloneElement(child, {
                  className: `${child.props.className || ''} navigation-menu-item`,
                })}
              </div>
            ))}
          </div>
        </div>
      );
    }
    return node;
  };
  const singlePopupRender = (node: ReactElement, info: { item: any; keys: string[] }) => {
    const isSecondLevel = info.keys.length == 2;
    if (isSecondLevel) {
      return (
        <div className="panel-popup">
          <div className="panel-header">
            <h4>{info.item.title}</h4>
          </div>
          <div className="panel-content">{node}</div>
        </div>
      );
    }
    return node;
  };
  return (
    <Menu mode="horizontal" popupRender={totalPopupRender}>
      <MenuItem key="home">Home</MenuItem>
      <SubMenu key="products" title="Products">
        <MenuItem key="product-a">Product A</MenuItem>
        <MenuItem key="product-b">Product B</MenuItem>
        <SubMenu key="more-products" title="More Products">
          <MenuItem key="product-c">
            <a href="/product-c">
              <h3>Product C</h3>
              <p>Description for Product C.</p>
            </a>
          </MenuItem>
          <MenuItem key="product-d">
            <a href="/product-d">
              <h3>Product D</h3>
              <p>Description for Product D.</p>
            </a>
          </MenuItem>
        </SubMenu>
      </SubMenu>
      <SubMenu key="solutions" title="Solutions">
        <MenuItem key="enterprise">Enterprise</MenuItem>
        <MenuItem key="personal">Personal</MenuItem>
        <SubMenu key="industry" title="Industry" popupRender={singlePopupRender}>
          <MenuItem key="healthcare">Healthcare</MenuItem>
          <MenuItem key="education">Education</MenuItem>
        </SubMenu>
      </SubMenu>
    </Menu>
  );
};

const Demo = () => {
  return (
    <div>
      <h3>NavigationDemo</h3>
      <NavigationDemo />
      <h3>MixedPanelDemo</h3>
      <MixedPanelDemo />
    </div>
  );
};
export default Demo;
