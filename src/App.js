import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import './App.css';

import Login from './containers/Login';
import AuthSuccess from './containers/AuthSuccess';
import Home from './containers/Home';
import MyArtists from './containers/MyArtists';
import Profile from './containers/Profile';
import NewReleases from './containers/NewReleases';
import TopArtists from './containers/TopArtists';
import { Header } from './components';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Header />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/new-releases" component={NewReleases} />
            <Route path="/me" component={Profile} />
            <Route path="/artists" component={TopArtists} />
            <Route path="/artist/:artistId" component={MyArtists} />
            <Route path="/callback/:access_token/:refresh_token" component={AuthSuccess} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
