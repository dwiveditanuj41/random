import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Grid, Image, Button } from '@indshine/ui-kit';

import { PageHeader, Spacer, SubHeader } from '../styles';
import mediaQuerySize from '../../../utils/mediaQuerySize';

const Hero = () => {
  const renderCTA = () => (
    <Link to="/login">
      <CTAButton size="large">GET STARTED</CTAButton>
    </Link>
  );

  const renderDesktop = () => (
    <Container>
      <Grid centered>
        <Grid.Column width="2" />
        <Grid.Column width="12">
          <Content>
            <PageHeader bright>
              Visualize - Get Insights - Collaborate
            </PageHeader>
            <SubHeader bright>
              The ultimate application to get useful insights from your drone
              and satellite maps and work with your team and client - all
              directly from your browser
            </SubHeader>
            <Spacer vertical space="3" />
            {renderCTA()}
            <Spacer vertical space="4" />
            <Image fluid src={require('../../../images/heroImage.png')} />
          </Content>
        </Grid.Column>
        <Grid.Column width="2" />
      </Grid>
    </Container>
  );

  const renderMobile = () => (
    <MobileContainer>
      <PageHeader>Visualize - Get Insights - Collaborate</PageHeader>
      <SubHeader>
        The ultimate application to get useful insights from your drone and
        satellite maps and work with your team and client - all directly from
        your browser
      </SubHeader>
      <Spacer vertical space={3} />
      {renderCTA()}
      <Spacer vertical space="2" />
      <Image fluid src={require('../../../images/heroImage.png')} />
    </MobileContainer>
  );

  return (
    <React.Fragment>
      <MobileOnlyDisplay>{renderMobile()}</MobileOnlyDisplay>
      <DesktopOnlyDisplay>{renderDesktop()}</DesktopOnlyDisplay>
    </React.Fragment>
  );
};

export default Hero;

const Container = styled.div`
  position: relative;
  height: 105vh;
  margin-bottom: 40vh;
  background: url(${require('../../../images/heroBg.png')}) no-repeat;
  background-size: cover;
`;

const MobileContainer = styled.div`
  padding-top: 8em;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const Content = styled.div`
  padding-top: 12em;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: realtive;
`;

const CTAButton = styled(Button)`
  background-color: ${props => props.theme.light.background} !important;
  color: ${props => props.theme.light.blue} !important;
`;

const MobileOnlyDisplay = styled.div`
  display: none;

  @media ${mediaQuerySize.sm} {
    display: block;
  }
`;

const DesktopOnlyDisplay = styled.div`
  display: block;

  @media ${mediaQuerySize.sm} {
    display: none;
  }
`;
