import React from 'react';
import axios from 'axios';

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
  card: {
    maxWidth: '28%',
    margin: '10px 0',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    border: '1px solid rgba(0,0,0, .1)',
  },
}

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accessToken: '',
      recentTracks: [],
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
    }).then(res => this.setState({ recentTracks: res.data.items.map(recent => recent.track) }));
  }

  render() {
    return (
      <div style={styles.container}>
        <h2>My Recent Tracks</h2>
        <div style={styles.list}>
        { this.state.recentTracks.map(track => (
          <div key={track.id} style={styles.card}>
            <h4>{ track.name }</h4>
            <div>{ track.artists.map(artist => <p>{ artist.name }</p>)}</div>
            <img src={ track.album.images[0].url } width="100%" />
          </div>
          )
        )}
        </div>
      </div>
    );
  }
}

export default Profile;
