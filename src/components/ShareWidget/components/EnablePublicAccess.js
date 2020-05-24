import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Header, Button } from '@indshine/ui-kit';
import { toast } from 'react-toastify';
import { get } from 'lodash-es';

import useApi from '../../../hooks/useApi';

const EnablePublicAccess = ({
  open,
  onClose,
  projectId,
  updateProject,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);

  const api = useApi();

  return (
    <Modal size="mini" open={open} onClose={onClose}>
      <Modal.Header as={Header} size="small" color="grey">
        Enable Public Access
      </Modal.Header>
      <Modal.Content>
        Currently your project don't have public access. Enable Public access to
        generate embed
      </Modal.Content>
      <Modal.Actions>
        <Button
          primary
          size="mini"
          loading={loading}
          onClick={async () => {
            setLoading(true);
            try {
              await api.put(`/projects/${projectId}`, {
                visibility: 'PUBLIC',
              });
              updateProject();
              onSuccess();
            } catch (error) {
              const errorMessage = get(
                error,
                'message',
                'Something went wrong. Please try again',
              );
              toast.error(errorMessage);
            } finally {
              setLoading(false);
            }
          }}
        >
          Enable Access
        </Button>
        <Button primary basic onClick={onClose} size="mini">
          Cancel
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

EnablePublicAccess.propTypes = {
  projectId: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  updateProject: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default EnablePublicAccess;
