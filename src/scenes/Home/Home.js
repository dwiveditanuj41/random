import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';

import About from '../About';
import AuthContext from '../../contexts/AuthContext';

const Home = () => {
  const { user } = useContext(AuthContext);
  if (user) {
    return <Redirect to={{ pathname: '/projects' }} />;
  }
  return <About />;
};

export default Home;
