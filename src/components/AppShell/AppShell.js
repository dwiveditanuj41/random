import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Sidebar from '../SideBar';
import Navbar from '../Navbar';
import mediaQuerySize from '../../utils/mediaQuerySize';

const AppShell = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Container>
      <Navbar
        onMenuButtonClick={() => {
          setIsOpen(!isOpen);
        }}
      />
      <Sidebar isOpen={isOpen} />
      <ContentContainer>{children}</ContentContainer>
    </Container>
  );
};

AppShell.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppShell;

const Container = styled.div`
  height: 100vh;
  overflow: hidden;
`;

const ContentContainer = styled.div`
  position: relative;
  top: 4em;
  left: 20em;
  background-color: ${props => props.theme.light.surface};
  overflow: hidden;
  height: calc(100vh - 4em);
  width: calc(100vw - 20em);

  @media ${mediaQuerySize.md} {
    left: 0;
    width: 100%;
  }
  @media ${mediaQuerySize.sm} {
    left: 0;
    width: 100%;
  }
`;
