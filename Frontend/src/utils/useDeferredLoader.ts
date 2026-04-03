import { useEffect, useRef, useState } from 'react';

export function useDeferredLoader(
  loading: boolean,
  delayMs = 300,
  minVisibleMs = 300
) {
  const [visible, setVisible] = useState(false);
  const shownAtRef = useRef<number | null>(null);
  const showTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (showTimerRef.current) {
      clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }

    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }

    if (loading) {
      showTimerRef.current = setTimeout(() => {
        shownAtRef.current = Date.now();
        setVisible(true);
      }, delayMs);
    } else if (visible) {
      const elapsed = shownAtRef.current ? Date.now() - shownAtRef.current : 0;
      const remaining = Math.max(minVisibleMs - elapsed, 0);
      hideTimerRef.current = setTimeout(() => {
        setVisible(false);
        shownAtRef.current = null;
      }, remaining);
    } else {
      setVisible(false);
    }

    return () => {
      if (showTimerRef.current) {
        clearTimeout(showTimerRef.current);
      }
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
    };
  }, [loading, delayMs, minVisibleMs, visible]);

  return visible;
}
