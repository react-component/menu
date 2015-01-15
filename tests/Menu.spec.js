/** @jsx React.DOM */

var expect = require('expect.js');
var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var Simulate = TestUtils.Simulate;

var Menu = require('../');
var SubMenu = require('../lib/SubMenu');
var MenuItem = require('../lib/MenuItem');

describe('Menu', function (){
  it('Should set the correct item active', function () {
    var instance = TestUtils.renderIntoDocument(
      <Menu activeKey="1">
        this is not ValidElement
        <p>this is alse not ValidElement</p>
        <MenuItem key="1" ref="item1">Pill 1 content</MenuItem>
        <MenuItem divider />
        <MenuItem key="2" ref="item2">Pill 2 content</MenuItem>
      </Menu>
    );
    expect(instance.refs.item1.props.active).to.be.ok();
    expect(instance.refs.item2.props.active).to.not.be.ok();
  });

  it('Should call on select when item is selected', function (done) {
    var count = 0;
    function handleSelect(key) {
      count++;
      expect(key).to.be(count + '');
      if (count == 2) {
        done();
      }
    }
    var instance = TestUtils.renderIntoDocument(
      <Menu activeKey={1} onSelect={handleSelect}>
        <MenuItem key={1} ref="item1" href="http://www.baidu.com">Tab 1 content</MenuItem>
        <MenuItem key={2} ref="item2" onSelect={handleSelect}>
          Tab 2 content
        </MenuItem>
      </Menu>
    );
    Simulate.click(instance.refs.item1.refs._anchor);
    Simulate.click(instance.refs.item2.refs._anchor);
  });

  it('Should fire `mouseEnter` event', function () {
    var instance = TestUtils.renderIntoDocument(
      <Menu>
        <MenuItem ref="item1">item</MenuItem>
        <MenuItem ref="item2" disabled >disabled</MenuItem>
      </Menu>
    );
    //console.log( instance.refs );
    // see this issue:  https://github.com/facebook/react/issues/1297
    // Simulate.mouseEnter(instance.refs.menuItem.getDOMNode(), {type: 'mouseenter'});
    TestUtils.SimulateNative.mouseOver(instance.refs.item1.refs._menuItem.getDOMNode(), {type: 'mouseenter'});
    TestUtils.SimulateNative.mouseOut(instance.refs.item1.refs._menuItem.getDOMNode(), {type: 'mouseleave'});
    TestUtils.SimulateNative.mouseOut(instance.refs.item2.refs._menuItem.getDOMNode(), {type: 'mouseenter'});
  });

  it('Should fire `keyDown` event', function () {
    var instance = TestUtils.renderIntoDocument(
      <Menu activeKey={1}>
        <MenuItem key={12} ref="item1">Pill 1 content</MenuItem>
        <MenuItem divider />
        <MenuItem key={2} ref="item2">Pill 2 content</MenuItem>
        <SubMenu key={1} ref="item3" className="dropdown-submenu" title="right">
          <Menu className="dropdown-menu">
            <MenuItem key="231">inner inner</MenuItem>
            <MenuItem key="242">inner inner2</MenuItem>
          </Menu>
        </SubMenu>
      </Menu>
    );
    //console.log( instance.refs );
    Simulate.keyDown(instance.refs._menu, {key: 'Enter', keyCode: 13});
    Simulate.keyDown(instance.refs._menu.getDOMNode(), {keyCode: 37});
    Simulate.keyDown(instance.refs._menu.getDOMNode(), {keyCode: 38});
    Simulate.keyDown(instance.refs._menu.getDOMNode(), {keyCode: 39});
    Simulate.keyDown(instance.refs._menu.getDOMNode(), {keyCode: 40});
    Simulate.keyDown(instance.refs._menu.getDOMNode(), {keyCode: 3});

    Simulate.click(instance.refs.item3.refs._subMenuButton)
  });
});
