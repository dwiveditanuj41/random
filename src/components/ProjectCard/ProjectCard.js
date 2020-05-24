import React, { useContext } from 'react';
import { Card, Image, Dropdown, Header, Popup } from '@indshine/ui-kit';
import { MdMoreVert } from 'react-icons/md';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';
import { slice, find, get } from 'lodash-es';

import Uploader from '../Uploader';
import ShareWidget from '../ShareWidget';
import AuthContext from '../../contexts/AuthContext';
import DeleteModal from '../DeleteModal';
import EditProjectModal from './components/EditProjectModal';
import useData from '../../hooks/useData';
import Avatar from '../Avatar';

const ProjectCard = ({ project, onUpdate, onDelete }) => {
  const { userInfo } = useContext(AuthContext);

  const { data: projectsData } = useData(`/access?project=${project.id}`);

  return (
    <StyledCard>
      <StyledLink to={`/projects/${project.id}`}>
        <Image
          src={
            project.thumbnail
              ? `${process.env.REACT_APP_VISUALIZE_CDN_URL}/${
                  project.thumbnail
                }`
              : require('../../images/thumbnail-placeholder.jpg')
          }
        />
      </StyledLink>
      <Card.Content>
        <StyledLink to={`/projects/${project.id}`}>
          <StyledHeader>{project.name}</StyledHeader>
        </StyledLink>
        <StyledMeta>
          <span className="date">
            {moment(project.createdAt).format('Do MMM, YYYY')}{' '}
          </span>
          <Spacer />
          {(() => {
            if (projectsData && projectsData.items) {
              const { items: sharedUsers } = projectsData;

              const sharedUsersLength = sharedUsers.length;
              const remainingUsers =
                sharedUsersLength > 2 ? sharedUsersLength - 2 : 0;

              return (
                <React.Fragment>
                  {slice(sharedUsers, 0, 2).map(user => {
                    return (
                      <Popup
                        key={user.id}
                        trigger={
                          <Avatar userInfo={user} size="mini" circular />
                        }
                        inverted
                        content={
                          user.firstName
                            ? `${user.firstName} ${user.lastName}`
                            : user.email
                        }
                        size="mini"
                      />
                    );
                  })}
                  {remainingUsers !== 0 && (
                    <Popup
                      trigger={
                        <RemainingUsersContainer>
                          +{remainingUsers}
                        </RemainingUsersContainer>
                      }
                      inverted
                      size="mini"
                      content={
                        <div>
                          {slice(sharedUsers, 2).map(user => (
                            <div key={user.id}>
                              {user.firstName
                                ? `${user.firstName} ${user.lastName}`
                                : user.email}
                            </div>
                          ))}
                        </div>
                      }
                    />
                  )}
                </React.Fragment>
              );
            }

            return null;
          })()}
          <StyledDropdown trigger={<MenuIcon size={20} />} direction="left">
            <Dropdown.Menu>
              <ShareWidget
                trigger={<Dropdown.Item text="Share Project" />}
                projectId={project.id}
              />
              {(() => {
                if (projectsData) {
                  const userAccess = find(projectsData.items, {
                    userId: userInfo.id,
                  });

                  const canUserDeleteProject =
                    get(userAccess, 'accessType.id', 'can-view') === 'owner';
                  const canUserUploadOrEditData =
                    get(userAccess, 'accessType.id', 'can-view') !== 'can-view';

                  return (
                    <React.Fragment>
                      {canUserUploadOrEditData && (
                        <React.Fragment>
                          <Uploader
                            trigger={<Dropdown.Item text="Upload Files" />}
                            projectId={project.id}
                          />
                          <EditProjectModal
                            trigger={<Dropdown.Item text="Edit Project" />}
                            onUpdate={onUpdate}
                            project={project}
                          />
                        </React.Fragment>
                      )}
                      {canUserDeleteProject && (
                        <DeleteModal
                          itemType="Project"
                          apiEndpoint={`/projects/${project.id}`}
                          trigger={<Dropdown.Item text="Delete Project" />}
                          onDelete={() => {
                            onDelete(project);
                          }}
                          modalContent="once deleted can be found in Archive section. Do you want to continue?"
                        />
                      )}
                    </React.Fragment>
                  );
                }
                return null;
              })()}
            </Dropdown.Menu>
          </StyledDropdown>
        </StyledMeta>
      </Card.Content>
    </StyledCard>
  );
};

ProjectCard.propTypes = {
  project: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default ProjectCard;

const StyledLink = styled(Link)`
  display: block;
  color: inherit !important;
`;

const StyledCard = styled(Card)`
  width: 100% !important;
  border-radius: 5px !important;
  margin: 0 !important;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.2) !important;
  font-size: 14px !important;
`;

const StyledHeader = styled(Header)`
  font-weight: 500 !important;
  font-size: 1.1em !important;
`;

const StyledMeta = styled(Card.Meta)`
  font-size: 0.9em !important;
  display: flex !important;
  align-items: center;
`;

const Spacer = styled.div`
  display: flex;
  flex: 1;
`;

const MenuIcon = styled(MdMoreVert)`
  margin-right: 0 !important;
`;

const StyledDropdown = styled(Dropdown)`
  & > .dropdown.icon {
    display: none !important;
  }

  & .menu .item {
    margin: 0 !important;
  }

  & svg {
    display: block !important;
  }
`;

const RemainingUsersContainer = styled.div`
  background-color: ${props => props.theme.light.blue};
  color: ${props => props.theme.light.background};
  width: 1.75rem;
  height: 1.75rem;
  min-width: 1.75rem;
  min-height: 1.75rem;
  font-size: 0.9em;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 700;
`;
