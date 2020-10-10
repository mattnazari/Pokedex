import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const Img = styled.img`
  width: 6em;
  height: 6em;
  display: none;
`;

export const Cards = styled.div`
  box-shadow: 0 1px 7px 0 rgba(0, 0, 0, 0.15);
  transition: ease-in-out 0.2s;
  &:hover {
    box-shadow: 0 1px 15px 0 rgba(0, 0, 0, 0.4);
    cursor: pointer;
  }
  --moz-user-select: none;
  --website-user-select: none;
`;

export const StyledLink = styled(Link)`
  text-decoration: none;
  color: black;
  &:focus,
  &:hover,
  &:link,
  &:visited,
  &:active {
    text-decoration: none;
    color: black;
  }
`;
