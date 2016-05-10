import expect from 'expect.js';
import React from 'react';
import ReactDOM from 'react-dom';
import { Simulate, scryRenderedDOMComponentsWithClass } from 'react-addons-test-utils';
import Menu, { MenuItem, MenuItemGroup } from 'rc-menu';
import { KeyCode } from 'rc-util';

describe('MenuItemGroup', () => {
  const div = document.createElement('div');
  div.style.width = '200px';
  document.body.appendChild(div);

  let refMap;
  let refArray = [];

  function saveRef(ref) {
    return (c) => {
      refMap[ref] = c;
      refArray.push(c);
    };
  }

  beforeEach(() => {
    refMap = {};
    refArray = [];
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(div);
  });

  function expectActive(targetRef) {
    for (const ref in refMap) {
      if (refMap.hasOwnProperty(ref)) {
        const instance = refMap[ref];
        if (ref === targetRef) {
          expect(instance.props.active).to.be.ok();
        } else {
          expect(instance.props.active).not.to.be.ok();
        }
      }
    }
  }

  it('works', () => {
    const menu = ReactDOM.render(<Menu>
      <MenuItemGroup title="g1">
        <MenuItem key="1" ref={saveRef('1')}>1</MenuItem>
        <MenuItem key="2" ref={saveRef('2')}>2</MenuItem>
      </MenuItemGroup>
      <MenuItem key="3" ref={saveRef('3')}>3</MenuItem>
      <MenuItemGroup title="g2">
        <MenuItem key="4" ref={saveRef('4')}>4</MenuItem>
        <MenuItem key="5" ref={saveRef('5')}>5</MenuItem>
      </MenuItemGroup>
    </Menu>, div);

    expect(scryRenderedDOMComponentsWithClass(menu, 'rc-menu-item-group').length).to.be(2);
    expect(scryRenderedDOMComponentsWithClass(menu, 'rc-menu-item').length).to.be(5);


    expectActive('none');

    const menuNode = ReactDOM.findDOMNode(menu);

    Simulate.keyDown(menuNode, {
      keyCode: KeyCode.DOWN,
    });

    expectActive('1');
    Simulate.keyDown(menuNode, {
      keyCode: KeyCode.DOWN,
    });
    expectActive('2');
    Simulate.keyDown(menuNode, {
      keyCode: KeyCode.DOWN,
    });
    expectActive('3');
    Simulate.keyDown(menuNode, {
      keyCode: KeyCode.DOWN,
    });
    expectActive('4');
    Simulate.keyDown(menuNode, {
      keyCode: KeyCode.DOWN,
    });
    expectActive('5');
    Simulate.keyDown(menuNode, {
      keyCode: KeyCode.DOWN,
    });
    expectActive('none');
  });
});
