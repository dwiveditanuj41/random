import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Dialog, Modal, Header, Button } from '@indshine/ui-kit';
import { get } from 'lodash-es';
import { toast } from 'react-toastify';

import Form from '../../Form';
import useApi from '../../../hooks/useApi';

const EditProjectModal = ({ trigger, onUpdate, project }) => {
  const [loading, setLoading] = useState(false);

  const form = useRef();

  const api = useApi();

  return (
    <Dialog trigger={trigger} size="mini">
      {({ closeModal }) => (
        <React.Fragment>
          <Modal.Header as={Header} size="small" color="grey">
            Edit Project Name
          </Modal.Header>
          <Modal.Content>
            <Form
              config={[
                {
                  id: 'name',
                  type: 'string',
                  label: 'Project Name',
                  initialValue: project.name,
                  required: true,
                },
              ]}
              ref={form}
            />
          </Modal.Content>
          <Modal.Actions>
            <Button
              primary
              loading={loading}
              size="mini"
              onClick={async () => {
                const data = form.current.getData();
                if (data) {
                  const { name } = data;
                  setLoading(true);
                  try {
                    await api.put(`/projects/${project.id}`, {
                      name,
                    });
                    onUpdate({
                      ...project,
                      name,
                    });
                    closeModal();
                  } catch (error) {
                    const errorMessage = get(
                      error,
                      'response.data.message',
                      'Something went wrong. Please try again',
                    );
                    toast.error(errorMessage);
                  } finally {
                    setLoading(false);
                  }
                }
              }}
            >
              Update
            </Button>
            <Button primary basic size="mini" onClick={closeModal}>
              Cancel
            </Button>
          </Modal.Actions>
        </React.Fragment>
      )}
    </Dialog>
  );
};

EditProjectModal.propTypes = {
  trigger: PropTypes.node.isRequired,
  onUpdate: PropTypes.func.isRequired,
  project: PropTypes.object.isRequired,
};

export default EditProjectModal;
