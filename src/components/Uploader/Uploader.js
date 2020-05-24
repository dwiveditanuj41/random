import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import { Dialog, Modal, Button } from '@indshine/ui-kit';
import { Dashboard } from '@uppy/react';
import Uppy from '@uppy/core';
import AwsS3 from '@uppy/aws-s3';
import GoogleDrive from '@uppy/google-drive';
import Dropbox from '@uppy/dropbox';
import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';
import { toast } from 'react-toastify';

import withApi from '../../utils/withApi';

class Uploader extends React.Component {
  static propTypes = {
    trigger: PropTypes.node.isRequired,
    projectId: PropTypes.string.isRequired,
    onUpload: PropTypes.func,
    api: PropTypes.func.isRequired,
  };

  static defaultProps = {
    onUpload: () => {},
  };

  uppy = Uppy({
    onBeforeUpload: files => {
      const updatedFiles = Object.assign({}, files);
      Object.keys(updatedFiles).forEach(fileId => {
        updatedFiles[fileId].meta.name = `${this.props.projectId}/${
          updatedFiles[fileId].name
        }`;
      });
      return updatedFiles;
    },
    restrictions: {
      allowedFileTypes: ['.tif', '.tiff', '.kml', '.kmz'],
    },
  })
    .use(AwsS3, {
      companionUrl: process.env.REACT_APP_COMPANION_URL,
    })
    .use(GoogleDrive, {
      companionUrl: process.env.REACT_APP_COMPANION_URL,
    })
    .use(Dropbox, {
      companionUrl: process.env.REACT_APP_COMPANION_URL,
    });

  componentWillUnmount() {
    this.uppy.off('file-added');
    this.uppy.off('upload-retry');
    this.uppy.off('file-removed');
    this.uppy.off('upload-error');
    this.uppy.off('upload-success');
    this.uppy.close();
  }

  componentWillMount() {
    this.uppy.on('file-added', async file => {
      const dataId = await this.createData(file);

      if (dataId) {
        this.uppy.setFileMeta(file.id, {
          dataId,
        });
      }
    });

    this.uppy.on('upload-retry', async fileID => {
      const files = Object.assign({}, this.uppy.getState().files);

      const file = Object.keys(files).forEach(key => {
        if (files[key] === fileID) {
          return files[key];
        }
        return null;
      });

      if (file) {
        await this.updateData('SENDING', file);
      }
    });

    this.uppy.on('file-removed', async file => {
      await this.updateData('DISABLED', file);
    });

    this.uppy.on('upload-error', async file => {
      await this.updateData('DISABLED', file);
    });

    this.uppy.on('upload-success', async (file, response) => {
      if (response.status === 201) {
        await this.updateData('QUEUED', file);
      } else {
        await this.updateData('DISABLED', file);
      }
    });
  }

  createData = async file => {
    const data = {
      file: {
        originalname: file.data.name,
        size: file.data.size,
        mimetype: file.data.type || file.data.mimeType,
      },
      projectId: this.props.projectId,
      rawSourceSize: file.data.size,
    };

    try {
      const { api } = this.props;
      const response = await api.post('/data', data);
      if (response.status === 201) {
        return response.data.id;
      }
    } catch (err) {
      toast.error(err.message);
      this.uppy.removeFile(file.id);
    }

    return null;
  };

  updateData = async (status, file) => {
    const { onUpload, api } = this.props;

    const data = {
      status,
    };

    if (status === 'QUEUED') {
      data.rawSourceSize = file.data.size;
    }

    if (file.meta.dataId) {
      try {
        await api.put(`/data/${file.meta.dataId}`, data);
        if (status === 'QUEUED') {
          onUpload();
        }
      } catch (err) {
        this.uppy.removeFile(file.id);
      }
    }
  };

  render() {
    const { trigger } = this.props;

    return (
      <Dialog trigger={trigger}>
        {({ closeModal }) => (
          <React.Fragment>
            <Modal.Header>Upload Files</Modal.Header>
            <Modal.Content>
              <DashboardContainer>
                <Dashboard
                  uppy={this.uppy}
                  plugins={['GoogleDrive', 'Dropbox']}
                />
              </DashboardContainer>
            </Modal.Content>
            <Modal.Actions>
              <Button basic primary onClick={closeModal} size="mini">
                Close
              </Button>
            </Modal.Actions>
          </React.Fragment>
        )}
      </Dialog>
    );
  }
}

export default withRouter(
  withApi(Uploader, process.env.REACT_APP_API_BASE_URL),
);

const DashboardContainer = styled.div`
  & .uppy-Root {
    font-family: 'IBM Plex Sans', sans-serif !important;
  }

  & .uppy-Dashboard-browse {
    color: ${props => props.theme.light.blue};
  }

  & .uppy-Dashboard-inner {
    width: 100% !important;
    border: none !important;
    background: transparent !important;
  }

  & .uppy-DashboardAddFiles {
    margin: 0 !important;
    border: none !important;
  }

  & .uppy-DashboardAddFiles-info {
    display: none !important;
  }
`;
