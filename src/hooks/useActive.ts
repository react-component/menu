import * as React from 'react';
import { MenuContext } from '../context/MenuContext';
import type { MenuHoverEventHandler } from '../interface';

interface ActiveObj {
  active: boolean;
  onMouseEnter?: React.MouseEventHandler<HTMLElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLElement>;
}

export default function useActive(
  eventKey: string,
  disabled: boolean,
  onMouseEnter?: MenuHoverEventHandler,
  onMouseLeave?: MenuHoverEventHandler,
): ActiveObj {
  const {
    // Active
    activeKey,
    onActive,
    onInactive,
  } = React.useContext(MenuContext);

  const ret: ActiveObj = {
    active: activeKey === eventKey,
  };

  // Disabled item never becomes active, but still notifies the hover callbacks
  // so that users can attach tooltips or other hover behaviors to it.
  ret.onMouseEnter = domEvent => {
    onMouseEnter?.({
      key: eventKey,
      domEvent,
    });

    if (!disabled) {
      onActive(eventKey);
    }
  };
  ret.onMouseLeave = domEvent => {
    onMouseLeave?.({
      key: eventKey,
      domEvent,
    });

    if (!disabled) {
      onInactive(eventKey);
    }
  };

  return ret;
}
