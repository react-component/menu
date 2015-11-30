const now = Date.now();

export function noop() {
}

export function getKeyFromChildrenIndex(child, menuEventKey, index) {
  const prefix = menuEventKey || '';
  return child.key || prefix + 'item_' + now + '_' + index;
}
