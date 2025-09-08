import * as React from 'react';
import useControlledState from '@rc-component/util/lib/hooks/useControlledState';

const uniquePrefix = Math.random().toFixed(5).toString().slice(2);

let internalId = 0;

export default function useUUID(id?: string) {
  const [uuid, setUUID] = useControlledState(id, id);

  React.useEffect(() => {
    internalId += 1;
    const newId = process.env.NODE_ENV === 'test' ? 'test' : `${uniquePrefix}-${internalId}`;
    setUUID(`rc-menu-uuid-${newId}`);
  }, []);

  return uuid;
}
