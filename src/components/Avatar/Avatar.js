import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { get } from 'lodash-es';

const Avatar = ({ userInfo, circular, size, ...restProps }) => {
  const { picture } = userInfo;

  if (get(picture, 'default', picture)) {
    return (
      <Container circular={circular} size={size} {...restProps}>
        <Image src={get(picture, 'default', picture)} />
      </Container>
    );
  }

  return (
    <Container circular={circular} size={size} {...restProps}>
      {(userInfo.firstName || userInfo.email)[0].toUpperCase()}
    </Container>
  );
};

Avatar.propTypes = {
  userInfo: PropTypes.object.isRequired,
  circular: PropTypes.bool,
  size: PropTypes.oneOf(['mini', 'small', 'medium']),
};

Avatar.defaultProps = {
  circular: false,
  size: 'small',
};

export default Avatar;

const Container = styled.div`
  background-color: ${props => props.theme.light.blue};
  cursor:pointer;
  color: ${props => props.theme.light.background};
  ${props => {
    let avatarSize = 2.25;
    let fontSize = 1;
    if (props.size === 'mini') {
      avatarSize = 1.75;
      fontSize = 0.9;
    } else if (props.size === 'small') {
      avatarSize = 2.25;
      fontSize = 1;
    } else if (props.size === 'medium') {
      avatarSize = 4;
      fontSize = 2;
    }

    return css`
      width: ${avatarSize}rem;
      height: ${avatarSize}rem;
      min-width: ${avatarSize}rem;
      min-height: ${avatarSize}rem;
      font-size: ${fontSize}em;
    `;
  }}
  border-radius: ${props => (props.circular ? '50%' : '0.1em')};
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  overflow: hidden;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
