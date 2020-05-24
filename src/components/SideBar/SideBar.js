import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import {
  MdSettings,
  MdArchive,
  MdMoreVert,
  MdPublic,
  MdCreditCard,
} from 'react-icons/md';
import { Divider, Dropdown, Segment, Loader, Message } from '@indshine/ui-kit';
import styled from 'styled-components';
import { Link, withRouter } from 'react-router-dom';
import { get } from 'lodash-es';

import ChangeInfo from '../ChangeInfo';
import ChangePassword from '../ChangePassword';
import AuthContext from '../../contexts/AuthContext';
import UserAvatar from '../UserAvatar';
import ProfilePictureUploader from '../ProfilePictureUploader';
import mediaQuerySize from '../../utils/mediaQuerySize';
import DeleteProfilePictureModal from '../ProfilePictureUploader/DeleteProfilePictureModal/DeleteProfilePictureModal';

const Sidebar = ({ location, isOpen }) => {
  const { userInfo, loadingUserInfo, updateUserInfo } = useContext(AuthContext);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [isUserInfoOpen, setIsUserInfoOpen] = useState(false);

  const onPasswordChange = () => {
    setIsPasswordOpen(!isPasswordOpen);
  };

  const onUserInfoChange = () => {
    setIsUserInfoOpen(!isUserInfoOpen);
  };

  return (
    <SideNav isOpen={isOpen}>
      {(() => {
        if (loadingUserInfo) {
          return (
            <Segment basic>
              <Loader active size="mini" />
            </Segment>
          );
        }

        if (!userInfo) {
          return (
            <Message
              icon="warning circle"
              header="Something went wrong"
              content="Please try again"
              size="mini"
            />
          );
        }

        return (
          <React.Fragment>
            <InfoContainer>
              <ProfilePictureUploader trigger={<UserAvatar size="medium" />} />

              <AuthorInfo>
                <Name>{`${userInfo.firstName} ${userInfo.lastName}`}</Name>
                <Email>{userInfo.email}</Email>
              </AuthorInfo>
            </InfoContainer>
            <StyledLink to="/projects">
              <Item active={get(location, 'pathname') === '/projects'}>
                <MdPublic size={24} />
                <div>Projects</div>
              </Item>
            </StyledLink>
            <StyledLink to="/archive">
              <Item active={get(location, 'pathname') === '/archive'}>
                <MdArchive size={24} />
                <div>Archived Files</div>
              </Item>
            </StyledLink>
            <StyledLink to="/billing">
              <Item active={get(location, 'pathname') === '/billing'}>
                <MdCreditCard size={24} />
                <div>Billing</div>
              </Item>
            </StyledLink>

            <StyledDivider />
            <Item>
              <MdSettings size={24} />
              <div>Settings</div>
              <Spacer />

              <StyledDropdown
                trigger={
                  <MenuIcon
                    size={20}
                    onClick={event => {
                      event.preventDefault();
                    }}
                  />
                }
                direction="left"
                closeOnChange
              >
                <Dropdown.Menu
                  onClick={event => {
                    event.preventDefault();
                  }}
                >
                  <ChangePassword
                    trigger={
                      <Dropdown.Item onClick={onPasswordChange}>
                        Change Password
                      </Dropdown.Item>
                    }
                    resetState={onPasswordChange}
                    isOpen={isPasswordOpen}
                  />
                  <ChangeInfo
                    trigger={
                      <Dropdown.Item onClick={onUserInfoChange}>
                        Change Information
                      </Dropdown.Item>
                    }
                    resetState={onUserInfoChange}
                    isOpen={isUserInfoOpen}
                  />
                  <DeleteProfilePictureModal
                    trigger={
                      <Dropdown.Item> Remove Profile Picture</Dropdown.Item>
                    }
                    apiEndpoint={`/users/${userInfo.id}`}
                    onDelete={() => {
                      updateUserInfo({
                        picture: null,
                      });
                    }}
                  />
                </Dropdown.Menu>
              </StyledDropdown>
            </Item>

            <StyledDivider />
            <Spacer />
          </React.Fragment>
        );
      })()}
    </SideNav>
  );
};

Sidebar.propTypes = {
  location: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

export default withRouter(Sidebar);

const SideNav = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 4em;
  bottom: 0;
  width: 20em;
  height: calc(100vh - 4em);
  z-index: 100;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.05);
  transition-duration: 0.2s;

  @media ${mediaQuerySize.md} {
    transform: ${props =>
      props.isOpen ? `translateX(0em)` : `translateX(-20em)`};
    z-index: 100;
    background-color: #fff;
  }
`;

const InfoContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  color: ${props => props.theme.light.grey};
  padding: 1.25em;

  & > * + * {
    margin-left: 1em;
  }
`;

const AuthorInfo = styled.div`
  overflow: hidden;
`;

const Name = styled.div`
  font-size: 1.1em;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const Email = styled.div`
  font-size: 0.9em;
  margin: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const Item = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
  color: ${props =>
    props.active ? props.theme.light.background : props.theme.light.grey};
  padding: 0.75em 1.25em;
  background: ${props =>
    props.active ? props.theme.light.blue : 'transparent'};

  & > * + * {
    margin-left: 1em;
  }
`;

const StyledDivider = styled(Divider)`
  margin: 0 !important;
  opacity: 0.4;
`;

const Spacer = styled.div`
  flex-grow: 1;
`;

const StyledDropdown = styled(Dropdown)`
  & > .dropdown.icon {
    display: none !important;
  }
`;

const MenuIcon = styled(MdMoreVert)`
  margin-right: 0 !important;
`;

const StyledLink = styled(Link)`
  display: block;

  &:active,
  &:focus {
    outline: none;
  }
`;
