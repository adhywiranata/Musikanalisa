import React from 'react';
import axios from 'axios';
import _ from 'lodash';

const styles = {
  container: {
    padding: '0 100px',
  },
  sectionHeading: {
    color: '#FFFFFF',
    fontSize: '2em',
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
  },
};

class MyArtists extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      artist: '',
      albums: [],
    };
  }

  componentDidMount() {
    const { artistId } = this.props.match.params;
    axios(`https://api.spotify.com/v1/artists/${artistId}`)
      .then(res => this.setState({ artist: res.data.name }));
    axios(`https://api.spotify.com/v1/artists/${artistId}/albums`)
      .then((res) => {
        const albums = _.uniqBy(res.data.items, 'name');
        const albumsId = albums.map(album => album.id).join(',');
        axios(`https://api.spotify.com/v1/albums/?ids=${albumsId}`)
          .then(resInner => this.setState({ albums: resInner.data.albums }));
      });
  }

  render() {
    return (
      <div style={styles.container}>
        { this.state.artist !== '' && (
          <h2 style={styles.sectionHeading}>{`${this.state.artist}'s Musics`}</h2>
        )}
        <div style={styles.list}>
          {this.state.albums.map(album => (
            <div key={album.id} style={styles.card}>
              <img src={album.images[0].url} width="100%" />
              <h4>{ album.name }</h4>
              <p>Popularity: { album.popularity }</p>
              <p>{ album.release_date }</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default MyArtists;
