import React from 'react';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import transition from 'styled-transition-group';
import axios from 'axios';

class Cities extends React.Component {

  handleClick(location) {
    this.props.updateLocation(location);
  }

  render() {
    return (
      <FadeDiv {...this.props} >
        <ListContainer >
          <InnerContainer>
            <Card to="/search/New York, NY" key="New York" onClick={() => this.handleClick("New York, NY")}>
              <Image src='https://images.unsplash.com/photo-1490644658840-3f2e3f8c5625?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=2abcdcc96e92e169db38fccb99a3c911&auto=format&fit=crop&w=334&q=80' />
              <h1>New York</h1>
            </Card>
            <Card to="/search/San Francisco, CA" key="San Francisco" onClick={() => this.handleClick("San Francisco, CA")}>
              <Image src='https://images.unsplash.com/photo-1505004443511-90f62ead83f8?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=71fbca8d862693ecbc88119fed1e8d98&auto=format&fit=crop&w=395&q=80' />
              <h1>San Francisco</h1>
            </Card>
            <Card to="/search/Chicago, IL" key="Chicago" onClick={() => this.handleClick("Chicago, IL")}>
              <Image src='https://images.unsplash.com/photo-1494522358652-f30e61a60313?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=c39e2e693011b17dfc47d070250419fc&auto=format&fit=crop&w=750&q=80' />
              <h1>Chicago</h1>
            </Card>
          </InnerContainer>
        </ListContainer>
      </FadeDiv>
    );
  }
}

export default Cities;

const FadeDiv = transition.div.attrs({
  unmountOnExit: true,
  timeout: 500
})`
  &:enter { opacity: 0.01; }
  &:enter-active {
    opacity: 1;
    transition: opacity 1s ease;
  }
  &:exit { opacity: 1; }
  &:exit-active {
    opacity: 0.01;
    transition: opacity 0.5s ease;
  }
`;

const ListContainer = styled.div`
  width: 100%;
  min-height: 500px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 100px 20px;
  box-sizing: border-box;
  font-family: 'Open Sans', sans-serif;
  font-size: 0.75rem;
`;

const InnerContainer = styled.div`
  max-width: 1000px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex: 1;
  box-sizing: border-box;

  @media (max-width: 840px) {
    flex-direction: column;
  }
`;

const Card = styled(Link)`
  width: 350px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
  box-sizing: border-box;
  margin: 10px;
  ${'' /* border-radius: 5px; */}
  background-color: white;
  box-shadow: 0px 1px 5px 1px rgba(0,0,0,0.1);
  text-decoration: none;
  color: #333;
  transition: 0.2s;
  filter: saturate(0);

  @media (max-width: 1000px) {
    width: 30vw;
  }

  @media (max-width: 840px) {
    width: 75vw;
  }

  &:hover {
    box-shadow: 0px 1px 5px 4px rgba(0,0,0,0.1);
    filter: saturate(1);
  }
`;

const Image = styled.div`
  width: 100%;
  height: 250px;
  background: url(${props => props.src});
  background-position: center;
  background-size: cover;
`;
