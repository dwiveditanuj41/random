import React, { useContext } from 'react';

import AuthContext from '../../contexts/AuthContext';
import Avatar from '../Avatar';

const UserAvatar = props => {
  const { userInfo } = useContext(AuthContext);

  if (!userInfo) {
    return null;
  }

  return <Avatar userInfo={userInfo} {...props} />;
};

export default UserAvatar;
