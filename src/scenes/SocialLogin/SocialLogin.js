import React, { useEffect, useContext } from 'react';
import { Dimmer, Loader } from '@indshine/ui-kit';
import { Auth } from 'aws-amplify';
import { CognitoAuth } from 'amazon-cognito-auth-js';
import { toast } from 'react-toastify';
import { Redirect } from 'react-router-dom';

import AuthContext from '../../contexts/AuthContext';

const SocialLogin = () => {
  const { updateUserAndToken, authToken } = useContext(AuthContext);

  useEffect(() => {
    const socialParams = {
      ClientId: process.env.REACT_APP_USER_POOL_WEB_CLIENT_ID,
      AppWebDomain: process.env.REACT_APP_SOCIAL_WEB_DOMAIN,
      TokenScopesArray: ['openid', 'email', 'profile'],
      RedirectUriSignIn: `${window.location.origin}/social`,
      RedirectUriSignOut: `${window.location.origin}/social`,
      IdentityProvider: 'Google',
      UserPoolId: process.env.REACT_APP_USER_POOL_ID,
      responseType: 'code',
    };

    const authClient = new CognitoAuth(socialParams);

    authClient.userhandler = {
      onSuccess: async () => {
        const user = await Auth.currentAuthenticatedUser();
        if (user) {
          const updatedAuthToken = user.getSignInUserSession().getIdToken().jwtToken;
          updateUserAndToken(user, updatedAuthToken);
        }
      },
      onFailure: error => {
        const errorMessage = error || 'Something went wrong. Please try again';
        toast.error(errorMessage);
      },
    };

    const curUrl = window.location.href;
    authClient.parseCognitoWebResponse(curUrl);

    return () => {};
  }, [updateUserAndToken]);

  if (authToken) {
    return (
      <Redirect
        to={{
          pathname: '/projects',
        }}
      />
    );
  }

  return (
    <Dimmer active inverted>
      <Loader>Verifying User...</Loader>
    </Dimmer>
  );
};
export default SocialLogin;
