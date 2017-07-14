import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import './App.css';
import {
  Login,
  AuthSuccess,
  Home,
  MyArtists,
  Profile,
  NewReleases,
  TopArtists,
} from './containers';
import { Header } from './components';

const App = () => (
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
        {/* <Route path="/callback/:access_token/:refresh_token" component={AuthSuccess} /> */}
        <Route path="/callback" component={AuthSuccess} />
      </Switch>
    </div>
  </BrowserRouter>
);

export default App;
