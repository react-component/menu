import { MenuKey } from '@/interface';
import * as React from 'react';

const EmptyList: string[] = [];

// ========================= Path Register =========================
export interface PathRegisterContextProps {
  registerPath: (key: MenuKey, keyPath: MenuKey[]) => void;
  unregisterPath: (key: MenuKey, keyPath: MenuKey[]) => void;
}

export const PathRegisterContext = React.createContext<PathRegisterContextProps>(
  null,
);

export function useMeasure() {
  return React.useContext(PathRegisterContext);
}

// ========================= Path Tracker ==========================
export const PathTrackerContext = React.createContext<MenuKey[]>(EmptyList);

export function useFullPath(eventKey?: MenuKey) {
  const parentKeyPath = React.useContext(PathTrackerContext);
  return React.useMemo(
    () =>
      eventKey !== undefined ? [...parentKeyPath, eventKey] : parentKeyPath,
    [parentKeyPath, eventKey],
  );
}

// =========================== Path User ===========================
export interface PathUserContextProps {
  isSubPathKey: (pathKeys: MenuKey[], eventKey: MenuKey) => boolean;
}

export const PathUserContext = React.createContext<PathUserContextProps>(null);
