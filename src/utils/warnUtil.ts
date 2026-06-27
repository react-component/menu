import { warning } from '@rc-component/util';

/**
 * `onClick` still exposes deprecated `info.item` for backward compatibility.
 * Keep warning since function components no longer provide a React node instance.
 */
export function warnItemProp<T extends { item: React.ReactInstance }>({ item, ...restInfo }: T): T {
  Object.defineProperty(restInfo, 'item', {
    get: () => {
      warning(
        false,
        '`info.item` is deprecated since we will move to function component that not provides React Node instance in future.',
      );

      return item;
    },
  });

  return restInfo as T;
}
