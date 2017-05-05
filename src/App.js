import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import logo from './logo.svg';
import './App.css';

import Login from './containers/Login';
import AuthSuccess from './containers/AuthSuccess';
import MyArtists from './containers/MyArtists';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <div className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h2>MusiKanalisa</h2>
          </div>
          <Route exact path="/" component={MyArtists} />
          <Route path="/login" component={Login} />
          <Route path="/callback/:access_token/:refresh_token" component={AuthSuccess} />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
