import { useState, useEffect, useCallback } from 'react';
import { get } from 'lodash-es';

import useApi from './useApi';

const DEFAULT_OPTIONS = {
  retainPreviousData: false,
  dummy: false,
};

const useData = (apiEndPoint, baseURL = null, options = DEFAULT_OPTIONS) => {
  const dataOptions = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  const api = useApi(baseURL);

  const [loading, setLoading] = useState(true);

  const [data, setData] = useState(null);

  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const { data: responseData } = await api.get(apiEndPoint);

      setData(responseData);
      setError(null);
    } catch (e) {
      setData(null);
      setError(get(e, 'response.data'));
    } finally {
      setLoading(false);
    }
  }, [apiEndPoint, api]);

  useEffect(() => {
    if (dataOptions.dummy) {
      setLoading(false);
      setError(null);
      setData(null);
    }

    setLoading(true);
    setError(null);
    if (!dataOptions.retainPreviousData) {
      setData(null);
    }

    fetchData();
  }, [dataOptions.dummy, dataOptions.retainPreviousData, fetchData]);

  return {
    loading,
    data,
    error,
    setData,
  };
};

export default useData;
