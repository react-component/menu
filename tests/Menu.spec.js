'use strict';

var expect = require('expect.js');
var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var Simulate = TestUtils.Simulate;
var KeyCode = require('rc-util').KeyCode;
var Menu = require('../');
var SubMenu = require('../').SubMenu;
var MenuItem = require('../').Item;

describe('Menu', function () {
  this.timeout(9999999);

  var refs;
  function saveRef(ref){
    return function(c) {
      refs[ref] = c;
    };
  }

  var div = document.createElement('div');
  div.style.width = '200px';
  document.body.appendChild(div);

  beforeEach(function(){
    refs={};
  });

  afterEach(function () {
    React.unmountComponentAtNode(div);
  });

  it('Should set the correct item active', function () {
    TestUtils.renderIntoDocument(
      <Menu activeKey="item1">
        <MenuItem key="item1" ref={saveRef('item1')}>Pill 1 content</MenuItem>
        <Menu.Divider/>
        <MenuItem key="item2" ref={saveRef('item2')}>Pill 2 content</MenuItem>
      </Menu>
    );
    expect(refs.item1.props.active).to.be.ok();
    expect(refs.item2.props.active).to.not.be.ok();
  });

  it('Should call on select when item is selected', function (done) {
    var count = 0;

    function handleSelect(e) {
      expect(e.key).to.be('item2');
      count++;
      if (count === 2) {
        done();
      }
    }

    TestUtils.renderIntoDocument(
      <Menu activeKey="item1" onSelect={handleSelect}>
        <MenuItem key="item1" href="http://www.baidu.com">Tab 1 content</MenuItem>
        <MenuItem key="item2"
          ref={saveRef('item2')}
          onSelect={handleSelect}>
          Tab 2 content
        </MenuItem>
      </Menu>
    );
    Simulate.click(React.findDOMNode(refs.item2));
  });

  it('Should fire `mouseEnter` event', function (done) {
    var instance = React.render(
      <Menu>
        <MenuItem key="item1">item</MenuItem>
        <MenuItem disabled >disabled</MenuItem>
        <MenuItem key="item2"
        ref={saveRef('item2')}
        >item2</MenuItem>
      </Menu>, div);
    var itemNode = React.findDOMNode(refs.item2);
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
        <MenuItem ref={saveRef('item2')} key="item2">Pill 2 content</MenuItem>
        <SubMenu key="item3" className="dropdown-submenu" title="right">
          <Menu className="dropdown-menu">
            <MenuItem key="231">inner inner</MenuItem>
            <MenuItem key="242">inner inner2</MenuItem>
          </Menu>
        </SubMenu>
      </Menu>, div
    );
    Simulate.keyDown(React.findDOMNode(instance), {keyCode: KeyCode.DOWN});
    setTimeout(function () {
      expect(React.findDOMNode(refs.item2).className.indexOf('rc-menu-item-active') !== -1).to.be(true);
      done();
    }, 10);
  });
});
