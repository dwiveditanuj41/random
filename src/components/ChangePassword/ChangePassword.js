import React, { useState, useContext, useRef } from 'react';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { Button, Modal } from '@indshine/ui-kit';

import Form from '../Form';
import AuthContext from '../../contexts/AuthContext';

const ChangePassword = ({ trigger, resetState, isOpen }) => {
  const { changePassword, user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const form = useRef();

  const updatePassword = async () => {
    const data = form.current.getData();

    if (data) {
      setLoading(true);
      const { oldPassword, newPassword } = data;

      try {
        const response = await changePassword(user, oldPassword, newPassword);

        if (response === 'SUCCESS') {
          toast.success('Your Password has been changed successfully');
          resetState();
        }
      } catch (e) {
        toast.error('Something went wrong. Try again!');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Modal
      trigger={trigger}
      onClose={resetState}
      centered
      size="mini"
      open={isOpen}
    >
      <Modal.Header>Change Password</Modal.Header>
      <Modal.Content>
        <Form
          ref={form}
          config={[
            {
              id: 'oldPassword',
              type: 'password',
              label: 'Enter your old password',
              required: true,
            },
            {
              id: 'newPassword',
              type: 'password',
              label: 'Enter your new password',
              required: true,
            },
          ]}
        />
      </Modal.Content>
      <Modal.Actions>
        <Button primary loading={loading} onClick={updatePassword} size="mini">
          Update
        </Button>
        <Button onClick={resetState} size="mini" primary basic>
          Cancel
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

ChangePassword.propTypes = {
  trigger: PropTypes.any.isRequired,
  resetState: PropTypes.func,
  isOpen: PropTypes.bool.isRequired,
};

ChangePassword.defaultProps = {
  resetState: () => {},
};

export default ChangePassword;
