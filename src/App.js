import React from 'react';
import { ThemeProvider } from 'styled-components';
import { theme, Dimmer, Loader } from '@indshine/ui-kit';
import { Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Amplify from 'aws-amplify';

import Auth from './components/Auth';
import Route from './components/Route';

import Login from './scenes/Login';
import Home from './scenes/Home';
import Archive from './scenes/Archive';
import SocialLogin from './scenes/SocialLogin';
import Projects from './scenes/Projects';
import PasswordReset from './scenes/PasswordReset';
import Billing from './scenes/Billing';

Amplify.configure({
  Auth: {
    region: process.env.REACT_APP_REGION,
    userPoolId: process.env.REACT_APP_USER_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_USER_POOL_WEB_CLIENT_ID,
    authenticationFlowType: 'USER_PASSWORD_AUTH',
  },
  social: {
    FB: process.env.REACT_APP_FB,
    userPoolId: process.env.REACT_APP_USER_POOL_ID,
  },
});

const Project = React.lazy(() => import('./scenes/Project'));

const App = () => {
  return (
    <React.Fragment>
      <ToastContainer
        position="top-right"
        hideProgressBar
        autoClose={5000}
        closeOnClick
      />
      <ThemeProvider theme={theme}>
        <Auth>
          <React.Fragment>
            <React.Suspense
              fallback={
                <Dimmer active inverted>
                  <Loader />
                </Dimmer>
              }
            >
              <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/login" component={Login} />
                <Route path="/social" component={SocialLogin} />
                <Route path="/reset-password" component={PasswordReset} exact />

                <Route
                  path="/projects"
                  exact
                  component={Projects}
                  protectedRoute
                />
                <Route
                  path="/archive"
                  exact
                  component={Archive}
                  protectedRoute
                />

                <Route
                  path="/projects/:projectId"
                  component={Project}
                  protectedRoute
                />

                <Route path="/billing" component={Billing} protectedRoute />
              </Switch>
            </React.Suspense>
          </React.Fragment>
        </Auth>
      </ThemeProvider>
    </React.Fragment>
  );
};

export default App;
