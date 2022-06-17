import * as React from 'react';

const EmptyList: React.Key[] = [];

// ========================= Path Register =========================
export interface PathRegisterContextProps {
  registerPath: (key: React.Key, keyPath: React.Key[]) => void;
  unregisterPath: (key: React.Key, keyPath: React.Key[]) => void;
}

export const PathRegisterContext = React.createContext<PathRegisterContextProps>(
  null,
);

export function useMeasure() {
  return React.useContext(PathRegisterContext);
}

// ========================= Path Tracker ==========================
export const PathTrackerContext = React.createContext<React.Key[]>(EmptyList);

export function useFullPath(eventKey?: React.Key) {
  const parentKeyPath = React.useContext(PathTrackerContext);
  return React.useMemo(
    () =>
      eventKey !== undefined ? [...parentKeyPath, eventKey] : parentKeyPath,
    [parentKeyPath, eventKey],
  );
}

// =========================== Path User ===========================
export interface PathUserContextProps {
  isSubPathKey: (pathKeys: React.Key[], eventKey: string) => boolean;
}

export const PathUserContext = React.createContext<PathUserContextProps>(null);
