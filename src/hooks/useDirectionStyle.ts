import * as React from 'react';
import { MenuContext } from '../context/MenuContext';

export default function useDirectionStyle(level: number): React.CSSProperties {
  const { mode, rtl, inlineIndent } = React.useContext(MenuContext);

  if (mode !== 'inline') {
    return null;
  }

  const len = Math.max(0, level - 1);
  return rtl
    ? { paddingRight: len * inlineIndent }
    : { paddingLeft: len * inlineIndent };
}
