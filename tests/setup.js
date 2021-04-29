window.requestAnimationFrame = func => {
  const id = window.setTimeout(func, 16);
  return id;
};
window.cancelAnimationFrame = id => window.clearTimeout(id);

const Enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');
require('regenerator-runtime/runtime');

Enzyme.configure({ adapter: new Adapter() });

Object.assign(Enzyme.ReactWrapper.prototype, {
  isActive(index = 0) {
    return this.find('li.rc-menu-item').at(index).hasClass('rc-menu-item-active');
  },
  async flush() {
    for (let i = 0; i < 3; i += 1) {
      await Promise.resolve();
    }
  },
});
