/** @jsx React.DOM */

var expect = require('expect.js');
var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var Simulate = TestUtils.Simulate;

var Menu = require('../');
var SubMenu = require('../lib/SubMenu');
var MenuItem = require('../lib/MenuItem');

describe('SubMenu', function (){
  it('Should close the subMenu when click document or enter esc key', function () {
    Simulate.click(document);
    Simulate.keyDown(document, {keyCode: 27});
  });

  it('Should fire mouseenter and click event', function () {
    var instance = TestUtils.renderIntoDocument(
      <SubMenu className="dropdown-submenu" title="title">
        <Menu className="dropdown-menu">
          <MenuItem key="231">inner inner</MenuItem>
          <MenuItem key="242">inner inner2</MenuItem>
        </Menu>
      </SubMenu>
    );
    //Simulate.click(instance.refs._subMenuButton);
    //TestUtils.SimulateNative.mouseOver(instance.refs._subMenuLi.getDOMNode(), {type: 'mouseenter'});
  });
});
