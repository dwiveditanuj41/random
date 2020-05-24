import React from 'react';
import { Button, Icon } from '@indshine/ui-kit';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

import { get } from 'lodash-es';
import { withRouter } from 'react-router-dom';
import mediaQuerySize from '../../utils/mediaQuerySize';
import withApi from '../../utils/withApi';

class NewProject extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    api: PropTypes.func.isRequired,
  };

  state = {
    loading: false,
  };

  createNewProject = async () => {
    this.setState({ loading: true });
    try {
      const { api } = this.props;
      const { data } = await api.post('/projects', {
        name: 'Untitled Project',
      });
      const { id } = data;
      const { history } = this.props;
      history.push(`/projects/${id}`);
    } catch (error) {
      const errorMessage = get(
        error,
        'response.data',
        'Something went wrong. Please try again',
      );
      toast.error(errorMessage);
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const { loading } = this.state;

    return (
      <ButtonContainer>
        <Button
          loading={loading}
          primary
          size="mini"
          icon
          labelPosition="left"
          onClick={() => {
            this.createNewProject();
          }}
        >
          <Icon name="add" />
          New Project
        </Button>
      </ButtonContainer>
    );
  }
}

export default withRouter(
  withApi(NewProject, process.env.REACT_APP_API_BASE_URL),
);

const ButtonContainer = styled.div`
  display: block;

  @media ${mediaQuerySize.sm} {
    display: none;
  }
`;
