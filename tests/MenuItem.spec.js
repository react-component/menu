const expect = require('expect.js');
const React = require('react');
const ReactDOM = require('react-dom');
const TestUtils = require('react-addons-test-utils');
const Simulate = TestUtils.Simulate;

const Menu = require('../');
const MenuItem = Menu.Item;

describe('MenuItem', () => {
  const div = document.createElement('div');
  div.style.width = '200px';
  document.body.appendChild(div);

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(div);
  });

  it('Should add disabled class', () => {
    const instance = ReactDOM.render(
      <Menu>
        <MenuItem disabled>Pill 2 content</MenuItem>
      </Menu>, div
    );
    expect(TestUtils.findRenderedDOMComponentWithClass(instance, 'rc-menu-item-disabled')).to.be.ok();
  });

  it('Should not call `onSelect` when item disabled and is selected', (done) => {
    let called = 0;

    function handleSelect() {
      called = 1;
    }

    const instance = TestUtils.renderIntoDocument(
      <Menu>
        <MenuItem disabled onSelect={handleSelect}>
          <span className="xx">Item content</span>
        </MenuItem>
      </Menu>
    );

    Simulate.click(TestUtils.findRenderedDOMComponentWithClass(instance, 'xx'));

    setTimeout(() => {
      expect(called).to.be(0);
      done();
    }, 100);
  });
});
