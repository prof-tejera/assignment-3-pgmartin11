import { useEffect, useRef, useState } from 'react';

export const usePersistedStatePolling = (storageKey, fallbackValue) => {
  const [value, setValue] = useState(() => {
    const storedValue = window.localStorage.getItem(storageKey);

    if (storedValue === null || !storedValue) {
      console.log('returning fallback', fallbackValue);
      return fallbackValue;
    }

    try {
      console.log('storedValue', storedValue);
      return JSON.parse(storedValue);
    } catch (e) {
      console.log('Error parsing stored value', e);
      return null;
    }
  });

  useEffect(() => {
    //const i = setInterval(() => {
    const i = setTimeout(() => {
      if (value) {
//XXX
//console.log('localStorage key: ',storageKey+'value: '+value);
        window.localStorage.setItem(storageKey, JSON.stringify(value));
      } else {
        window.localStorage.removeItem(storageKey);
      }
    }, 2000);

    //return () => clearInterval(i);
  }, [value]);

  return [
    value,
    setValue,
    () => {
      setValue(fallbackValue);
    },
  ];
};
