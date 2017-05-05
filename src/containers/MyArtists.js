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
    width: '20%',
    margin: '10px 0',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    border: '1px solid rgba(0,0,0, .1)',
  },
}

class MyArtists extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      artist: 'Aimer',
      albums: [],
    }
  }

  componentDidMount() {
    axios('https://api.spotify.com/v1/artists/0bAsR2unSRpn6BQPEnNlZm/albums')
      .then(res => this.setState({ albums: res.data.items }))
  }

  render() {
    console.log(this.state.albums);
    return (
      <div style={styles.container}>
        <h2>{`${this.state.artist}\'s Albums`}</h2>
        <div style={styles.list}>
          {this.state.albums.map(album => (
            <div key={album.id} style={styles.card}>
              <h3>{ album.name }</h3>
              <img src={ album.images[0].url} width="100%" />
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default MyArtists;
