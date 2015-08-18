'use strict';

var expect = require('expect.js');
var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var Simulate = TestUtils.Simulate;
var KeyCode = require('rc-util').KeyCode;
var Menu = require('../');
var SubMenu = Menu.SubMenu;
var MenuItem = Menu.Item;
var MenuItemGroup = Menu.ItemGroup;
var scryRenderedDOMComponentsWithClass = TestUtils.scryRenderedDOMComponentsWithClass;

describe('MenuItemGroup', function () {
  var div = document.createElement('div');
  div.style.width = '200px';
  document.body.appendChild(div);

  var refMap;
  var refArray = [];

  function saveRef(ref) {
    return function (c) {
      refMap[ref] = c;
      refArray.push(c);
    };
  }

  beforeEach(function () {
    refMap = {};
    refArray = [];
  });

  afterEach(function () {
    React.unmountComponentAtNode(div);
  });

  function expectActive(targetRef) {
    for (var ref in refMap) {
      var instance = refMap[ref];
      if (ref === targetRef) {
        expect(instance.props.active).to.be.ok();
      } else {
        expect(instance.props.active).not.to.be.ok();
      }
    }
  }

  it('works', function () {
    var menu = React.render(<Menu>
      <MenuItemGroup title="g1">
        <MenuItem key="1" ref={saveRef("1")}>1</MenuItem>
        <MenuItem key="2" ref={saveRef("2")}>2</MenuItem>
      </MenuItemGroup>
      <MenuItem key="3" ref={saveRef("3")}>3</MenuItem>
      <MenuItemGroup title="g2">
        <MenuItem key="4" ref={saveRef("4")}>4</MenuItem>
        <MenuItem key="5" ref={saveRef("5")}>5</MenuItem>
      </MenuItemGroup>
    </Menu>, div);

    expect(scryRenderedDOMComponentsWithClass(menu, 'rc-menu-item-group').length).to.be(2);
    expect(scryRenderedDOMComponentsWithClass(menu, 'rc-menu-item').length).to.be(5);

    expectActive('none');

    var menuNode = React.findDOMNode(menu);

    Simulate.keyDown(menuNode, {
      keyCode: KeyCode.DOWN
    });
    expectActive('1');
    Simulate.keyDown(menuNode, {
      keyCode: KeyCode.DOWN
    });
    expectActive('2');
    Simulate.keyDown(menuNode, {
      keyCode: KeyCode.DOWN
    });
    expectActive('3');
    Simulate.keyDown(menuNode, {
      keyCode: KeyCode.DOWN
    });
    expectActive('4');
    Simulate.keyDown(menuNode, {
      keyCode: KeyCode.DOWN
    });
    expectActive('5');
    Simulate.keyDown(menuNode, {
      keyCode: KeyCode.DOWN
    });
    expectActive('1');
  });
});
