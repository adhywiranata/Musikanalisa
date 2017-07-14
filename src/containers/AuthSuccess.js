import React from 'react';
import { Link } from 'react-router-dom';

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

class AuthSuccess extends React.Component {
  constructor() {
    super();
    if (window.location.hash) {
      const hash = window.location.hash.substring(1);
      const accessToken = hash.split('&')[0].replace('access_token=','');
      localStorage.setItem('accessToken', accessToken);
    }
  }

  render() {
    return (
      <div style={styles.container}>
        <h2 style={{ color: '#FFFFFF' }}>Login Success!</h2>
        <Link to="/">
          <button style={styles.btn}>
            Continue
          </button>
        </Link>
      </div>
    );
  }
}

export default AuthSuccess;
