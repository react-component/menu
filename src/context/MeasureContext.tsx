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

// ========================= Path Connect ==========================
export const PathConnectContext = React.createContext<string[]>(EmptyList);

export function useKeyPath(eventKey: string) {
  const parentKeyPath = React.useContext(PathConnectContext);
  return React.useMemo(() => [...parentKeyPath, eventKey], [
    parentKeyPath,
    eventKey,
  ]);
}

// =========================== Path User ===========================
export interface PathUserContextProps {
  isSubPathKey: (pathKeys: string[], eventKey: string) => boolean;
  getKeyPath: (eventKey: string) => string[];
}

export const PathUserContext = React.createContext<PathUserContextProps>(null);
