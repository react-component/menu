export function isActive(container: HTMLElement, index: number, active = true) {
  const checker = expect(container.querySelectorAll('li.rc-menu-item')[index]);

  if (active) {
    checker.toHaveClass('rc-menu-item-active');
  } else {
    checker.not.toHaveClass('rc-menu-item-active');
  }
}

export function last(elements: NodeListOf<Element>) {
  return elements[elements.length - 1];
}
