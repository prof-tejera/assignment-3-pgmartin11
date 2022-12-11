import { useEffect, useRef, useState } from 'react';

export const usePersistedStatePolling = (storageKey, fallbackValue) => {
  const [value, setValue] = useState(() => {
    const storedValue = window.localStorage.getItem(storageKey);

    if (storedValue === null || typeof storedValue === 'undefined') {
      console.log('fallback', fallbackValue);
      return fallbackValue;
    }

    try {
      return JSON.parse(storedValue);
    } catch (e) {
      console.log('Error parsing stored value', e);
      return null;
    }
  });

  useEffect(() => {
 //   const i = setInterval(() => {
 //   const t = setTimeout(() => {
      if (value !== null || typeof value !== 'undefined') {
        window.localStorage.setItem(storageKey, JSON.stringify(value));
      } else {
        window.localStorage.removeItem(storageKey);
      }
  //  }, 2000);

    // return () => clearInterval(i);
    /*
    return () => {
      if (t) {
        clearTimeout(t);
      }
    };
    */
  }, [value]);

  return [
    value,
    setValue,
    () => {
      setValue(fallbackValue);
    },
  ];
};
