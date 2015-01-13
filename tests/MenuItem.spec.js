/** @jsx React.DOM */

var expect = require('expect.js');
var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var Simulate = TestUtils.Simulate;

var Menu = require('../');
var MenuItem = require('../lib/MenuItem');

describe('MenuItem', function (){

  it('Should add disabled class', function () {
    var instance = TestUtils.renderIntoDocument(
      <MenuItem disabled={true}>Pill 2 content</MenuItem>
    );
    expect(TestUtils.findRenderedDOMComponentWithClass(instance, 'disabled')).to.be.ok();
    Simulate.click(instance.refs._anchor);
  });

  it('Should not call `onSelect` when item disabled and is selected', function () {
    function handleSelect() {
      throw new Error('onSelect should not be called');
    }
    var instance = TestUtils.renderIntoDocument(
      <MenuItem disabled={true} onSelect={handleSelect}>
        <span>Item content</span>
      </MenuItem>
    );
    Simulate.click(TestUtils.findRenderedDOMComponentWithTag(instance, 'span'));
  });


  it('Should fire `onMouseLeave` event', function () {

  });
});
