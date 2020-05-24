import React from 'react';
import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import { Grid, Button, Header, Image, Icon } from '@indshine/ui-kit';
import { Spacer, PageHeader, StyledLink } from '../styles';

import mediaQuerySize from '../../../utils/mediaQuerySize';

const Footer = () => {
  return (
    <Container>
      <Grid stackable centered>
        <Grid.Column width="2" />
        <Grid.Column width="12">
          <ContentContainer>
            <Content>
              <PageHeader bright>
                Try Indshine with your team for free
              </PageHeader>
              <Spacer vertical space="2.5" />
              <Link to="/login">
                <Button size="medium">
                  <Header size="tiny" color="blue">
                    GET STARTED
                  </Header>
                </Button>
              </Link>
            </Content>
            <Spacer vertical space={6} />
            <Grid stackable>
              <Grid.Row>
                <Grid.Column>
                  <Logo src={require('../../../images/logoAlt.png')} />
                  <SubHeader compact inline>
                    Indshine
                  </SubHeader>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width="6">
                  <SubHeader nomargin>
                    Indshine is a technology company that provides enterprise
                    drone software and solutions for infrastructure, mining,
                    forestry and other industries.
                  </SubHeader>
                  <Spacer vertical space={1.5} />
                  <Grid.Row>
                    <StyledLink href="https://www.linkedin.com/company/indshine">
                      <Icon name="linkedin" inverted size="big" />
                    </StyledLink>
                    <StyledLink href="https://www.facebook.com/indshinegeoinformatics/">
                      <Icon name="facebook" inverted size="big" />
                    </StyledLink>
                    <StyledLink href="https://www.youtube.com/channel/UCbaqB_HJ6rtgTQi4ZLH6DAw">
                      <Icon name="youtube" inverted size="big" />
                    </StyledLink>
                  </Grid.Row>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </ContentContainer>
        </Grid.Column>
        <Grid.Column width="2" />
      </Grid>
    </Container>
  );
};

export default Footer;

const Container = styled.div`
  background: linear-gradient(to right, #1452cc, rgba(148, 17, 179, 0.81));

  @media ${mediaQuerySize.sm} {
    padding: 0 2em;
  }
`;

const ContentContainer = styled.div`
  padding-top: 4rem;
  padding-bottom: 2rem;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: realtive;
`;

const Logo = styled(Image)`
  display: inline !important;
`;

const SubHeader = styled.h4`
  margin: 0;
  line-height: 150%;
  font-size: 0.9em;
  font-weight: 300;
  color: white;
  padding: ${({ compact, nomargin }) =>
    nomargin ? '0' : compact ? '0 0.5em' : '0 8em'};
  display: ${props => (props.inline ? 'inline' : 'block')};

  ${props =>
    props.mobileOnly &&
    css`
      display: none;

      @media ${mediaQuerySize.sm} {
        display: ${props.inline ? 'inline' : 'block'};
      }
    `}
`;
