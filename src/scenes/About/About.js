import React from 'react';
import styled from 'styled-components';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductFeatures from './components/ProductFeatures';
import Pricing from './components/Pricing';
import Footer from './components/Footer';

const About = () => (
  <Container>
    <Navbar />
    <Hero />
    <ProductFeatures />
    <Pricing />
    <Footer />
  </Container>
);

export default About;

const Container = styled.div`
  overflow: hidden;
`;
