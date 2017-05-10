import React from 'react';
import { Link } from 'react-router-dom';

import logo from './logo.svg';

const Header = () => (
  <div className="App-header">
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <img src={logo} className="App-logo" alt="logo" />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <h1 className="App-logo-text">
          MUSI<span style={{ color: '#1ED760' }}>KANAL</span>ISA
        </h1>
      </div>
    </div>
    <nav className="App-nav">
      <ul>
        <Link to="/"><li>HOME</li></Link>
        <Link to="/new-releases"><li>NEW RELEASES</li></Link>
        <Link to="/artists"><li>ARTISTS</li></Link>
        <Link to="/me"><li>RECENT TRACKS</li></Link>
        <Link to="/login"><li>LOGIN</li></Link>
      </ul>
    </nav>
  </div>
);

export default Header;
