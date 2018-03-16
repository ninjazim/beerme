import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import styled, { css, keyframes } from 'styled-components';
import axios from 'axios';

class SearchBar extends React.Component {
  constructor() {
    super();
    // this.state = {
    //   search: ''
    // }
  }

  componentWillMount() {
    if (this.props.location.pathname !== '/') {
      this.props.updateLocation(this.props.location.pathname.split('/')[2]);
    } else {
      let search = '';
      axios.get('https://freegeoip.net/json/')
        .then(response => {
          if (response.status == 200) {
            if (response.data.country_name == "United States") {
              search = `${response.data.city}, ${response.data.region_code}`;
            } else {
              search = `${response.data.city}, ${response.data.country_name}`;
            }
          } else {
            search = 'San Francisco, CA';
          }
          this.props.updateLocation(search);
        });
    }
  }

  submitForm(e) {
    e.preventDefault();
    if (this.props.location.pathname == '/') {
      this.props.history.push(`/search/${this.props.searchArea}`);
    } else if (this.props.location.pathname != `/search/${this.props.searchArea}`) {
      this.props.history.push(`/search/${this.props.searchArea}`);
      this.props.findBars(this.props.searchArea);
    } else {
      this.props.findBars(this.props.searchArea);
    }

  }

  render() {
    return (
      <SearchForm {...this.props} onSubmit={(e) => { this.submitForm(e) }}>
        <Input id="search"
               type='text'
               value={this.props.searchArea}
               placeholder="Enter a city"
               onChange={(e) => this.props.updateLocation(e.target.value)}
             />
        { this.props.isLoading == true &&
        <Spinner >
            🍥
        </Spinner>
        }
        { this.props.isLoading == false &&
          <SearchButton value="submit" >
            <span>
              &#9906;
            </span>
          </SearchButton>
        }
      </SearchForm>
    );
  }
}

export default withRouter(SearchBar);

const SearchForm = styled.form`
  position: relative;
  opacity: 0;
  display: flex;
  align-items: center;
  transform: scale(1);
  transition: scale 0.1s ease,
              opacity 0.4s ease 0.6s;

  ${props => props.visible == true && css`
    opacity: 1;
    transform: scale(1);
  `}
`;

const Input = styled.input`
  min-width: 550px;
  height: 50px;
  padding: 5px 46px;
  box-sizing: border-box;
  background: rgba(255,255,255,0.08);
  border: none;
  text-align: center;
  font-size: 1.5rem;
  line-height: 2rem;
  color: white;
  border: 1px solid #396FB8;
  transition: 0.3s;
  font-family: 'Oswald', 'Open Sans', sans-serif;
  transition: 0.2s;

  &:focus {
    outline: none;
    border-bottom: 1px solid white;
    background: rgba(255,255,255,0.12);
  }

  &::placeholder {
    color: white;
    opacity: 0.5;
  }

  @media (max-width: 1000px) {
    min-width: 400px;
  }

  @media (max-width: 840px) {
    min-width: 90vw;
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
  position: fixed;
  right: 7px;
  animation: ${rotate360} 0.5s linear infinite;
`;

const SearchButton = styled.button`
  position: fixed;
  right: 5px;
  font-size: 2rem;
  line-height: 1rem;
  display: inline-block;
  opacity: 0.7;
  transition: 0.3s;
  border: none;
  height: 40px;
  width: 40px;
  border-radius: 50px;
  background: none;

  &:hover, &:focus {
    opacity: 1;
    cursor: pointer;
    background: rgba(255,255,255,0.15);
    outline: none;
  }

  & span {
    display: inline-block;
    transform: rotate(-45deg);
    color: white;
    padding: 0 3px 5px;
  }
`;
