import React from 'react';
import { Link } from 'react-router-dom';
import styled, { css, keyframes } from 'styled-components';
import transition from 'styled-transition-group';
import axios from 'axios';

import Card from './Card';

class BarList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    }
  }

  componentWillMount() {
    this.props.findBars(this.props.match.params.location);
    document.title = `BeerMe - ${this.props.match.params.location}`;
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isLoading != nextProps.isLoading) {
      this.setState({
        visible: !nextProps.isLoading
      });
    }
  }

  componentWillUnmount() {
    document.title = `BeerMe - Bar Finder`;
  }

  loadMore() {
    if (this.props.bars.length < this.props.numOfResults) {
      this.props.findMoreBars(this.props.bars.length);
    } else {
      console.log("all results loaded");
    }
  }

  render() {
    return (
      <FadeDiv in={this.state.visible}>
        <ListContainer visible={this.props.hasSearched} fadeOut={this.props.isLoading} >
          <InnerContainer>
            { this.props.bars && this.props.bars.map((bar,i) => {
              return <Card key={bar.id} bar={bar} barIndex={i} delay={i * 0.5} {...this.props} />
            })}
            <LoadAdditional>
              <p>{`Showing ${this.props.bars.length} of ${this.props.numOfResults} total results`}</p>
              { this.props.isLoadingMore == false &&
                <GoingButton onClick={() => this.loadMore() }>
                  Load more
                </GoingButton>
              }
              { this.props.isLoadingMore == true &&
                <Spinner >
                    🍥
                </Spinner>
              }
            </LoadAdditional>
          </InnerContainer>
        </ListContainer>
      </FadeDiv>
    );
  }
}

export default BarList;

const FadeDiv = transition.div.attrs({
  unmountOnExit: true,
  timeout: 500
})`
  &:enter {
    opacity: 0.01;
    margin-top: -30px;
  }
  &:enter-active {
    opacity: 1;
    margin-top: 0;
    transition: opacity 1s ease, margin 0.5s ease;
  }
  &:exit {
    opacity: 1;
    margin-top: 0;
  }
  &:exit-active {
    opacity: 0.01;
    margin-top: -30px;
    transition: opacity 0.2s ease, margin 0.2s ease;
  }
`;

const ListContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
  font-family: 'Oswald', 'Open Sans', sans-serif;
  margin-top: 0;
  opacity: 1;
`;

const InnerContainer = styled.div`
  max-width: 800px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  flex: 1;
  box-sizing: border-box;
`;

const LoadAdditional = styled.div`
  padding: 20px;
  text-align: center;
  color: #333;
  font-family: 'Open Sans', sans-serif;
  height: 150px;
  box-sizing: border-box;
`;

const GoingButton = styled.button`
  padding: 5px 10px;
  margin-right: 10px;
  border: 1px solid #396FB8;
  background: ${props =>
  (props.going == true && '#396FB8') || 'white'
  };
  border-radius: 2px;
  color: ${props =>
  (props.going == true && 'white') || '#396FB8'
  };
  font-size: 0.8rem;
  transition: 0.3s;

  &:hover {
    cursor: pointer;
    box-shadow: 0px 1px 3px 1px rgba(0,0,0,0.1);
    color: white;
    background: #396FB8;
  }

  &:focus {
    outline: none;
  }

  &:disabled {
    background: lightgray;
    opacity: 0.9;
    border-color: lightgray;
    cursor: not-allowed;
    color: white;

    &:hover {
      cursor: not-allowed;
    }

  }
`;

const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.span`
  font-size: 2rem;
  display: inline-block;
  position: inherit;
  animation: ${rotate360} 0.5s linear infinite;
`;
