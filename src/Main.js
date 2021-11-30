import React from 'react';
import { useDispatch } from 'react-redux';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import { onlineStatus } from './units/asyncFuncs';
import { setNetworkStatus } from './store/actions';

/**
 * @return component
 */

export default function Main() {
  const dispatch = useDispatch();
  const colorScheme = useColorScheme();

  const netStat = async () => {
    const status = await onlineStatus();
    dispatch(setNetworkStatus({ err: status.err, isOnline: status.data }));
  };

  React.useEffect(() => {
    const id = setInterval(() => {
      netStat();
    }, 5000);
    return () => {
      clearInterval(id);
    };
  }, []);

  const isLoadingComplete = useCachedResources();
  if (!isLoadingComplete) return null;
  else return <Navigation colorScheme={colorScheme} />;
}
