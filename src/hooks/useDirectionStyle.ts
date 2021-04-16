import * as React from 'react';
import { MenuContext } from '../context';

export default function useDirectionStyle(
  keyPath: string[],
): React.CSSProperties {
  const { mode, rtl, inlineIndent } = React.useContext(MenuContext);

  if (mode !== 'inline') {
    return null;
  }

  const len = keyPath.length;
  return rtl
    ? { paddingRight: len * inlineIndent }
    : { paddingLeft: len * inlineIndent };
}
