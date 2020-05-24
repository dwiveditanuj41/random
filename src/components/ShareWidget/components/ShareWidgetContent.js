import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  Button,
  Modal,
  Icon,
  Dropdown,
  Loader,
  Header,
  Dimmer,
  Segment,
  Form,
  Message,
  Grid,
} from '@indshine/ui-kit';
import { find, get } from 'lodash-es';
import Clipboard from 'react-clipboard.js';
import { toast } from 'react-toastify';

import useData from '../../../hooks/useData';

import useApi from '../../../hooks/useApi';
import AuthContext from '../../../contexts/AuthContext';
import PublicEmbed from './PublicEmbed';
import AccessDropdown from './AccessDropdown';
import EnablePublicAccess from './EnablePublicAccess';

const ShareWidgetContent = ({ closeModal, projectId }) => {
  const { loading: loadingAccessTypes, data: access } = useData(`/accessTypes`);

  const [embedModalOpen, setEmbedModalOpen] = useState(false);

  const [
    enablePublicAccessModalOpen,
    setEnablePublicAccessModalOpen,
  ] = useState(false);

  const { userInfo: currentUserInfo } = useContext(AuthContext);

  const {
    loading: loadingProjectData,
    data: projectData,
    setData: setProjectData,
  } = useData(`/projects/${projectId}`);

  const [inviting, setInviting] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteAccessType, setInviteAccessType] = useState('can-view');

  const api = useApi();

  const onInviteSubmit = async () => {
    setInviting(true);
    try {
      if (inviteEmail !== '') {
        const { data: user } = await api.post('/access', {
          email: inviteEmail,
          accessType: inviteAccessType,
          project: projectId,
        });
        const userAccessType = find(access, { id: user.accessType });

        await setProjectData({
          ...projectData,
          memberAccess: [
            ...projectData.memberAccess,
            { ...user, accessType: userAccessType },
          ],
        });
      }
    } catch (error) {
      const errorMessage = get(
        error,
        'response.data',
        'Something went wrong. Please try again',
      );
      toast.error(errorMessage);
    } finally {
      setInviting(false);
      setInviteEmail('');
    }
  };

  return (
    <React.Fragment>
      <Modal.Header as={Header} color="grey" size="small">
        Share {get(projectData, 'name', 'project')} with
      </Modal.Header>
      <Modal.Content>
        {(() => {
          if (loadingAccessTypes || loadingProjectData) {
            return (
              <Segment basic>
                <Dimmer active inverted>
                  <Loader size="small">Loading Project Info...</Loader>
                </Dimmer>
              </Segment>
            );
          }

          if (access === null || projectData === null) {
            return (
              <Message
                error
                header="Something went wrong"
                content="Please try again"
              />
            );
          }

          const accessTypes = access.map(accessType => ({
            key: accessType.id,
            value: accessType.id,
            text: accessType.name,
          }));

          const currentUserCanView =
            projectData.memberAccess.filter(user => {
              return (
                currentUserInfo.email === user.email &&
                user.accessType.id === 'can-view'
              );
            }).length === 1;

          return (
            <Grid>
              <Grid.Row verticalAlign="middle">
                <Grid.Column width="12">
                  {(() => {
                    if (projectData.visibility !== 'PUBLIC') {
                      return (
                        <HeadingContainer>
                          <Icon name="low vision" />
                          <PublicAccess a href="#">
                            Public link access is disabled
                          </PublicAccess>
                        </HeadingContainer>
                      );
                    }

                    return (
                      <HeadingContainer>
                        <Icon name="share square" />
                        <PublicAccess a href="#">
                          Public link access is Enabled
                        </PublicAccess>
                      </HeadingContainer>
                    );
                  })()}
                </Grid.Column>
                <Grid.Column width="4">
                  {(() => {
                    if (
                      projectData.visibility !== 'PUBLIC' &&
                      !currentUserCanView
                    ) {
                      return (
                        <LinkAccess
                          onClick={async () => {
                            try {
                              await api.put(`/projects/${projectData.id}`, {
                                visibility: 'PUBLIC',
                              });
                              await setProjectData({
                                ...projectData,
                                visibility: 'PUBLIC',
                              });
                            } catch (error) {
                              const errorMessage = get(
                                error,
                                'response.data',
                                'Something went wrong. Please try again',
                              );
                              toast.error(errorMessage);
                            }
                          }}
                        >
                          Enable link access
                        </LinkAccess>
                      );
                    }
                    if (
                      projectData.visibility === 'PUBLIC' &&
                      !currentUserCanView
                    ) {
                      return (
                        <LinkAccess
                          onClick={async () => {
                            try {
                              await api.put(`/projects/${projectData.id}`, {
                                visibility: 'PRIVATE',
                              });
                              await setProjectData({
                                ...projectData,
                                visibility: 'PRIVATE',
                              });
                            } catch (error) {
                              const errorMessage = get(
                                error,
                                'response.data',
                                'Something went wrong. Please try again',
                              );
                              toast.error(errorMessage);
                            }
                          }}
                        >
                          Disable link access
                        </LinkAccess>
                      );
                    }
                    return null;
                  })()}
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <UsersList>
                    {projectData.memberAccess.map(user => (
                      <Grid.Row verticalAlign="middle" key={user.id}>
                        <Grid.Column width="12">
                          <UserNameContainer>
                            <ProfilePicture>
                              {user.firstName
                                ? user.firstName[0]
                                : user.email[0]}
                            </ProfilePicture>
                            <span>
                              {user.firstName
                                ? `${user.firstName} ${user.lastName}`
                                : user.email}
                            </span>
                          </UserNameContainer>
                        </Grid.Column>
                        <Grid.Column width="4">
                          <AccessDropdown
                            user={user}
                            access={access}
                            trigger={
                              <AccessContainer>
                                {user.accessType.name || user.accessType}
                                <Icon name="caret down" size="small" />
                              </AccessContainer>
                            }
                            currentUserCanView={currentUserCanView}
                            setProjectData={setProjectData}
                            currentUser={currentUserInfo}
                          />
                        </Grid.Column>
                      </Grid.Row>
                    ))}
                  </UsersList>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row verticalAlign="middle">
                <StyledForm>
                  <InputContainer width="12">
                    <InviteInputContainer>
                      <InviteInput
                        placeholder="Invite Someone..."
                        value={inviteEmail}
                        onChange={event => {
                          setInviteEmail(event.target.value);
                        }}
                      />
                      <InputDropdown
                        searchInput="text"
                        direction="left"
                        defaultValue={inviteAccessType}
                        options={
                          currentUserCanView
                            ? accessTypes.slice(1, 2)
                            : accessTypes.slice(0, 2)
                        }
                        onChange={(event, data) => {
                          setInviteAccessType(data.value);
                        }}
                      />
                    </InviteInputContainer>
                  </InputContainer>
                  <Grid.Column width="4">
                    <Button
                      onClick={onInviteSubmit}
                      loading={inviting}
                      primary
                      fluid
                    >
                      Invite
                    </Button>
                  </Grid.Column>
                </StyledForm>
              </Grid.Row>
            </Grid>
          );
        })()}
      </Modal.Content>
      <Modal.Actions>
        <Button
          primary
          size="mini"
          onClick={() => {
            if (projectData.visibility === 'PUBLIC') {
              setEmbedModalOpen(true);
            } else {
              setEnablePublicAccessModalOpen(true);
            }
          }}
        >
          <Icon name="code" /> Public Embed
        </Button>
        <Clipboard
          className="ui mini button primary"
          data-clipboard-text={`${
            window.location.origin
          }/projects/${projectId}`}
        >
          <Icon name="chain" /> Copy Link
        </Clipboard>
        <Button primary basic onClick={closeModal} size="mini">
          Cancel
        </Button>
      </Modal.Actions>

      <PublicEmbed
        projectId={projectId}
        open={embedModalOpen}
        onClose={() => {
          setEmbedModalOpen(false);
        }}
      />
      <EnablePublicAccess
        projectId={projectId}
        open={enablePublicAccessModalOpen}
        onClose={() => {
          setEnablePublicAccessModalOpen(false);
        }}
        updateProject={() => {
          setProjectData({
            ...projectData,
            visibility: 'PUBLIC',
          });
        }}
        onSuccess={() => {
          setEnablePublicAccessModalOpen(false);
          setEmbedModalOpen(true);
        }}
      />
    </React.Fragment>
  );
};

ShareWidgetContent.propTypes = {
  projectId: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default ShareWidgetContent;

const HeadingContainer = styled.div`
  display: flex;
  align-items: center;

  & > * + * {
    margin-left: 0.6em !important;
  }
`;

const AccessContainer = styled.span`
  cursor: pointer;
  color: ${props =>
    props.disabled ? props.theme.light.grey : 'inherit'} !important;
`;

const PublicAccess = styled.span`
  margin-left: 1em;
`;

const LinkAccess = styled.span`
  color: ${props => props.theme.light.blue};
  cursor: pointer;
`;

const UsersList = styled(Grid)`
  max-height: 50vh;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  overflow-y: auto !important;
  overflow-x: none !important;
`;

const UserNameContainer = styled.div`
  display: flex;
  align-items: center;

  & > * + * {
    margin-left: 1em;
  }
`;

const ProfilePicture = styled.span`
  background: ${props => props.theme.light.blue};
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2em;
  height: 2em;
  color: white;
  font-size: 1em;
  text-transform: uppercase;
  border-radius: 50%;
`;

const StyledForm = styled(Form)`
  display: grid !important;
  grid-template-columns: 75% 25% !important;
  width: 100% !important;
  padding: 0 0.5em !important;
`;

const InputContainer = styled(Grid.Column)`
  margin-right: 0.5em !important;
  height: 100% !important;
`;

const InviteInputContainer = styled.div`
  display: grid;
  grid-template-columns: 70% 30% !important;
  border: 0.09em solid ${props => props.theme.light.grey};
  padding: 0.8em;
  border-radius: 0;
`;

const InviteInput = styled.input`
  flex-grow: 1;
  border-width: 0 !important;
  font-size: 1em !important;
  padding: 0 !important;
`;

const InputDropdown = styled(Dropdown)`
  border: 0 !important;
  margin: auto !important;
`;
