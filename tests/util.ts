import { mount as originMount } from 'enzyme';
import type {
  ReactWrapper as OriginReactWrapper,
  MountRendererProps,
} from 'enzyme';
import { act } from 'react-dom/test-utils';

export type ReactWrapper = OriginReactWrapper & {
  flush: () => ReactWrapper;
  isActive: (index?: number) => boolean;
};

export const mount = originMount as (
  node: React.ReactElement,
  options?: MountRendererProps,
) => ReactWrapper;

export function keyDown(wrapper: ReactWrapper, keyCode: number) {
  wrapper.find('ul.rc-menu-root').simulate('keyDown', { which: keyCode });

  act(() => {
    jest.runAllTimers();
    wrapper.update();
  });
}
