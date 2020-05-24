import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Route as ReactRouterRoute, Redirect } from 'react-router-dom';

import AuthContext from '../../contexts/AuthContext';

const Route = ({ protectedRoute, ...restProps }) => {
  const { authToken } = useContext(AuthContext);

  if (!protectedRoute) {
    return <ReactRouterRoute {...restProps} />;
  }

  if (!authToken) {
    return (
      <Redirect
        to={{
          pathname: '/login',
        }}
      />
    );
  }

  return <ReactRouterRoute {...restProps} />;
};

Route.propTypes = {
  protectedRoute: PropTypes.bool,
  userRoles: PropTypes.arrayOf(PropTypes.string),
};

Route.defaultProps = {
  protectedRoute: false,
  userRoles: [],
};

export default Route;
