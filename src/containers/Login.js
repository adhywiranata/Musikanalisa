import React from 'react';

import { SPOTIFY_CLIENT_ID, SPOTIFY_USER_SCOPES, SPOTIFY_CALLBACK_URL } from '../config/api';

const styles = {
  list: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 40,
    boxSizing: 'border-box',
  },
  btn: {
    backgroundColor: '#1ED760',
    padding: 20,
    border: 0,
    borderRadius: 10,
    fontSize: '1.3em',
    cursor: 'pointer',
    color: '#FFFFFF',
    outline: 'none',
  },
};

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    return (
      <div style={styles.container}>
        <h2 style={{ color: '#FFFFFF', fontSize: '2em' }}>Login to Musikanalisa</h2>
        <a href={`https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&redirect_uri=${SPOTIFY_CALLBACK_URL}&scope=${encodeURIComponent(SPOTIFY_USER_SCOPES)}&response_type=token&state=123`}>
          <button style={styles.btn}>
            Login to Spotify
          </button>
        </a>
      </div>
    );
  }
}

export default Login;
