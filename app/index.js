import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Link, Switch, Redirect } from 'react-router-dom';

import transition from 'styled-transition-group';
import styled from 'styled-components';
import axios from 'axios';

import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';
import BarList from './components/BarList';
import Cities from './components/Cities';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      user: {},
      isLoggedIn: false,
      search: '',
      hasSearched: false,
      searchResults: {},
      isLoading: false,
      isLoadingMore: false,
      bars: [],
      numOfResults: 0,
      lastSearch: '',
      // redirectToAuth: false
    }
    this.updateLocation = this.updateLocation.bind(this);
    this.findBars = this.findBars.bind(this);
    this.findMoreBars = this.findMoreBars.bind(this);
    this.signOut = this.signOut.bind(this);
    this.storeSessionState = this.storeSessionState.bind(this);
    this.updateAttendeeState = this.updateAttendeeState.bind(this);

  }

  componentWillMount() {
    let sessionState = window.sessionStorage.getItem('preAuthState');
    if (sessionState) {
      console.log("resoring pre-auth state");
      this.setState(JSON.parse(sessionState));
      window.sessionStorage.clear();
    }
    axios.get(`/api/user`)
      .then(response => {
        let user = response.data;
        let isLoggedIn = false;
        if (Object.keys(user).length > 0) {
          isLoggedIn = true;
        }
        this.setState({
          user,
          isLoggedIn
        });
      });
  }

  storeSessionState() {
    window.sessionStorage.setItem('preAuthState', JSON.stringify(this.state));
    console.log("state stashed");
    window.location = '/auth/github';
  }

  signOut() {
    axios.get(`/logout`)
      .then(response => {
        console.log(response);
        let user = response.data;
        this.setState({
          isLoggedIn: false,
          user
        });
      });
  }

  updateLocation(search) {
    this.setState({
      search
    });
  }

  updateAttendeeState(barIndex, attendees) {
    let bars = this.state.bars.slice();
    bars[barIndex].attendees = attendees;
    this.setState({ bars });
  }

  findBars(search, offset = 0) {
    this.setState({
      isLoading: true,
    });
    if (this.state.lastSearch == search) {
      setTimeout(() => {
        this.setState({
          isLoading: false
        });
      }, 500);
    } else {
      if (search.trim().length > 0) {
        console.log(`Searching for bars in ${search}...`);
        axios.get(`/api/search/${search}?offset=${offset}`)
             .then(response => {
               console.log(response);
               this.setState({
                 bars: response.data.businesses,
                 numOfResults: response.data.total,
                 hasSearched: true,
                 isLoading: false,
                 lastSearch: search,
               });
             })
             .catch(error => { console.log(error) });
      } else {
        document.getElementById('search').focus();
        this.setState({
          isLoading: false,
        });
      }
    }
  }

  findMoreBars(offset = 0) {
    this.setState({
      isLoadingMore: true,
    });
    let lastSearch = this.state.lastSearch;
    if (lastSearch.trim().length > 0) {
      console.log(`Searching for additional bars in ${lastSearch}...`);
      axios.get(`/api/search/${lastSearch}?offset=${offset}`)
           .then(response => {
             console.log(response);
             this.setState({
               bars: this.state.bars.concat(response.data.businesses),
               numOfResults: response.data.total,
               isLoadingMore: false,
             });
           })
           .catch(error => { console.log(error) });
    } else {
      document.getElementById('search').focus();
      this.setState({
        isLoadingMore: false,
      });
    }
  }

  render () {
    let { user, isLoggedIn, search, hasSearched, bars, isLoading, isLoadingMore, lastSearch, numOfResults } = this.state;

    return (
      <BrowserRouter>
        <div>
          <Route path='/' render={(props) => (
            <Header user={user}
                    isLoggedIn={isLoggedIn}
                    searchArea={search}
                    hasSearched={hasSearched}
                    findBars={this.findBars}
                    updateLocation={this.updateLocation}
                    isLoading={isLoading}
                    signOut={this.signOut}
                    storeSessionState={this.storeSessionState}
                    {...props} />
            )}
          />
          <Route path='/' render={(props) => (
            <Hero searchArea={search}
                  updateLocation={this.updateLocation}
                  hasSearched={hasSearched}
                  findBars={this.findBars}
                  isLoading={isLoading}
                  {...props} />
            )}
          />
          <Switch>
            <Route path="/search/:location" render={(props) => (
              <BarList bars={bars}
                       numOfResults={numOfResults}
                       hasSearched={hasSearched}
                       isLoading={isLoading}
                       isLoadingMore={isLoadingMore}
                       isLoggedIn={isLoggedIn}
                       lastSearch={lastSearch}
                       user={user}
                       findBars={this.findBars}
                       findMoreBars={this.findMoreBars}
                       updateAttendeeState={this.updateAttendeeState}
                       {...props} />
              )}
            />
          </Switch>
          <Route path='/' render={(props) => (
            <Cities in={props.location.pathname === '/'}
                    updateLocation={this.updateLocation}
                    findBars={this.findBars} />
            )}
          />
          <Footer isLoading={isLoading} />
        </div>
      </BrowserRouter>
    );
  }
}

render(<App/>, document.getElementById('app'));
