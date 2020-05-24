import React, { useContext, useRef } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import createCanvas from '@indshine/platform-canvas';
import { get, find } from 'lodash-es';
import { Dropdown, Dimmer, Loader } from '@indshine/ui-kit';

import ShareWidget from '../../components/ShareWidget';
import AuthContext from '../../contexts/AuthContext';
import useData from '../../hooks/useData';
import Uploader from '../../components/Uploader';
import UserAvatar from '../../components/UserAvatar';
import mediaQuerySize from '../../utils/mediaQuerySize';

const { Canvas, Print } = createCanvas({
  mapboxApiToken: process.env.REACT_APP_MAPBOX_ACCESS_TOKEN,
  apiBaseURL: process.env.REACT_APP_API_BASE_URL,
  cogeoBaseURL: process.env.REACT_APP_COGEO_BASE_URL,
  tilesApiBaseURL: process.env.REACT_APP_TILES_API_BASE_URL,
  visualizeCDNURL: process.env.REACT_APP_VISUALIZE_CDN_URL,
  cdnURL: process.env.REACT_APP_CDN_URL,
  measureToolsApiBaseURL: process.env.REACT_APP_MEASURE_TOOLS_API_BASE_URL,
});

const Project = ({ match, history }) => {
  const projectId = get(match, 'params.projectId');

  const { data: sharedUserData } = useData(`/access?project=${projectId}`);

  const { authToken, signOut, userInfo } = useContext(AuthContext);

  const canvas = useRef();

  const onUpload = () => {
    canvas.current.pollLayersData(true);
  };

  if (!sharedUserData) {
    return (
      <Dimmer active inverted>
        <Loader>Loading Map</Loader>
      </Dimmer>
    );
  }

  if (sharedUserData) {
    const userAccess = find(sharedUserData.items, {
      email: userInfo.email,
    });

    const permission = get(userAccess, 'accessType.id');

    return (
      <Canvas
        authToken={authToken}
        projectId={projectId}
        permission={permission}
        ref={canvas}
        renderNavbar={({
          backArrowIcon,
          projectName,
          spacer,
          shareIcon,
          printIcon,
          uploadIcon,
        }) => {
          return (
            <React.Fragment>
              <IconButton
                onClick={() => {
                  history.goBack();
                }}
              >
                {backArrowIcon}
              </IconButton>
              {projectName}
              {spacer}
              <ShareWidget
                trigger={<IconButton hideOnMobile>{shareIcon}</IconButton>}
                projectId={projectId}
              />
              <Print
                trigger={<IconButton hideOnMobile>{printIcon}</IconButton>}
              />
              {permission !== 'can-view' ? (
                <Uploader
                  trigger={<IconButton hideOnMobile>{uploadIcon}</IconButton>}
                  projectId={projectId}
                  onUpload={onUpload}
                />
              ) : null}
              <StyledDropdown
                trigger={<StyledUserAvatar circular />}
                pointing="top right"
              >
                <Dropdown.Menu>
                  <Dropdown.Item
                    text="Sign Out"
                    onClick={() => {
                      signOut();
                    }}
                  />
                </Dropdown.Menu>
              </StyledDropdown>
            </React.Fragment>
          );
        }}
      />
    );
  }
  return null;
};

Project.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default Project;

const IconButton = styled.button`
  border: none;
  padding: 0;
  margin: 0;
  box-shadow: none;
  cursor: pointer;
  color: inherit;
  background-color: transparent;

  &:active,
  &:focus {
    outline: none;
  }

  ${props =>
    props.hideOnMobile &&
    css`
      @media ${mediaQuerySize.md} {
        display: none;
      }
    `};
`;

const StyledDropdown = styled(Dropdown)`
  & > .dropdown.icon {
    display: none !important;
  }

  && {
    @media ${mediaQuerySize.md} {
      margin-left: 0 !important;
    }
  }
`;

const StyledUserAvatar = styled(UserAvatar)``;
