import type { MenuHoverEventHandler } from '../interface';

interface ActiveObj {
  onMouseEnter?: React.MouseEventHandler<HTMLElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLElement>;
}

export default function useMouseEvents(
  eventKey: string,
  disabled: boolean,
  onMouseEnter?: MenuHoverEventHandler,
  onMouseLeave?: MenuHoverEventHandler,
): ActiveObj {
  const ret: ActiveObj = {};

  // Skip when disabled
  if (!disabled) {
    ret.onMouseEnter = domEvent => {
      onMouseEnter?.({
        key: eventKey,
        domEvent,
      });
    };
    ret.onMouseLeave = domEvent => {
      onMouseLeave?.({
        key: eventKey,
        domEvent,
      });
    };
  }

  return ret;
}
