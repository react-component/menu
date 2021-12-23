import * as React from 'react';
import type { MenuProps } from '../Menu';

export interface PrivateContextProps {
  _internalRenderMenuItem?: MenuProps['_internalRenderMenuItem'];
}

const PrivateContext = React.createContext<PrivateContextProps>({});

export default PrivateContext;
