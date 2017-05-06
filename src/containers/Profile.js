import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const styles = {
  container: {
    padding: '0 100px',
  },
  sectionHeading: {
    color: '#FFFFFF',
    fontSize: '2em'
  },
  list: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 40,
    boxSizing: 'border-box',
  },
  card: {
    width: '20%',
    margin: '20px 10px',
    padding: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    paddingBottom: 20,
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

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accessToken: '',
      recentTracks: [],
      fetchDone: false,
      fetchError: false,
    }
  }

  componentWillMount() {
    const accessToken = localStorage.getItem('accessToken');
    this.setState({ accessToken });
  }

  componentDidMount() {
    console.log(this.state.accessToken);
    axios({
      method: 'GET',
      url: 'https://api.spotify.com/v1/me/player/recently-played',
      headers: {
        Authorization: `Bearer ${this.state.accessToken}`,
      }
    }).then(res => this.setState({
      recentTracks: res.data.items.map(recent => recent.track),
      fetchDone: true,
    })).catch(err => this.setState({ fetchDone: true, fetchError: true }));
  }

  render() {
    const { recentTracks, fetchDone, fetchError } = this.state;
    return (
      <div style={styles.container}>
        <h2 style={styles.sectionHeading}>My Recent Tracks</h2>
        <div style={styles.list}>
        { !fetchDone && <p style={{ color: '#FFFFFF' }}>Loading...</p> }
        { fetchError && (
          <Link to="/login">
            <button style={styles.btn}>
              Sorry, Something went wrong. You have to login to spotify!
            </button>
          </Link>
        ) }
        { recentTracks.map(track => (
          <div key={track.id} style={styles.card}>
            <div style={{ position: 'relative' }}>
              <img src={ track.album.images[0].url } width="100%" alt={''} />
              <div style={{ top: 0, width: '100%', height: '98%', position: 'absolute', backgroundColor: 'rgba(0,0,0, .5)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                <h4 style={{ color: '#FFFFFF', bottom: 20, textAlign: 'center' }}>{ track.name }</h4>
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.8em', color: '#666' }}>Artists</span>
              <ul style={{ padding: 0 }}>
              { track.artists.map(artist => (
                <Link to="/" style={{ textDecoration: 'none' }}>
                  <li style={{ color: '#1ED760', fontSize: '0.8em', padding: 0, listStyleType: 'none' }}>
                    { artist.name }
                  </li>
                </Link>)
              )}
              </ul>
            </div>
          </div>
          )
        )}
        </div>
      </div>
    );
  }
}

export default Profile;
