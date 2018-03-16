import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

class Footer extends React.Component {

  render() {
    return (
      <FooterContainer hidden={this.props.isLoading}>
        <CreatorLink href='https://www.github.com/ninjazim'>
          created by <span>ninjazim</span>
        </CreatorLink>
        <Spacer>//</Spacer>
        <CreatorLink href='https://www.yelp.com/'>
        powered by <span>Yelp</span>
        </CreatorLink>
      </FooterContainer>
    );
  }
}

export default Footer;

const FooterContainer = styled.div`
  width: 100%;
  height: 50px;
  color: white;
  padding: 10px 20px;
  box-sizing: border-box;
  text-align: center;
  font-size: 0.8rem;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-top: 1px dashed lightgray;
  opacity: ${props =>
    (props.hidden && '0') || '1'
  };
  transition: 0.3s;
`;

const Spacer = styled.span`
  padding: 0 10px;
  color: gray;
`;

const CreatorLink = styled.a`
  color: gray;
  text-align: center;
  text-decoration: none;

  & span {
    text-decoration: underline;
  }
`
