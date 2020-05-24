import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Image, Card, Grid } from '@indshine/ui-kit';

import { Spacer } from '../styles';
import mediaQuerySize from '../../../utils/mediaQuerySize';

const industries = [
  {
    image: require('../../../images/industry/agriculture.png'),
    title: 'Agriculture',
  },
  {
    image: require('../../../images/industry/roofing.png'),
    title: 'Roofing & Insuarance',
  },
  {
    image: require('../../../images/industry/mining.png'),
    title: 'Mining',
  },
  {
    image: require('../../../images/industry/solar.png'),
    title: 'Solar Energy',
  },
  {
    image: require('../../../images/industry/surveying.png'),
    title: 'Surveying',
  },
  {
    image: require('../../../images/industry/construction.png'),
    title: 'Construction',
  },
];

const Section = ({ title, content, image, reversed }) => {
  return (
    <SectionContainer>
      <Grid
        stackable
        verticalAlign="middle"
        reversed={reversed ? 'computer' : false}
      >
        <Grid.Row>
          <Grid.Column width="2" />
          <Grid.Column width="6" textAlign="left">
            <Title>{title}</Title>
            <Spacer vertical space={1} />
            {content.map(c => (
              <Content key={c}>{c}</Content>
            ))}
          </Grid.Column>
          <Grid.Column width="2" />
          <Grid.Column width="6">
            <ProductImage src={image} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </SectionContainer>
  );
};

Section.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
  reversed: PropTypes.bool,
  image: PropTypes.string.isRequired,
};

Section.defaultProps = {
  reversed: false,
};

const ProductFeatures = () => {
  return (
    <Container>
      <Grid centered>
        <Grid.Row centered>
          <Grid.Column textAlign="center" stretched width="12">
            <PageHeader size="huge" color="blue">
              Product Features
            </PageHeader>
          </Grid.Column>
        </Grid.Row>
        <Spacer vertical space={1} />
        <Grid.Row>
          <Section
            title="Access your data, from anywhere, anyplace"
            content={[
              'No need to worry. It doesn’t matter whether you are in office, on-site or in a meeting giving a presentation. Your gigabytes of data is completely secure and accessible from any device simply through your browser.',
              'No dependency on your system specifications. We handle it all with the power of cloud and ease of web application',
            ]}
            image={require('../../../images/productFeature1.png')}
          />
          <Section
            reversed
            title="Get insights at lightning fast speed"
            content={[
              'Use the whole kit of tools and get actionable insights from your maps. No need for frequent site visits and using bulky traditional land-based surveying equipment. ',
              'With the help of volume, profile, measure, and many more tools get the most out of your orthomosaics, elevation, thermal and NDVI maps.',
            ]}
            image={require('../../../images/productFeature2.png')}
          />
          <Section
            title="Work with your team more efficiently"
            content={[
              'Now you don’t need to maintain different versions and share your work in hard drives. Share your maps with colleagues and clients by using their email addresses. Use permission control to manage access of users on your data.',
            ]}
            image={require('../../../images/productFeature3.png')}
          />
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width="2" />
          <Grid.Column width="12" textAlign="center">
            <Grid stackable>
              <Grid.Row>
                <Grid.Column width="16" textAlign="center">
                  <Title>Compatible with all industry standard formats</Title>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width="16" textAlign="center">
                  <Content padded>
                    Your work done on Indshine is entirely compatible with all
                    existing applications such as products of Autodesk, ESRI and
                    Google Earth. With support for tiff, kml and shp files you
                    are always ready to work with other existing applications
                  </Content>
                </Grid.Column>
              </Grid.Row>
              <Spacer vertical space={2} />
              <Grid.Row columns="3">
                {industries.map(item => (
                  <Grid.Column
                    key={item.title}
                    style={{ marginBottom: '2.5em' }}
                  >
                    <Card raised fluid>
                      <Image src={item.image} wrapped ui={false} />
                      <Card.Content>
                        <Card.Header>
                          <Caption>{item.title}</Caption>
                        </Card.Header>
                      </Card.Content>
                    </Card>
                  </Grid.Column>
                ))}
              </Grid.Row>
            </Grid>
          </Grid.Column>
          <Grid.Column width="2" />
        </Grid.Row>
      </Grid>
    </Container>
  );
};

const SectionContainer = styled.div`
  padding: 3.5em 2em;
`;

const Container = styled.div`
  padding: 5em 0;
  width: 100%;
`;

const PageHeader = styled.h1`
  font-size: 3.5em;
  font-weight: 600;
  color: ${({ theme }) => theme.light.blue};
`;

const Title = styled.h3`
  font-size: 2em;
  font-weight: 500;
  color: ${({ theme }) => theme.light.blue};

  @media ${mediaQuerySize.sm} {
    text-align: center !important;
  }
`;

const Content = styled.p`
  font-size: 1.25em;
  color: ${({ theme }) => theme.light.grey};
  padding: ${props => props.padded && '0 4em'};

  @media ${mediaQuerySize.sm} {
    text-align: center !important;
    padding: ${props => props.padded && '0 1em'};
  }
`;

const Caption = styled(Content)`
  font-size: 1em;
`;

const ProductImage = styled(Image)`
  max-height: 45em;
`;

export default ProductFeatures;
