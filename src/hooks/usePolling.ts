
import { useEffect, useRef } from 'react';

interface UsePollingOptions {
  enabled?: boolean;
  interval?: number;
  immediate?: boolean;
}

export function usePolling(
  callback: () => void | Promise<void>,
  options: UsePollingOptions = {}
) {
  const {
    enabled = true,
    interval = 5000,
    immediate = true
  } = options;

  const savedCallback = useRef(callback);
  const intervalRef = useRef<NodeJS.Timeout>();

  // Update callback reference
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      return;
    }

    const executeCallback = async () => {
      try {
        await savedCallback.current();
      } catch (error) {
        console.error('Polling callback error:', error);
      }
    };

    // Execute immediately if requested
    if (immediate) {
      executeCallback();
    }

    // Set up interval
    intervalRef.current = setInterval(executeCallback, interval);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enabled, interval, immediate]);

  const stop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const restart = () => {
    stop();
    if (enabled) {
      intervalRef.current = setInterval(savedCallback.current, interval);
    }
  };

  return { stop, restart };
}
