import { act } from '@testing-library/react';
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

const globalTimeout = global.setTimeout;

export const sleep = async (timeout = 0) => {
  await act(async () => {
    await new Promise(resolve => {
      globalTimeout(resolve, timeout);
    });
  });
};
