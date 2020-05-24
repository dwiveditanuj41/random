import React, { useRef, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Grid, Button, Header, Icon } from '@indshine/ui-kit';
import { Auth } from 'aws-amplify';
import { Redirect, Link } from 'react-router-dom';
import { get } from 'lodash-es';
import { toast } from 'react-toastify';

import AuthContext from '../../contexts/AuthContext';
import Form from '../../components/Form';

const PasswordReset = ({ history }) => {
  const { authToken } = useContext(AuthContext);

  const form = useRef();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(null);
  const [view, setView] = useState('EMAIL');

  const handleEmailSubmit = async () => {
    const data = form.current.getData();
    if (data) {
      setLoading(true);
      try {
        await Auth.forgotPassword(data.email);
        setEmail(data.email);
        setView('VERIFY');
      } catch (error) {
        const errorMessage = get(
          error,
          'message',
          'Something went wrong. Please try again',
        );
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePasswordChangeForm = async () => {
    const data = form.current.getData();
    if (data) {
      setLoading(true);
      const { verificationCode, password } = data;
      try {
        await Auth.forgotPasswordSubmit(email, verificationCode, password);
        toast.success(
          'Password updated successfully. Enter your new password to access your dashboard',
        );
        history.push('/login');
      } catch (error) {
        const errorMessage = get(
          error,
          'message',
          'Something went wrong. Please try again',
        );
        toast.error(errorMessage);
        setLoading(false);
      }
    }
  };

  if (authToken) {
    return (
      <Redirect
        to={{
          pathname: '/projects',
        }}
      />
    );
  }

  return (
    <Container verticalAlign="middle">
      <ContentContainer centered verticalAlign="middle">
        <Grid.Column only="computer" width={9}>
          <CoverImage src={require('../../images/login.png')} />
        </Grid.Column>

        <Grid.Column tablet={8} computer={7} mobile={12}>
          {(() => {
            if (view === 'EMAIL') {
              return (
                <Grid columns={2} doubling textAlign="center">
                  <Grid.Row>
                    <Grid.Column columns={2} doubling textAlign="center">
                      <Title size="huge">Welcome to Indshine</Title>
                      <Subtitle size="small" color="grey">
                        Login to access your account
                      </Subtitle>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column>
                      <Form
                        ref={form}
                        config={[
                          {
                            id: 'email',
                            type: 'email',
                            label: 'Email',
                            required: true,
                          },
                        ]}
                        onSubmit={handleEmailSubmit}
                      />
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row verticalAlign="middle" columns={1}>
                    <Grid.Column computer={8}>
                      <Button
                        icon
                        primary
                        labelPosition="right"
                        loading={loading}
                        onClick={handleEmailSubmit}
                        fluid
                      >
                        <Icon name="arrow right" />
                        Send Code
                      </Button>
                    </Grid.Column>
                    <Grid.Column>
                      <Link to="/login">Back to Login</Link>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              );
            }

            if (view === 'VERIFY') {
              return (
                <Grid columns={2} doubling textAlign="center">
                  <Grid.Row>
                    <Grid.Column width={8}>
                      <Form
                        ref={form}
                        config={[
                          {
                            id: 'verificationCode',
                            type: 'string',
                            label: 'Verification Code',
                            required: true,
                          },
                          {
                            id: 'password',
                            type: 'password',
                            label: 'New Password',
                            required: true,
                          },
                        ]}
                        onSubmit={handlePasswordChangeForm}
                      />
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column computer={8}>
                      <Button
                        icon
                        primary
                        labelPosition="right"
                        onClick={handlePasswordChangeForm}
                        fluid
                      >
                        <Icon name="arrow right" />
                        Verify Code
                      </Button>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              );
            }

            return null;
          })()}
        </Grid.Column>
      </ContentContainer>
    </Container>
  );
};

PasswordReset.propTypes = {
  history: PropTypes.object.isRequired,
};

export default PasswordReset;

const Container = styled(Grid)`
  margin-top: 0 !important;
  margin-bottom: 0 !important;
`;

const ContentContainer = styled(Grid.Row)`
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  height: 100vh !important;
`;

const CoverImage = styled.img`
  height: 100vh;
  width: 100%;
  object-fit: cover;
  display: block;
`;

const Title = styled(Header)`
  margin-bottom: 0.25em !important;
`;

const Subtitle = styled(Header)`
  margin-bottom: 0 !important;
  margin-top: 0 !important;
`;
