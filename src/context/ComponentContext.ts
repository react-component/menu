import * as React from 'react';
import type { Components, ComponentType } from '../interface';

const ComponentContext = React.createContext<Components>({});

export function useComponent<T>(type: ComponentType, fallbackComponent: T): T {
  const components = React.useContext(ComponentContext);
  return (components[type] as T) || fallbackComponent;
}

export default ComponentContext;
