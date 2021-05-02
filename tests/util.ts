import { mount as originMount } from 'enzyme';
import type {
  ReactWrapper as OriginReactWrapper,
  MountRendererProps,
} from 'enzyme';

export type ReactWrapper = OriginReactWrapper & {
  flush: () => ReactWrapper;
  isActive: (index?: number) => boolean;
};

export const mount = originMount as (
  node: React.ReactElement,
  options?: MountRendererProps,
) => ReactWrapper;
