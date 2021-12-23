import * as React from 'react';
import type { MenuProps } from '../Menu';

export interface PrivateContextProps {
  _internalRenderMenuItem?: MenuProps['_internalRenderMenuItem'];
  _internalRenderSubMenuItem?: MenuProps['_internalRenderSubMenuItem'];
}

const PrivateContext = React.createContext<PrivateContextProps>({});

export default PrivateContext;
