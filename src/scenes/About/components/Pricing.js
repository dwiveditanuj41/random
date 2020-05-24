import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import {
  Segment,
  Grid,
  Header,
  Label as ILabel,
  Icon,
  Button,
} from '@indshine/ui-kit';
import mediaQuerySize from '../../../utils/mediaQuerySize';

const PriceBox = ({ heading, price, features, selected }) => {
  return (
    <Box raised selected={selected}>
      {selected ? (
        <ILabel color="yellow">{heading}</ILabel>
      ) : (
        <Header size="tiny">{heading}</Header>
      )}
      <Row>
        <Header size="tiny">$</Header>
        <Header size="huge">{price}</Header>
        <Header size="tiny">/mo</Header>
      </Row>
      <Column>
        {features.map(feature => (
          <Row padded key={feature}>
            <Icon name="check circle outline" color="green" />
            <Label>{feature}</Label>
          </Row>
        ))}
      </Column>
      <Link to="/login">
        <Button fluid basic={!selected} color={selected ? 'blue' : 'grey'}>
          SIGN UP
        </Button>
      </Link>
    </Box>
  );
};

PriceBox.propTypes = {
  heading: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  features: PropTypes.array.isRequired,
  selected: PropTypes.bool,
};

PriceBox.defaultProps = {
  selected: false,
};

const Pricing = () => {
  return (
    <Container>
      <Grid centered>
        <Grid.Row centered>
          <Grid.Column textAlign="center" stretched width="12">
            <Centered>
              <PageHeader size="huge" color="blue">
                Pricing
              </PageHeader>
              <Content>
                Sign up in less than 30 seconds. Try out our free trial to get
                complete hands on experience of Indshine. You can upgrade and
                cancel your subscription at anytime, no questions, no hassle.
              </Content>
              <Row margin>
                <PriceBox
                  heading="Free"
                  price="0"
                  features={[
                    '4 Projects',
                    '5 Collaboraters per project',
                    '10 GB Storage',
                    'Analytical Tools',
                  ]}
                />
                <PriceBox
                  selected
                  heading="Recommended"
                  price="89"
                  features={[
                    'Unlimited Projects',
                    'Unlimited Collaboraters per project',
                    '150 GB Storage',
                    'Analytical Tools',
                  ]}
                />
              </Row>
            </Centered>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
};

const Container = styled.div`
  padding-top: 0;

  @media ${mediaQuerySize.sm} {
    padding-top: 4em;
  }
`;

const PageHeader = styled.h1`
  font-size: 3.5em;
  font-weight: 600;
  color: ${({ theme }) => theme.light.blue};
`;

const Centered = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Content = styled.p`
  font-size: 1.45em;
  color: ${({ theme }) => theme.light.grey};
  max-width: 30em;
`;

const Label = styled.span`
  font-size: 1em;
  color: ${({ theme }) => theme.light.grey};
  text-align: left;
`;

const Box = styled(Segment)`
  padding: 3.75em 3.5em !important;
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: ${({ selected }) => selected && 'scaleY(1.075)'};
  border: ${({ selected, theme }) =>
    selected && `1px solid ${theme.light.blue}`} !important;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  padding: ${({ padded }) => padded && '0.5em 0'};
  margin: ${({ margin }) => margin && '5em 0'};

  @media ${mediaQuerySize.sm} {
    flex-direction: column;
    align-items: center;
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 3em;
`;

export default Pricing;
