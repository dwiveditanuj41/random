import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Table, Button } from '@indshine/ui-kit';
import { get } from 'lodash-es';
import { toast } from 'react-toastify';

import useApi from '../../../hooks/useApi';

const DeletedFileRow = ({ file, onRestore }) => {
  const [restoring, setRestoring] = useState();

  const api = useApi();

  const restoreFile = useCallback(async () => {
    setRestoring(true);
    try {
      await api.put(`/data/${file.id}`, {
        status: 'ENABLED',
      });
      toast.success('Layer restored successfully');
      onRestore(file);
    } catch (error) {
      const errorMessage = get(
        error,
        'response.data.message',
        'Something went wrong. Please try again',
      );
      toast.error(errorMessage);
      setRestoring(false);
    }
  }, [api, file, onRestore]);

  return (
    <Table.Row>
      <Table.Cell>{file.name}</Table.Cell>
      <Table.Cell>{file.project.name}</Table.Cell>
      <Table.Cell>
        {`${Math.round((file.rawSourceSize / (1024 * 1024)) * 100) / 100} mb`}
      </Table.Cell>
      <Table.Cell>
        <Button
          primary
          basic
          size="mini"
          loading={restoring}
          onClick={restoreFile}
        >
          Restore
        </Button>
        <Button color="red" basic size="mini">
          Delete
        </Button>
      </Table.Cell>
    </Table.Row>
  );
};

DeletedFileRow.propTypes = {
  file: PropTypes.object.isRequired,
  onRestore: PropTypes.func.isRequired,
};

export default DeletedFileRow;
