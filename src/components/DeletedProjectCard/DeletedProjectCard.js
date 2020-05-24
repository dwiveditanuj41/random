import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';
import { MdMoreVert } from 'react-icons/md';
import {
  Card,
  Image,
  Dropdown,
  Loader,
  Dimmer,
  Segment,
} from '@indshine/ui-kit';
import { toast } from 'react-toastify';
import { get } from 'lodash-es';

import useApi from '../../hooks/useApi';

const DeletedProjectCard = ({ project, onRestore }) => {
  const [loading, setLoading] = useState(false);

  const api = useApi();

  const restoreProject = useCallback(async () => {
    setLoading(true);
    try {
      await api.put(`projects/${project.id}`, {
        status: 'ENABLED',
      });

      toast.success('Project Restored Successfully');
      onRestore(project);
    } catch (error) {
      const errorMessage = get(
        error,
        'response.data.message',
        'Something went wrong. Please try again',
      );
      toast.error(errorMessage);
      setLoading(false);
    }
  }, [api, onRestore, project]);

  return (
    <StyledCard>
      <Image
        src={
          project.thumbnail
            ? `${process.env.REACT_APP_VISUALIZE_CDN_URL}/${project.thumbnail}`
            : require('../../images/thumbnail-placeholder.jpg')
        }
      />

      <Card.Content>
        <StyledHeader>{project.name}</StyledHeader>

        <StyledMeta>
          <span>{moment(project.createdAt).format('Do MMM, YYYY')}</span>
          <Spacer />

          {loading ? (
            <LoaderContainer basic>
              <Dimmer active inverted>
                <Loader size="mini" />
              </Dimmer>
            </LoaderContainer>
          ) : (
            <StyledDropdown
              upward
              trigger={<MenuIcon size={20} />}
              direction="left"
              loading={loading}
            >
              <Dropdown.Menu>
                <Dropdown.Item
                  text="Restore Project"
                  onClick={restoreProject}
                />
                <Dropdown.Item text="Delete Project Permanently" />
              </Dropdown.Menu>
            </StyledDropdown>
          )}
        </StyledMeta>
      </Card.Content>
    </StyledCard>
  );
};

DeletedProjectCard.propTypes = {
  project: PropTypes.object.isRequired,
  onRestore: PropTypes.func.isRequired,
};

export default DeletedProjectCard;

const StyledCard = styled(Card)`
  width: 100% !important;
  border-radius: 5px !important;
  margin: 0em !important;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.2) !important;
  font-size: 1.1em !important;
`;

const StyledHeader = styled(Card.Header)`
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
    overflow: visible !important;
  }

  & .menu .item {
    margin: 0 !important;
  }
`;

const LoaderContainer = styled(Segment)`
  margin: 0 !important;
`;
