import { MenuKey } from '@/interface';
import * as React from 'react';

export const IdContext = React.createContext<string>(null);

export function getMenuId(uuid: string, eventKey: MenuKey) {
  if (uuid === undefined) {
    return null;
  }
  return `${uuid}-${eventKey}`;
}

/**
 * Get `data-menu-id`
 */
export function useMenuId(eventKey: MenuKey) {
  const id = React.useContext(IdContext);
  return getMenuId(id, eventKey);
}
