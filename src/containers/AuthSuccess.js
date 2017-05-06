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
}

class AuthSuccess extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  componentDidMount() {
    const { access_token, refresh_token } = this.props.match.params;
    localStorage.setItem('accessToken', access_token);
    localStorage.setItem('refreshToken', refresh_token);
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
