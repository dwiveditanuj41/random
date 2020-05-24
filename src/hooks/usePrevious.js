import { useRef, useEffect } from 'react';

const usePrevious = (data, defaultValue = null) => {
  const prevDataRef = useRef();

  useEffect(() => {
    prevDataRef.current = data;
  });

  const prevData = prevDataRef.current;

  return prevData || defaultValue;
};

export default usePrevious;
