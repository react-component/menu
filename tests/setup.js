window.requestAnimationFrame = func => {
  const id = window.setTimeout(func, 16);
  return id;
};
window.cancelAnimationFrame = id => window.clearTimeout(id);

const Enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');

Enzyme.configure({ adapter: new Adapter() });

Object.assign(Enzyme.ReactWrapper.prototype, {});
