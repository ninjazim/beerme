import React from 'react';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import transition from 'styled-transition-group';
import axios from 'axios';

import SearchBar from './SearchBar';

class Hero extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const user = this.props.user;
    return (
      <HeroContainer {...this.props} collapsed={this.props.location.pathname !== '/'}>
        <InnerContainer>
          <Title>
            Find great bars to meet up at in your area
          </Title>
          <SearchBar visible {...this.props} />
        </InnerContainer>
      </HeroContainer>
    );
  }
}

export default Hero;

const HeroContainer = styled.div`
  width: 100%;
  height: 500px;
  background: #396FB8;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  color: white;
  padding: 20px;
  box-sizing: border-box;
  font-family: 'Oswald', 'Open Sans', sans-serif;
  transition: height 0.5s ease;

  ${props => props.collapsed == true && css`
    padding: 0px;
    height: 0px;

    @media (max-width: 840px) {
      height: 60px;
    }

    ${InnerContainer} {
      margin-top: -110px;
      ${'' /* transition: margin 0.3s ease 0.5s; */}

      @media (max-width: 840px) {
        margin-top: 10px;
      }
    }

    ${Title} {
      opacity: 0;
      transition: opacity 0.3s ease;
      @media (max-width: 840px) {
        display: none;
      }
    }
  `};


`;




const InnerContainer = styled.div`
  max-width: 800px;
  display: ${props =>
    (props.collapsed == true && 'none') || 'flex'
  };
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  padding-bottom: 40px;
  opacity: 1;
  flex: 1;
  box-sizing: border-box;
`;

const Title = styled.p`
  font-size: 2rem;
  line-height: 2.5rem;
  padding-bottom: 20px;
  margin: 0;
  transition: 0.5s;
  text-align: center;
`;
