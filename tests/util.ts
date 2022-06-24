// import { mount as originMount } from 'enzyme';
// import type {
//   ReactWrapper as OriginReactWrapper,
//   MountRendererProps,
// } from 'enzyme';

// export type ReactWrapper = OriginReactWrapper & {
//   flush: () => ReactWrapper;
//   isActive: (index?: number) => boolean;
// };

// export const mount = originMount as (
//   node: React.ReactElement,
//   options?: MountRendererProps,
// ) => ReactWrapper;

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
