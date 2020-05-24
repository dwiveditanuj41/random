import { useMemo, useContext } from 'react';
import axios from 'axios';
import { Auth } from 'aws-amplify';

import AuthContext from '../contexts/AuthContext';

const useApi = baseURL => {
  const { authToken, updateToken } = useContext(AuthContext);

  const api = useMemo(() => {
    const apiItem = axios.create({
      baseURL: baseURL || process.env.REACT_APP_API_BASE_URL,
    });

    apiItem.interceptors.request.use(async config => {
      const user = await Auth.currentAuthenticatedUser({ bypassCache: false });
      if (user) {
        const updatedAuthToken = user.getSignInUserSession().getIdToken()
          .jwtToken;
        if (updatedAuthToken !== authToken) {
          updateToken(updatedAuthToken);
        }
        // eslint-disable-next-line no-param-reassign
        config.headers = {
          Authorization: updatedAuthToken,
        };
      }
      return config;
    });

    return apiItem;
  }, [baseURL, authToken, updateToken]);

  return api;
};

export default useApi;
