const now = Date.now();
export default  {
  noop() {
  },

  getKeyFromChildrenIndex(child, index) {
    return child.key || 'rcMenuItem_' + now + '_' + index;
  },
};
