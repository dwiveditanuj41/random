import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, Header } from '@indshine/ui-kit';
import AvatarEditor from 'react-avatar-editor';
import styled, { css } from 'styled-components';
import color from 'color';
import { toast } from 'react-toastify';
import { get } from 'lodash-es';

import withContexts from '../../utils/withContexts';
import AuthContext from '../../contexts/AuthContext';
import withApi from '../../utils/withApi';

class ProfilePictureUploader extends React.Component {
  static propTypes = {
    trigger: PropTypes.node.isRequired,
    userInfo: PropTypes.object.isRequired,
    updateUserInfo: PropTypes.func.isRequired,
    api: PropTypes.func.isRequired,
  };

  state = {
    open: false,
    imageURL: null,
    scale: 1,
    uploading: false,
  };

  handleScale = e => {
    const scale = Number.parseFloat(e.target.value);
    this.setState({ scale });
  };

  uploadImage = () => {
    this.setState({ uploading: true });

    const { api } = this.props;

    const canvas = this.editor.getImageScaledToCanvas();

    canvas.toBlob(async blob => {
      const data = new FormData();
      data.append('file', blob, `profile-${new Date().getTime()}.jpg`);

      try {
        const { updateUserInfo, userInfo } = this.props;
        const { data: responseData } = await api.put(
          `/users/${userInfo.id}`,
          data,
          {
            headers: {
              'content-type': 'multipart/form-data',
            },
          },
        );

        updateUserInfo({
          picture: responseData.picture,
        });

        this.setState({ open: false });
      } catch (error) {
        const errorMessage = get(
          error,
          'response.data.message',
          'Something went wrong. Please try again',
        );
        toast.error(errorMessage);
      } finally {
        this.setState({ uploading: false, scale: 1 });
      }
    }, 'image/jpeg');
  };

  imageSelected = event => {
    const file = event.target.files[0];

    if (file) {
      const fileSize = file.size;

      if (fileSize > 10485760) {
        toast.error('Image size greater than 10 MB!');
      } else {
        this.setState({
          open: true,
          imageURL: URL.createObjectURL(file),
        });
      }
    }
  };

  setEditorRef = editor => {
    this.editor = editor;
  };

  render() {
    const { open, imageURL, scale, uploading } = this.state;
    const { trigger } = this.props;

    return (
      <React.Fragment>
        {React.cloneElement(trigger, {
          onMouseDown: () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image';
            input.multiple = false;
            input.onchange = this.imageSelected;
            input.click();
          },
        })}

        <ProfileUpload open={open}>
          <Modal.Header as={Header} color="blue" size="small">
            Upload Picture
          </Modal.Header>
          <Modal.Content>
            <ProfilePicture>
              <AvatarEditor
                ref={this.setEditorRef}
                image={imageURL}
                width={250}
                height={250}
                borderRadius={200}
                color={[255, 255, 255, 0.6]}
                scale={parseFloat(this.state.scale)}
              />
            </ProfilePicture>

            <Slider>
              <input
                type="range"
                className="slider"
                min={1}
                max={3}
                orientation="vertical"
                step={0.01}
                value={scale}
                onChange={this.handleScale}
              />
            </Slider>
          </Modal.Content>
          <Modal.Actions id="actions">
            <Button
              primary
              size="mini"
              onClick={() => {
                this.uploadImage();
              }}
              loading={uploading}
            >
              Submit
            </Button>
            <Button
              primary
              basic
              size="mini"
              onClick={() =>
                this.setState({
                  open: false,
                })
              }
            >
              Cancel
            </Button>
          </Modal.Actions>
        </ProfileUpload>
      </React.Fragment>
    );
  }
}

export default withContexts([AuthContext])(
  withApi(ProfilePictureUploader, process.env.REACT_APP_API_BASE_URL),
);

const ProfileUpload = styled(Modal)`
  height: 31em !important;
  width: 30em !important;
  border-radius: 2% !important;
`;

const ProfilePicture = styled.div`
  margin: 0 0 0.5em 3em;
`;

const sliderThumbStyles = props => css`
  width: 1em;
  height: 1em;
  border-radius: 100%;
  background: ${props.theme.light.blue};
  cursor: pointer;
  -webkit-transition: 0.2s;
  transition: opacity 0.2s;
`;

const Slider = styled.span`
  display: flex;
  flex-direction: row;
  justify-content: left;
  margin-left: 3em;
  color: ${props => props.theme.light.grey};
  .slider {
    -webkit-appearance: none;
    width: 20em;
    height: 0.5em;
    background: ${props =>
      color(props.theme.light.grey)
        .alpha(0.1)
        .rgb()
        .toString()} !important;
    outline: none;
    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      ${props => sliderThumbStyles(props)}
    }
    &::-moz-range-thumb {
      ${props => sliderThumbStyles(props)}
    }
  }
`;
