import React from 'react';

const AuthContext = React.createContext({
  authToken: null,
  checkUserRegistered: null,
  signUp: null,
  confirmSignUp: null,
  signInWithEmailPassword: null,
  signInWithFacebook: null,
  signInWithGoogle: null,
  signOut: null,
  isUserRegistered: null,
  resendVerificationCode: null,
  user: null,
  updateUserAndToken: null,
  updateToken: null,
  userInfo: null,
  loadingUserInfo: null,
  updateUserInfo: null,
});

export default AuthContext;
