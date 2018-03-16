import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

import SearchBar from './SearchBar';

class Header extends React.Component {
  constructor(props) {
    super(props);
  }

  handleAuth() {
    this.props.storeSessionState();
  }

  render() {
    const user = this.props.user;
    return (
      <HeaderContainer>
        <Title to='/'>
          <img src='../../public/img/beer-logo.png' />
          BeerMe
        </Title>
        { !this.props.isLoggedIn &&
          <SignInButton
            onClick={() => this.handleAuth()}>
              Sign in with Github
          </SignInButton>
        }
        { this.props.isLoggedIn &&
          <SignOut onClick={() => this.props.signOut()}>
            Sign out
          </SignOut>
        }
      </HeaderContainer>
    );
  }
}

export default Header;

const HeaderContainer = styled.div`
  width: 100%;
  height: 90px;
  background: #396FB8;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  color: white;
  padding: 10px 20px;
  box-sizing: border-box;
`;

const Title = styled(Link)`
  color: white;
  font-weight: 400;
  font-size: 2.25rem;
  margin: 0;
  line-height: 2.5rem;
  text-decoration: none;
  font-family: 'Oswald', 'Open Sans', sans-serif;

  & img {
    padding-right: 5px;
    margin-bottom: -5px;
    width: 40px;
  }
`;

const UserName = styled.p`
  padding: 10px 20px;
  border-radius: 5px;
  background: #396FB8;
  color: white;
  margin: 0 0 0 10px;
  border: 2px solid white;
  font-size: 0.9rem;
  text-decoration: none;
  position: relative;
  z-index: 100;
`;

const SignOut = styled.button`
  ${'' /* position: absolute;
  right: 0;
  bottom: -25px; */}
  font-size: 0.9rem;
  color: white;
  background: none;
  ${'' /* opacity: 0;
  transform: scale(0); */}
  padding: 10px 20px;
  border-radius: 5px;
  border: 2px solid white;
  transition: 0.2s;
  &:hover {
    cursor: pointer;
    background: tomato;
    color: white;
    border: 2px solid tomato;
  }
  &:active {
    background: tomato;
    color: white;
    opacity: 0.5;
    outline: none;
  }
  &:focus {
    outline: none;
  }
`;

const ButtonLink = styled(Link)`
  padding: 10px 20px;
  border-radius: 5px;
  background: MEDIUMSEAGREEN;
  color: white;
  margin: 0 0 0 10px;
  text-decoration: none;
`;

const SignInButton = styled.button`
  padding: 10px 20px;
  border-radius: 5px;
  background: ${props =>
    (props.red && 'tomato')
    || (props.green && 'MEDIUMSEAGREEN')
    || 'none'
  };
  color: white;
  border: 2px solid white;
  font-family: 'Open Sans', sans-serif;
  font-size: 0.9rem;
  text-decoration: none;
  margin: 0;

  @media (max-width: 400px) {
    max-width: 100px;
    max-height: 40px;
    overflow: hidden;
  }

  &:hover {
    cursor: pointer;
    background: white;
    color: #396FB8;
  }

`;
