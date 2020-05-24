import React from 'react';

import useApi from '../hooks/useApi';

const withApi = (WrappedComponent, baseURL) => {
  return React.forwardRef((props, ref) => {
    const api = useApi(baseURL);

    return <WrappedComponent {...props} ref={ref} api={api} />;
  });
};

export default withApi;
