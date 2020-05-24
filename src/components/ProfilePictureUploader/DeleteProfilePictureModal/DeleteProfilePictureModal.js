import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash-es';
import { toast } from 'react-toastify';
import { Dialog, Button, Icon, Header, Modal } from '@indshine/ui-kit';

import useApi from '../../../hooks/useApi';

const DeleteProfilePictureModal = ({
  apiEndpoint,
  trigger,
  onDelete,
  modalContent,
}) => {
  const [deleting, setDeleting] = useState(false);
  const api = useApi();

  const deletePicture = async () => {
    setDeleting(true);

    try {
      const { data: userInfo } = await api.get(apiEndpoint);
      const data = {
        ...userInfo.picture,
        default: null,
      };

      await api.put(apiEndpoint, {
        picture: data,
      });

      toast.success('Successfully Removed Profile Picture');
      setDeleting(false);
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
          <Header icon="trash" content="Delete" />
          <Modal.Content>
            <p>{modalContent}</p>
          </Modal.Content>
          <Modal.Actions>
            <Button basic color="grey" inverted onClick={closeModal}>
              <Icon name="remove" /> No
            </Button>
            <Button
              color="red"
              inverted
              onClick={async () => {
                await deletePicture();
                closeModal();
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

DeleteProfilePictureModal.propTypes = {
  apiEndpoint: PropTypes.string,

  trigger: PropTypes.node.isRequired,
  onDelete: PropTypes.func.isRequired,
  modalContent: PropTypes.string,
};

DeleteProfilePictureModal.defaultProps = {
  apiEndpoint: '',

  modalContent: 'Are you sure you want to remove your profile picture?',
};

export default DeleteProfilePictureModal;
