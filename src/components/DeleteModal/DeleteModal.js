import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash-es';
import { toast } from 'react-toastify';
import { Dialog, Button, Icon, Header, Modal } from '@indshine/ui-kit';

import useApi from '../../hooks/useApi';

const DeleteModal = ({
  itemType,
  apiEndpoint,
  modalTitle,
  modalContent,
  trigger,
  onDelete,
}) => {
  const [deleting, setDeleting] = useState(false);
  const api = useApi();

  const deleteItem = async () => {
    setDeleting(true);
    try {
      const response = await api.delete(apiEndpoint);
      if (response.status === 200) {
        toast.success('Successfully Moved to Archive');
        setDeleting(false);
      }
      onDelete();
    } catch (error) {
      const errorMessage = get(
        error,
        'response.data.message',
        'Something went wrong. Please try again',
      );
      toast.error(errorMessage);
      setDeleting(false);
    }
  };

  return (
    <Dialog trigger={trigger} basic size="small">
      {({ closeModal }) => (
        <React.Fragment>
          <Header icon="trash" content={modalTitle || `Delete ${itemType}`} />
          <Modal.Content>
            <p>
              {itemType} {modalContent}
            </p>
          </Modal.Content>
          <Modal.Actions>
            <Button basic color="grey" inverted onClick={closeModal}>
              <Icon name="remove" /> No
            </Button>
            <Button
              color="red"
              inverted
              onClick={() => {
                deleteItem();
              }}
              loading={deleting}
              disabled={deleting}
            >
              <Icon name="checkmark" />
              Yes
            </Button>
          </Modal.Actions>
        </React.Fragment>
      )}
    </Dialog>
  );
};

DeleteModal.propTypes = {
  apiEndpoint: PropTypes.string,
  itemType: PropTypes.string,
  modalTitle: PropTypes.string,
  trigger: PropTypes.node.isRequired,
  onDelete: PropTypes.func.isRequired,
  modalContent: PropTypes.string,
};

DeleteModal.defaultProps = {
  apiEndpoint: '',
  itemType: '',
  modalTitle: 'Delete',
  modalContent: 'once deleted cannot be restored. Do you want to continue?',
};

export default DeleteModal;
