/* eslint no-console:0 */

import React from 'react';
import ReactDOM from 'react-dom';
import Menu, { SubMenu, Item as MenuItem, Divider } from 'rc-menu';
import 'rc-menu/assets/index.less';
import animate from 'css-animation';

function handleSelect(info) {
  console.log(info);
  console.log(`selected ${info.key}`);
}

function handleItemClick(e) {
  console.log('item clicked');
}

const animation = {
  enter(node, done) {
    let height;
    return animate(node, 'rc-menu-collapse', {
      start() {
        height = node.offsetHeight;
        node.style.height = 0;
      },
      active() {
        node.style.height = `${height}px`;
      },
      end() {
        node.style.height = '';
        done();
      },
    });
  },

  appear() {
    return this.enter.apply(this, arguments);
  },

  leave(node, done) {
    return animate(node, 'rc-menu-collapse', {
      start() {
        node.style.height = `${node.offsetHeight}px`;
      },
      active() {
        node.style.height = 0;
      },
      end() {
        node.style.height = '';
        done();
      },
    });
  },
};

const reactContainer = document.getElementById('__react-content');

const nestSubMenu = (<SubMenu title={<span>offset sub menu 2</span>} key="4" popupOffset={[10, 15]}>
  <MenuItem key="4-1" whatever="inner inner" onClick={handleItemClick}>inner inner</MenuItem>
  <Divider/>
  <SubMenu
    key="4-2"
    title={<span>sub menu 3</span>}
  >
    <SubMenu title="sub 4-2-0" key="4-2-0">
      <MenuItem key="4-2-0-1" whatever="inner inner1" onClick={handleItemClick}>inner inner1</MenuItem>
      <MenuItem key="4-2-0-2" whatever="inner inner2" onClick={handleItemClick}>inner inner2</MenuItem>
    </SubMenu>
    <MenuItem key="4-2-1" whatever="inner inner3" onClick={handleItemClick}>inner inner3</MenuItem>
    <SubMenu title={<span>sub menu 4</span>} key="4-2-2">
      <MenuItem key="4-2-2-1" whatever="inner inner4" onClick={handleItemClick}>inner inner4</MenuItem>
      <MenuItem key="4-2-2-2" whatever="inner inner5" onClick={handleItemClick}>inner inner5</MenuItem>
    </SubMenu>
    <SubMenu title="sub 4-2-3" key="4-2-3">
      <MenuItem key="4-2-3-1" whatever="inner inner6" onClick={handleItemClick}>inner inner6</MenuItem>
      <MenuItem key="4-2-3-2" whatever="inner inner7" onClick={handleItemClick}>inner inner7</MenuItem>
    </SubMenu>
  </SubMenu>
</SubMenu>);

function onOpenChange(value) {
  console.log('onOpenChange', value);
}
const commonMenu = (<Menu onClick={handleSelect} onOpenChange={onOpenChange}>
  <SubMenu title={<span>sub menu</span>} key="1">
    <MenuItem key="1-1" onClick={handleItemClick}>0-1</MenuItem>
    <MenuItem key="1-2" onClick={handleItemClick}>0-2</MenuItem>
  </SubMenu>
  {nestSubMenu}
  <MenuItem key="2" onClick={handleItemClick}>1</MenuItem>
  <MenuItem key="3" onClick={handleItemClick}>outer</MenuItem>
  <MenuItem disabled>disabled</MenuItem>
  <MenuItem key="5" onClick={handleItemClick}>outer3</MenuItem>
</Menu>);

function render(container) {
  const horizontalMenu = React.cloneElement(commonMenu, {
    mode: 'horizontal',
    // use openTransition for antd
    openAnimation: 'slide-up',
  });

  const horizontalMenu2 = React.cloneElement(commonMenu, {
    mode: 'horizontal',
    openAnimation: 'slide-up',
    triggerSubMenuAction: 'click',
  });

  const verticalMenu = React.cloneElement(commonMenu, {
    mode: 'vertical',
    openAnimation: 'zoom',
  });

  const inlineMenu = React.cloneElement(commonMenu, {
    mode: 'inline',
    defaultOpenKeys: ['1'],
    openAnimation: animation,
  });

  ReactDOM.render(<div style={{ margin: 20 }}>
    <h2>antd menu</h2>

    <div>
      <h3>horizontal</h3>

      <div style={{ margin: 20, width: 800 }}>{horizontalMenu}</div>
      <h3>horizontal and click</h3>

      <div style={{ margin: 20, width: 800 }}>{horizontalMenu2}</div>
      <h3>vertical</h3>

      <div style={{ margin: 20, width: 200 }}>{verticalMenu}</div>
      <h3>inline</h3>

      <div style={{ margin: 20, width: 400 }}>{inlineMenu}</div>
    </div>
  </div>, container);
}

render(reactContainer);
