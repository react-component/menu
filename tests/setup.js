global.requestAnimationFrame = global.requestAnimationFrame || function requestAnimationFrame(cb) {
  return setTimeout(cb, 0);
};

const Enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-15');

Enzyme.configure({ adapter: new Adapter() });
