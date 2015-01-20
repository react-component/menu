/** @jsx React.DOM */

var expect = require('expect.js');
var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var Simulate = TestUtils.Simulate;

var Menu = require('../');
var SubMenu = require('../').SubMenu;
var MenuItem = require('../').Item;

describe('MenuItem', function () {
  var div = document.createElement('div');
  div.style.width = '200px';
  document.body.appendChild(div);

  afterEach(function () {
    React.unmountComponentAtNode(div);
  });

  it('Should add disabled class', function () {
    var instance = React.render(
      <Menu>
        <MenuItem disabled={true}>Pill 2 content</MenuItem>
      </Menu>, div
    );
    expect(TestUtils.findRenderedDOMComponentWithClass(instance, 'rc-menu-item-disabled')).to.be.ok();
  });

  it('Should not call `onSelect` when item disabled and is selected', function (done) {
    var called = 0;

    function handleSelect() {
      called = 1;
    }

    var instance = TestUtils.renderIntoDocument(
      <Menu>
        <MenuItem disabled={true} onSelect={handleSelect}>
          <span className='xx'>Item content</span>
        </MenuItem>
      </Menu>
    );

    Simulate.click(TestUtils.findRenderedDOMComponentWithClass(instance, 'xx'));

    setTimeout(function () {
      expect(called).to.be(0);
      done();
    }, 100);
  });

});
