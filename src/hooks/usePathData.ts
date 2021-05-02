import { parseKeys } from '../utils/nodeUtil';
import * as React from 'react';

export default function usePathData(children?: React.ReactNode) {
  const pathData = React.useMemo(() => parseKeys(children), [children]);
  console.log('>>>>>>', pathData);
}
