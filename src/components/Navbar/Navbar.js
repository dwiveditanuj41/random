import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Dropdown } from '@indshine/ui-kit';
import { MdMenu } from 'react-icons/md';

import SearchBar from '../SearchBar';
import NewProject from '../NewProject';

import AuthContext from '../../contexts/AuthContext';
import UserAvatar from '../UserAvatar';
import mediaQuerySize from '../../utils/mediaQuerySize';

const Navbar = ({ onMenuButtonClick }) => {
  const { signOut } = useContext(AuthContext);

  return (
    <Container>
      <MenuIcon onClick={onMenuButtonClick}>
        <MdMenu size={24} />
      </MenuIcon>

      <Logo src={require('../../images/logo.svg')} />

      <BrandName>Indshine</BrandName>

      <Spacer />
      <SearchBar />
      <Spacer />

      <NewProject />

      <StyledDropdown trigger={<UserAvatar circular />} pointing="top right">
        <Dropdown.Menu>
          <Dropdown.Item
            text="Sign Out"
            onClick={() => {
              signOut();
            }}
          />
        </Dropdown.Menu>
      </StyledDropdown>
    </Container>
  );
};

Navbar.propTypes = {
  onMenuButtonClick: PropTypes.func.isRequired,
};

export default Navbar;

const Container = styled.div`
  height: 4em;
  padding: 0 1em;
  background-color: ${props => props.theme.light.background};
  color: ${props => props.theme.light.grey};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  box-shadow: 0 5px 5px rgba(0, 0, 0, 0.05);

  & > * + * {
    margin-left: 0.5em !important;
  }
`;

const Logo = styled.img`
  height: 2.5em;

  @media ${mediaQuerySize.sm} {
    display: none;
  }
`;

const BrandName = styled.h4`
  color: ${props => props.theme.light.blue};
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  font-weight: 500;
  font-size: 1.25em;

  @media ${mediaQuerySize.md} {
    display: none;
  }
`;

const Spacer = styled.div`
  flex-grow: 1;
`;

const StyledDropdown = styled(Dropdown)`
  & > .dropdown.icon {
    display: none !important;
  }
`;

const MenuIcon = styled.div`
  width: 30px;
  cursor: pointer;
  display: none;

  @media ${mediaQuerySize.md} {
    display: block;
  }
`;
