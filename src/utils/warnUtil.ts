import warning from '@rc-component/util/lib/warning';

/**
 * `onClick` event return `info.item` which point to react node directly.
 * We should warning this since it will not work on FC.
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
