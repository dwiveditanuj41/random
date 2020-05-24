import React, { useRef, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from '@indshine/ui-kit';
import { toast } from 'react-toastify';
import { get } from 'lodash-es';

import AuthContext from '../../contexts/AuthContext';
import getFirstAndLastName from '../../utils/getName';
import Form from '../Form';
import useApi from '../../hooks/useApi';

const ChangeInfo = ({ isOpen, trigger, resetState }) => {
  const { updateUserInfo, userInfo } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const form = useRef();
  const api = useApi();

  const handleUpdateUserInfo = async () => {
    const data = form.current.getData();
    const { firstName, lastName } = getFirstAndLastName(data.name);
    if (data) {
      setLoading(true);
      try {
        const result = await api.put(`users/${userInfo.id}`, {
          firstName,
          lastName,
        });
        if (result.status === 200) {
          await updateUserInfo({
            firstName,
            lastName,
          });
          toast.success('Your username has been changed successfully');
        }
      } catch (error) {
        const errorMessage = get(
          error,
          'message',
          'Something went wrong. Please try again',
        );
        toast.error(errorMessage);
      } finally {
        setLoading(false);
        resetState();
      }
    }
  };

  return (
    <Modal
      open={isOpen}
      trigger={trigger}
      centered
      size="mini"
      onClose={() => {
        resetState();
      }}
      onOpen={() => {
        resetState();
      }}
    >
      <Modal.Header>Change User Information</Modal.Header>
      <Modal.Content>
        <Form
          ref={form}
          config={[
            {
              id: 'name',
              type: 'string',
              label: 'Enter your new name',
              required: true,
              initialValue: `${userInfo.firstName} ${userInfo.lastName}`,
            },
          ]}
        />
      </Modal.Content>
      <Modal.Actions>
        <Button
          primary
          size="mini"
          onClick={handleUpdateUserInfo}
          loading={loading}
        >
          Update
        </Button>
        <Button primary basic size="mini" onClick={resetState}>
          Cancel
        </Button>
      </Modal.Actions>
    </Modal>
  );
};
ChangeInfo.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  trigger: PropTypes.any.isRequired,
  resetState: PropTypes.func.isRequired,
};
export default ChangeInfo;
