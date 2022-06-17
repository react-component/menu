import * as React from 'react';

export const IdContext = React.createContext<string>(null);

export function getMenuId(uuid: string, eventKey: React.Key) {
  if (uuid === undefined) {
    return null;
  }
  return `${uuid}-${eventKey}`;
}

/**
 * Get `data-menu-id`
 */
export function useMenuId(eventKey: React.Key) {
  const id = React.useContext(IdContext);
  return getMenuId(id, eventKey);
}
