import styled from 'styled-components';
import mediaQuerySize from '../../utils/mediaQuerySize';

export const Row = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const PageHeader = styled.h1`
  font-size: 2.5em;
  font-weight: 500;
  color: ${props =>
    props.bright ? props.theme.light.background : props.theme.light.blue};

  @media ${mediaQuerySize.sm} {
    font-size: 1.5em;
    color: ${props =>
      props.bright ? props.theme.light.background : props.theme.light.blue};
  }
`;

export const SubHeader = styled.h4`
  margin: 0;
  line-height: 150%;
  font-size: 1.5em;
  font-weight: 400;
  color: ${props =>
    props.bright ? props.theme.light.background : props.theme.background};

  @media ${mediaQuerySize.sm} {
    font-size: 1.5em;
    color: ${props => props.theme.light.blue};
  }
`;

export const Spacer = styled.div`
  padding-top: ${({ vertical, space }) => vertical && `${space}em`};
  padding-left: ${({ horizontal, space }) => horizontal && `${space}em`};
`;

export const StyledLink = styled.a`
  text-decoration: none;
  cursor: pointer;
`;
