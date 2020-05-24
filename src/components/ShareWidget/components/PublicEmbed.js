import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  Modal,
  Button,
  Icon,
  Header,
  Segment,
  Loader,
  Message,
  Dimmer,
} from '@indshine/ui-kit';
import { toast } from 'react-toastify';
import { get } from 'lodash-es';
import Clipboard from 'react-clipboard.js';

import useApi from '../../../hooks/useApi';

const PublicEmbed = ({ projectId, open, onClose }) => {
  const api = useApi();

  const [loading, setLoading] = useState(true);
  const [embedId, setEmbedId] = useState(null);

  const fetchEmbed = useCallback(async () => {
    try {
      const {
        data: {
          embed: { _id },
        },
      } = await api.post(`/embeds`, {
        projectId,
      });
      setEmbedId(_id);
    } catch (error) {
      const errorMessage = get(
        error,
        'message',
        'Something went wrong. Please try again',
      );
      toast.error(errorMessage);
      setEmbedId(null);
    } finally {
      setLoading(false);
    }
  }, [projectId, api]);

  useEffect(() => {
    if (open) {
      fetchEmbed();
    }
  }, [fetchEmbed, open]);

  const embedText = `<iframe style="border: none;" width="800" height="450" src="shell.indshine.com/${embedId}" allowfullscreen></iframe>`;

  return (
    <Modal size="mini" open={open} onClose={onClose}>
      <Modal.Header as={Header} size="small" color="grey">
        Copy public embed code
      </Modal.Header>
      <Modal.Content>
        {(() => {
          if (loading) {
            return (
              <Segment basic>
                <Dimmer active inverted>
                  <Loader active color="grey" size="mini" />
                </Dimmer>
              </Segment>
            );
          }

          if (!embedId) {
            return (
              <Message
                icon="warning circle"
                header="Something went wrong"
                content="Please try again"
                size="small"
                error
              />
            );
          }

          return (
            <Segment size="mini">
              <EmbedCode>{embedText}</EmbedCode>
            </Segment>
          );
        })()}
      </Modal.Content>
      <Modal.Actions>
        {embedId && (
          <Clipboard
            className="ui mini button primary"
            data-clipboard-text={embedText}
            onClick={() => {
              toast.success('Embed Code Copied');
            }}
          >
            <Icon name="chain" /> Copy Code
          </Clipboard>
        )}
        <Button primary basic onClick={onClose} size="mini">
          Cancel
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

PublicEmbed.propTypes = {
  projectId: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default PublicEmbed;

const EmbedCode = styled.code`
  word-break: break-word;
`;
