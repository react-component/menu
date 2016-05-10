import expect from 'expect.js';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils, { Simulate } from 'react-addons-test-utils';
import Menu, { MenuItem, SubMenu, Divider } from 'rc-menu';
import { KeyCode } from 'rc-util';

describe('Menu', function menu() {
  this.timeout(9999999);

  let refs;

  function saveRef(ref) {
    return (c) => {
      refs[ref] = c;
    };
  }

  const div = document.createElement('div');
  div.style.width = '200px';
  document.body.appendChild(div);

  beforeEach(() => {
    refs = {};
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(div);
  });

  it('Should set the correct item active', () => {
    ReactDOM.render(
      <Menu activeKey="item1">
        <MenuItem key="item1" ref={saveRef('item1')}>Pill 1 content</MenuItem>
        <Divider/>
        <MenuItem key="item2" ref={saveRef('item2')}>Pill 2 content</MenuItem>
      </Menu>, div
    );
    expect(refs.item1.props.active).to.be.ok();
    expect(refs.item2.props.active).to.not.be.ok();
  });

  it('Should call on select when item is selected', (done) => {
    function handleSelect(e) {
      expect(e.key).to.be('item2');
      done();
    }

    TestUtils.renderIntoDocument(
      <Menu activeKey="item1" onSelect={handleSelect}>
        <MenuItem key="item1" href="http://www.baidu.com">Tab 1 content</MenuItem>
        <MenuItem key="item2" ref={saveRef('item2')}>
          Tab 2 content
        </MenuItem>
      </Menu>
    );
    Simulate.click(ReactDOM.findDOMNode(refs.item2));
  });

  it('Should fire `mouseEnter` event', (done) => {
    ReactDOM.render(
      <Menu>
        <MenuItem key="item1">item</MenuItem>
        <MenuItem disabled>disabled</MenuItem>
        <MenuItem
          key="item2"
          ref={saveRef('item2')}
        >item2</MenuItem>
      </Menu>, div);
    // const itemNode = ReactDOM.findDOMNode(refs.item2);
    // see this issue:  https://github.com/facebook/react/issues/1297
    // Simulate.mouseEnter(instance.refs.menuItem, {type: 'mouseenter'});
    done();
    // TestUtils.SimulateNative.mouseOver(itemNode, {
    //   relatedTarget: document.body,
    // });
    // setTimeout(() => {
    //   expect(itemNode.className.indexOf('rc-menu-item-active') !== -1).to.be(true);
    //   done();
    // }, 100);
  });

  it('Should fire `keyDown` event', (done) => {
    const instance = ReactDOM.render(
      <Menu activeKey="item1">
        <MenuItem key="item1">Pill 1 content</MenuItem>
        <MenuItem disabled/>
        <MenuItem ref={saveRef('item2')} key="item2">Pill 2 content</MenuItem>
        <SubMenu key="item3" className="dropdown-submenu" title="right">
          <MenuItem key="231">inner inner</MenuItem>
          <MenuItem key="242">inner inner2</MenuItem>
        </SubMenu>
      </Menu>, div
    );
    Simulate.keyDown(ReactDOM.findDOMNode(instance), {
      keyCode: KeyCode.DOWN,
    });
    setTimeout(() => {
      expect(ReactDOM.findDOMNode(refs.item2)
          .className.indexOf('rc-menu-item-active') !== -1).to.be(true);
      done();
    }, 10);
  });
});
