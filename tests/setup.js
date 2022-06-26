window.requestAnimationFrame = func => {
  const id = window.setTimeout(func, 16);
  return id;
};
window.cancelAnimationFrame = id => window.clearTimeout(id);
