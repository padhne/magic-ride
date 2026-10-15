import { useEffect, useState } from 'react';

/**
 * Delays updating the value until the user stops typing for `delay` ms.
 * Used for the place search input (300ms debounce per spec).
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
