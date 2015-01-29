/** @jsx React.DOM */

var expect = require('expect.js');
var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var Simulate = TestUtils.Simulate;
var KeyCode = require('../lib/utils/util').KeyCode;
var Menu = require('../');
var SubMenu = require('../').SubMenu;
var MenuItem = require('../').Item;
var simulateEvent = require('simulate-dom-event');

describe('Menu', function () {
  this.timeout(9999999);

  var div = document.createElement('div');
  div.style.width = '200px';
  document.body.appendChild(div);

  afterEach(function () {
    React.unmountComponentAtNode(div);
  });

  it('Should set the correct item active', function () {
    var instance = TestUtils.renderIntoDocument(
      <Menu activeKey="item1">
        <MenuItem key="item1">Pill 1 content</MenuItem>
        <MenuItem divider />
        <MenuItem key="item2">Pill 2 content</MenuItem>
      </Menu>
    );
    expect(instance.refs.item1.props.active).to.be.ok();
    expect(instance.refs.item2.props.active).to.not.be.ok();
  });

  it('Should call on select when item is selected', function (done) {
    var count = 0;

    function handleSelect(key) {
      expect(key).to.be('item2');
      count++;
      if (count === 2) {
        done();
      }
    }

    var instance = TestUtils.renderIntoDocument(
      <Menu activeKey="item1" onSelect={handleSelect}>
        <MenuItem key="item1" href="http://www.baidu.com">Tab 1 content</MenuItem>
        <MenuItem key="item2" onSelect={handleSelect}>
          Tab 2 content
        </MenuItem>
      </Menu>
    );
    Simulate.click(instance.refs.item2.getDOMNode());
  });

  it('Should fire `mouseEnter` event', function (done) {
    var instance = React.render(
      <Menu>
        <MenuItem key="item1">item</MenuItem>
        <MenuItem disabled >disabled</MenuItem>
        <MenuItem key="item2">item2</MenuItem>
      </Menu>, div);
    var itemNode = instance.refs.item2.getDOMNode();
    // see this issue:  https://github.com/facebook/react/issues/1297
    // Simulate.mouseEnter(instance.refs.menuItem.getDOMNode(), {type: 'mouseenter'});
    if(1){
      done();
      return;
    }
    TestUtils.SimulateNative.mouseOver(itemNode,{
      relatedTarget: document.body
    });
    setTimeout(function () {
      expect(itemNode.className.indexOf('rc-menu-item-active') !== -1).to.be(true);
      done();
    }, 100);

  });

  it('Should fire `keyDown` event', function (done) {
    var instance = React.render(
      <Menu activeKey="item1">
        <MenuItem key="item1">Pill 1 content</MenuItem>
        <MenuItem disabled />
        <MenuItem key="item2">Pill 2 content</MenuItem>
        <SubMenu key="item3" className="dropdown-submenu" title="right">
          <Menu className="dropdown-menu" ref="_menu">
            <MenuItem key="231">inner inner</MenuItem>
            <MenuItem key="242">inner inner2</MenuItem>
          </Menu>
        </SubMenu>
      </Menu>, div
    );
    Simulate.keyDown(instance.getDOMNode(), {keyCode: KeyCode.DOWN});
    setTimeout(function () {
      expect(instance.refs.item2.getDOMNode().className.indexOf('rc-menu-item-active') !== -1).to.be(true);
      done();
    }, 10);
  });
});
