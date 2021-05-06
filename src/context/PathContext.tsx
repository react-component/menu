import * as React from 'react';

const EmptyList: string[] = [];

// ========================= Path Register =========================
export interface PathRegisterContextProps {
  registerPath: (key: string, keyPath: string[]) => void;
  unregisterPath: (key: string, keyPath: string[]) => void;
}

export const PathRegisterContext = React.createContext<PathRegisterContextProps>(
  null,
);

export function useMeasure() {
  return React.useContext(PathRegisterContext);
}

// ========================= Path Tracker ==========================
export const PathTrackerContext = React.createContext<string[]>(EmptyList);

export function useFullPath(eventKey?: string) {
  const parentKeyPath = React.useContext(PathTrackerContext);
  return React.useMemo(
    () =>
      eventKey !== undefined ? [...parentKeyPath, eventKey] : parentKeyPath,
    [parentKeyPath, eventKey],
  );
}

// =========================== Path User ===========================
export interface PathUserContextProps {
  isSubPathKey: (pathKeys: string[], eventKey: string) => boolean;
}

export const PathUserContext = React.createContext<PathUserContextProps>(null);
