import React, { useContext, useRef, useState } from 'react';
import styled from 'styled-components';
import { Redirect, Link } from 'react-router-dom';
import { Grid, Button, Header, Divider, Icon } from '@indshine/ui-kit';
import { get } from 'lodash-es';
import { toast } from 'react-toastify';

import AuthContext from '../../contexts/AuthContext';
import Form from '../../components/Form';
import mediaQuerySize from '../../utils/mediaQuerySize';

const Login = () => {
  const {
    authToken,
    isUserRegistered,
    signInWithEmailPassword,
    signInWithGoogle,
    signInWithFacebook,
    resendVerificationCode,
    confirmSignUp,
    signUp,
  } = useContext(AuthContext);
  const form = useRef();

  const [loading, setLoading] = useState(null);
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);

  const handleSubmitEmail = async () => {
    const data = form.current.getData();
    if (data) {
      setLoading('USER_REGISTERED');
      const { email: emailData } = data;

      const registeredUser = await isUserRegistered(emailData.toLowerCase());
      if (registeredUser) {
        setUser(registeredUser);
        setEmail(emailData.toLowerCase());
      }
      setLoading(null);
    }
  };

  const handleSubmitPassword = async () => {
    const data = form.current.getData();
    if (data) {
      setLoading('LOGIN_WITH_PASSWORD');
      const { password } = data;
      const signInSuccessful = await signInWithEmailPassword(email, password);
      if (!signInSuccessful) {
        setLoading(null);
      }
    }
  };

  const handleSubmitVerificationCode = async () => {
    const data = form.current.getData();
    if (data) {
      setLoading('VERIFY_EMAIL');
      const { verificationCode } = data;
      const success = await confirmSignUp(email, verificationCode);
      if (success) {
        setEmail(null);
        setUser(null);
      }
      setLoading(false);
    }
  };

  const handleSubmitSignUpForm = async () => {
    const data = form.current.getData();
    if (data) {
      const { name, password } = data;
      setLoading('SIGN_UP');
      const newUser = await signUp(name, email, password);
      if (newUser) {
        toast.success('Please check your email for new verification code.');
        setUser({
          count: 1,
          items: [
            {
              email,
              emailVerified: false,
            },
          ],
        });
      } else {
        setUser(null);
      }
      setLoading(null);
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
    <Container>
      <ContentContainer centered verticalAlign="middle">
        <Grid.Column only="computer" width={9}>
          <CoverImage src={require('../../images/login.png')} />
        </Grid.Column>
        <Grid.Column tablet={8} computer={7} mobile={12}>
          {(() => {
            if (!user) {
              return (
                <Grid columns={2} doubling textAlign="center">
                  <Grid.Row>
                    <Grid.Column columns={2} doubling textAlign="center">
                      <Title size="huge">Welcome to Indshine</Title>
                      <Subtitle size="small" color="grey">
                        Enter your email to get started
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
                        onSubmit={handleSubmitEmail}
                      />
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row verticalAlign="middle">
                    <Grid.Column>
                      <Button
                        icon
                        primary
                        loading={loading === 'USER_REGISTERED'}
                        labelPosition="right"
                        onClick={handleSubmitEmail}
                        fluid
                      >
                        <Icon name="arrow right" />
                        Continue
                      </Button>
                    </Grid.Column>
                  </Grid.Row>

                  <Grid.Row>
                    <Grid.Column>
                      <StyledDivider horizontal>OR</StyledDivider>
                    </Grid.Column>
                  </Grid.Row>

                  <Grid.Row>
                    <Grid.Column>
                      <Button
                        color="facebook"
                        icon
                        onClick={() => {
                          signInWithFacebook();
                        }}
                        fluid
                        labelPosition="left"
                      >
                        <Icon name="facebook f" />
                        Login with Facebook
                      </Button>
                    </Grid.Column>
                  </Grid.Row>

                  <Grid.Row>
                    <Grid.Column>
                      <Button
                        color="google plus"
                        icon
                        onClick={() => {
                          signInWithGoogle();
                        }}
                        fluid
                        labelPosition="left"
                      >
                        <Icon name="google" />
                        Login with Google
                      </Button>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              );
            }

            const userCount = get(user, 'count');
            const userEmailVerified = get(user, 'items[0].emailVerified');
            const userStatus = get(user, 'items[0].status');
            const userIdentities = get(user, 'items[0].identities', []);

            if (userCount > 0) {
              if (userStatus !== 'EXTERNAL_PROVIDER') {
                if (userEmailVerified) {
                  return (
                    <Grid columns={2} doubling textAlign="center">
                      <Grid.Row>
                        <Grid.Column columns={2} doubling textAlign="center">
                          <Title size="huge">Welcome Back to Indshine</Title>
                          <Subtitle size="small" color="grey">
                            Enter your password to get started
                          </Subtitle>
                        </Grid.Column>
                      </Grid.Row>
                      <Grid.Row>
                        <Grid.Column>
                          <Form
                            config={[
                              {
                                id: 'password',
                                label: 'Password',
                                type: 'password',
                                required: true,
                              },
                            ]}
                            columns={2}
                            doubling
                            textAlign="center"
                            ref={form}
                            onSubmit={handleSubmitPassword}
                          />
                        </Grid.Column>
                      </Grid.Row>
                      <Grid.Row columns={1} verticalAlign="middle">
                        <Grid.Column computer={8} verticalAlign="middle">
                          <Button
                            primary
                            fluid
                            icon
                            labelPosition="right"
                            loading={loading === 'LOGIN_WITH_PASSWORD'}
                            onClick={handleSubmitPassword}
                          >
                            <Icon name="arrow right" />
                            Login
                          </Button>
                        </Grid.Column>
                      </Grid.Row>
                      {(() => {
                        if (userIdentities.length !== 0) {
                          const { providerName } = userIdentities[0];

                          return (
                            <React.Fragment>
                              <Grid.Row>
                                <Grid.Column>
                                  <StyledDivider horizontal>OR</StyledDivider>
                                </Grid.Column>
                              </Grid.Row>

                              <Grid.Row>
                                <Grid.Column>
                                  {providerName === 'Google' ? (
                                    <Button
                                      color="google plus"
                                      icon
                                      onClick={() => {
                                        signInWithGoogle();
                                      }}
                                      fluid
                                      labelPosition="left"
                                    >
                                      <Icon name="google" />
                                      Login with Google
                                    </Button>
                                  ) : providerName === 'Facebook' ? (
                                    <Button
                                      color="facebook"
                                      icon
                                      onClick={() => {
                                        signInWithFacebook();
                                      }}
                                      fluid
                                      labelPosition="left"
                                    >
                                      <Icon name="facebook f" />
                                      Login with Facebook
                                    </Button>
                                  ) : null}
                                </Grid.Column>
                              </Grid.Row>
                            </React.Fragment>
                          );
                        }
                        return null;
                      })()}
                      <Grid.Row>
                        <Grid.Column computer={8}>
                          <Link to="reset-password">Forgot Password?</Link>
                        </Grid.Column>
                      </Grid.Row>
                      <Grid.Row>
                        <Grid.Column>
                          <InternalLink
                            onMouseDown={() => {
                              setEmail(null);
                              setUser(null);
                            }}
                          >
                            Change Email
                          </InternalLink>
                        </Grid.Column>
                      </Grid.Row>
                    </Grid>
                  );
                }

                return (
                  <Grid columns={2} doubling textAlign="center">
                    <Grid.Row>
                      <Grid.Column columns={2} doubling textAlign="center">
                        <Title size="huge">Verify your Email to Continue</Title>
                        <Subtitle size="small" color="grey">
                          Please check your email for verification code
                        </Subtitle>
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                      <Grid.Column>
                        <Form
                          config={[
                            {
                              id: 'verificationCode',
                              label: 'Verification Code',
                              type: 'string',
                              required: true,
                            },
                          ]}
                          ref={form}
                          onSubmit={handleSubmitVerificationCode}
                        />
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                      <Grid.Column>
                        <Button
                          primary
                          icon
                          fluid
                          loading={loading === 'VERIFY_EMAIL'}
                          labelPosition="right"
                          onClick={handleSubmitVerificationCode}
                        >
                          Verify Email
                          <Icon name="arrow right" />
                        </Button>
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row verticalAlign="middle">
                      <Grid.Column computer={8}>
                        <Button
                          primary
                          basic
                          loading={loading === 'RESEND_VERIFICATION_CODE'}
                          fluid
                          onClick={async () => {
                            setLoading('RESEND_VERIFICATION_CODE');
                            const success = await resendVerificationCode(email);
                            if (success) {
                              toast.success(
                                'Please check your email for new verification code.',
                              );
                            }
                            setLoading(null);
                          }}
                        >
                          Resend Code
                        </Button>
                      </Grid.Column>
                      <Grid.Column computer={16}>
                        <InternalLink
                          onMouseDown={() => {
                            setEmail(null);
                            setUser(null);
                          }}
                        >
                          Change Email
                        </InternalLink>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                );
              }
              const { providerName } = userIdentities[0];

              return (
                <Grid columns={2} doubling textAlign="center">
                  <Grid.Row>
                    <Grid.Column columns={2} doubling textAlign="center">
                      <Title size="huge">Welcome Back to Indshine</Title>
                      <Subtitle size="small" color="grey">
                        Login with {providerName} to get started
                      </Subtitle>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column>
                      {providerName === 'Google' ? (
                        <Button
                          color="google plus"
                          icon
                          onClick={() => {
                            signInWithGoogle();
                          }}
                          fluid
                          labelPosition="left"
                        >
                          <Icon name="google" />
                          Login with Google
                        </Button>
                      ) : providerName === 'Facebook' ? (
                        <Button
                          color="facebook"
                          icon
                          onClick={() => {
                            signInWithFacebook();
                          }}
                          fluid
                          labelPosition="left"
                        >
                          <Icon name="facebook f" />
                          Login with Facebook
                        </Button>
                      ) : null}
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column>
                      <InternalLink
                        onMouseDown={() => {
                          setEmail(null);
                          setUser(null);
                        }}
                      >
                        Change Email
                      </InternalLink>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              );
            }

            return (
              <Grid columns={2} doubling textAlign="center">
                <Grid.Row>
                  <Grid.Column columns={2} doubling textAlign="center">
                    <Title size="huge">Welcome to Indshine</Title>
                    <Subtitle size="small" color="grey">
                      Signup to get started
                    </Subtitle>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column>
                    <Form
                      ref={form}
                      config={[
                        {
                          id: 'name',
                          type: 'string',
                          label: 'Name',
                          required: true,
                        },
                        {
                          id: 'password',
                          type: 'password',
                          label: 'Password',
                          required: true,
                        },
                      ]}
                      onSubmit={handleSubmitSignUpForm}
                    />
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row verticalAlign="middle">
                  <Grid.Column computer={8}>
                    <Button
                      icon
                      primary
                      loading={loading === 'SIGN_UP'}
                      labelPosition="right"
                      onClick={handleSubmitSignUpForm}
                      fluid
                    >
                      <Icon name="arrow right" />
                      SignUp
                    </Button>
                  </Grid.Column>
                  <Grid.Column computer={16}>
                    <InternalLink
                      onMouseDown={() => {
                        setEmail(null);
                        setUser(null);
                      }}
                    >
                      Change Email
                    </InternalLink>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            );
          })()}
        </Grid.Column>
      </ContentContainer>
    </Container>
  );
};

export default Login;

const Container = styled(Grid)`
  margin-top: 0 !important;
  margin-bottom: 0 !important;
`;

const ContentContainer = styled(Grid.Row)`
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  height: 100vh !important;

  @media ${mediaQuerySize.md} {
    justify-content: center !important;
  }
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

const StyledDivider = styled(Divider)`
  margin: 0 !important;
`;

const InternalLink = styled.span`
  color: ${props => props.theme.light.blue};
  cursor: pointer;
`;
