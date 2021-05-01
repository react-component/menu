import * as React from 'react';

export const IdContext = React.createContext<string>(null);

/**
 * Get `data-menu-id`
 */
export function useMenuId(eventKey: string) {
  const id = React.useContext(IdContext);
  return `${id}-${eventKey}`;
}
