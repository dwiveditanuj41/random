import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Segment, Grid, Button } from '@indshine/ui-kit';

import { Row } from '../styles';
import mediaQuerySize from '../../../utils/mediaQuerySize';

const Navbar = () => {
  const renderBrand = () => (
    <Brand>
      <Logo src={require('../../../images/logo.svg')} />
      <BrandName>Indshine</BrandName>
    </Brand>
  );

  const renderCTA = () => (
    <Button primary size="tiny" as={Link} to="/login">
      Get Started
    </Button>
  );

  const renderDesktop = () => (
    <Container raised>
      <Grid>
        <Grid.Row>
          <Grid.Column width="2" />
          <Grid.Column width="12">
            <Grid verticalAlign="middle">
              <Grid.Row>
                <Grid.Column width="3">{renderBrand()}</Grid.Column>
                <Grid.Column width="10">
                  <Grid>
                    <Grid.Column width="2" />
                    <Grid.Column width="12">
                      <Grid columns="4" centered>
                        <Grid.Column width="4" />
                        <Grid.Column width="3">
                          <StyledLink href="https://medium.com/indshine">
                            <NavigationLink>Blogs</NavigationLink>
                          </StyledLink>
                        </Grid.Column>
                        <Grid.Column width="3">
                          <StyledLink href="https://community.indshine.com/">
                            <NavigationLink>Forum</NavigationLink>
                          </StyledLink>
                        </Grid.Column>
                        <Grid.Column width="3" />
                      </Grid>
                    </Grid.Column>
                    <Grid.Column width="2" />
                  </Grid>
                </Grid.Column>
                <Grid.Column width="3">{renderCTA()}</Grid.Column>
              </Grid.Row>
            </Grid>
          </Grid.Column>
          <Grid.Column width="2" />
        </Grid.Row>
      </Grid>
    </Container>
  );

  const renderMobile = () => (
    <Container raised>
      <Row>
        {renderBrand()} {renderCTA()}
      </Row>
    </Container>
  );

  return (
    <React.Fragment>
      <MobileOnlyDisplay>{renderMobile()}</MobileOnlyDisplay>
      <DesktopOnlyDisplay>{renderDesktop()}</DesktopOnlyDisplay>
    </React.Fragment>
  );
};

const Container = styled(Segment)`
  position: fixed !important;
  top: 0 !important;
  left: 0;
  right: 0;
  margin: 0 !important;
  z-index: 9999 !important;
`;

export default Navbar;

const Brand = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled.img`
  height: 2.25em;
  margin-right: 1.5em;
`;

const BrandName = styled.h4`
  color: ${props => props.theme.light.blue};
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  font-weight: 500;
  font-size: 1em;
`;

const NavigationLink = styled(BrandName)`
  cursor: pointer;
  font-weight: 300;
`;

const StyledLink = styled.a`
  text-decoration: none;
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
