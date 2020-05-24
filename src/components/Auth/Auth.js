import React from 'react';
import PropTypes from 'prop-types';
import { Auth as Authenticator } from 'aws-amplify';
import { Dimmer, Loader } from '@indshine/ui-kit';
import { get } from 'lodash-es';
import { toast } from 'react-toastify';
import axios from 'axios';

import AuthContext from '../../contexts/AuthContext';
import getFirstAndLastName from '../../utils/getName';

class Auth extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  state = {
    verifyingAuth: true,
    authToken: null,
    user: null,
    userInfo: null,
    loadingUserInfo: null,
  };

  async componentDidMount() {
    try {
      const user = await Authenticator.currentAuthenticatedUser();
      if (user) {
        const authToken = user.getSignInUserSession().getIdToken().jwtToken;
        this.setState({ user, authToken }, () => {
          this.fetchUserInfo();
        });
      }
    } catch (error) {
      this.setState({ user: null, authToken: null });
    } finally {
      this.setState({ verifyingAuth: false });
    }
  }

  changePassword = async (user, oldPassword, newPassword) => {
    try {
      const response = await Authenticator.changePassword(
        user,
        oldPassword,
        newPassword,
      );
      return response;
    } catch (error) {
      const errorMessage = get(
        error,
        'message',
        'Something went wrong. Please try again',
      );
      toast.error(errorMessage);
      return false;
    }
  };

  signUp = async (name, email, password) => {
    try {
      const {
        firstName: givenName,
        lastName: familyName,
      } = getFirstAndLastName(name);

      const username = email.toLowerCase();

      const newUser = await Authenticator.signUp({
        username,
        password,
        attributes: {
          given_name: givenName,
          family_name: familyName,
        },
      });
      return newUser;
    } catch (error) {
      const errorMessage = get(
        error,
        'message',
        'Something went wrong. Please try again',
      );
      toast.error(errorMessage);
    }
    return false;
  };

  confirmSignUp = async (email, code) => {
    const username = email.toLowerCase();
    try {
      const success = await Authenticator.confirmSignUp(username, code, {
        forceAliasCreation: false,
      });

      if (success === 'SUCCESS') {
        return true;
      }

      toast.error('Something went wrong. Please try again');
      return false;
    } catch (error) {
      const errorMessage = get(
        error,
        'message',
        'Something went wrong. Please try again',
      );
      toast.error(errorMessage);
    }
    return false;
  };

  signInWithEmailPassword = async (email, password) => {
    try {
      const user = await Authenticator.signIn(email.toLowerCase(), password);
      if (user) {
        this.setState(
          {
            authToken: user.getSignInUserSession().getIdToken().jwtToken,
            user,
          },
          () => {
            this.fetchUserInfo();
          },
        );
        return true;
      }
      return false;
    } catch (error) {
      const errorMessage = get(
        error,
        'message',
        'Something went wrong. Please try again',
      );
      toast.error(errorMessage);
      return false;
    }
  };

  fetchUserInfo = async () => {
    this.setState({
      loadingUserInfo: true,
    });
    const { user, authToken } = this.state;
    const api = axios.create({
      baseURL: process.env.REACT_APP_API_BASE_URL,
      headers: {
        Authorization: authToken.jwtToken || authToken,
      },
    });

    const cognitoUserName = user.getSignInUserSession().getIdToken().payload[
      'cognito:username'
    ];

    try {
      const { data: userInfo } = await api.get(`/users/${cognitoUserName}`);
      this.setState({
        userInfo,
      });
    } catch (error) {
      const errorMessage = get(
        error,
        'response.data.message',
        'Something went wrong. Please try again',
      );
      toast.error(errorMessage);
      this.setState({ userInfo: null });
    } finally {
      this.setState({ loadingUserInfo: false });
    }
  };

  signInWithFacebook = () => {
    const url = `https://${
      process.env.REACT_APP_SOCIAL_WEB_DOMAIN
    }/oauth2/authorize?redirect_uri=${
      window.location.origin
    }/social&response_type=code&client_id=${
      process.env.REACT_APP_USER_POOL_WEB_CLIENT_ID
    }&identity_provider=Facebook`;

    window.location.assign(url);
  };

  signInWithGoogle = () => {
    try {
      const url = `https://${
        process.env.REACT_APP_SOCIAL_WEB_DOMAIN
      }/oauth2/authorize?redirect_uri=${
        window.location.origin
      }/social&response_type=code&client_id=${
        process.env.REACT_APP_USER_POOL_WEB_CLIENT_ID
      }&identity_provider=Google`;
      window.location.assign(url);
      return true;
    } catch (error) {
      const errorMessage = get(
        error,
        'message',
        'Something went wrong. Please try again',
      );
      toast.error(errorMessage);
      return false;
    }
  };

  signOut = async () => {
    try {
      await Authenticator.signOut();
      this.setState({
        user: null,
        authToken: null,
        userInfo: null,
        loadingUserInfo: null,
      });
    } catch (error) {
      const errorMessage = get(
        error,
        'message',
        'Something went wrong. Please try again',
      );
      toast.error(errorMessage);
    }
  };

  updateUserAndToken = (user, authToken, cb = () => {}) => {
    this.setState({ user, authToken }, () => {
      this.fetchUserInfo();
      cb();
    });
  };

  updateToken = authToken => {
    this.setState({ authToken });
  };

  isUserRegistered = async email => {
    try {
      const api = axios.create({
        baseURL: process.env.REACT_APP_API_BASE_URL,
      });
      const { data } = await api.get(`/users?email=${email.toLowerCase()}`);
      return data;
    } catch (error) {
      const errorMessage = get(
        error,
        'message',
        'Something went wrong. Please try again',
      );
      toast.error(errorMessage);
      return null;
    }
  };

  resendVerificationCode = async email => {
    try {
      await Authenticator.resendSignUp(email.toLowerCase());
      return true;
    } catch (error) {
      const errorMessage = get(
        error,
        'message',
        'Something went wrong. Please try again',
      );
      toast.error(errorMessage);
      return false;
    }
  };

  updateUserInfo = updatedUserInfo => {
    this.setState(
      state => ({
        userInfo: {
          ...state.userInfo,
          ...updatedUserInfo,
        },
      }),
      () => {
        const { user, userInfo } = this.state;
        Authenticator.updateUserAttributes(user, {
          given_name: userInfo.firstName,
          family_name: userInfo.lastName,
          picture: get(userInfo, 'picture.default', '') || '',
        });
      },
    );
  };

  render() {
    const { authToken, user, verifyingAuth } = this.state;

    if (verifyingAuth) {
      return (
        <Dimmer active inverted>
          <Loader>Verifying User...</Loader>
        </Dimmer>
      );
    }

    return (
      <AuthContext.Provider
        value={{
          authToken,
          signUp: this.signUp,
          confirmSignUp: this.confirmSignUp,
          signInWithEmailPassword: this.signInWithEmailPassword,
          signInWithFacebook: this.signInWithFacebook,
          signInWithGoogle: this.signInWithGoogle,
          signOut: this.signOut,
          isUserRegistered: this.isUserRegistered,
          resendVerificationCode: this.resendVerificationCode,
          user,
          userInfo: this.state.userInfo,
          loadingUserInfo: this.state.loadingUserInfo,
          changePassword: this.changePassword,
          updateUserAndToken: this.updateUserAndToken,
          updateUserInfo: this.updateUserInfo,
          updateToken: this.updateToken,
        }}
      >
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}

export default Auth;
