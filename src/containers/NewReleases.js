import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import * as d3 from 'd3';

import AlbumList from '../components/AlbumList';

const styles = {
  container: {
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  sectionHeading: {
    color: '#FFFFFF',
    fontSize: '2em',
  },
  svgWrapper: {
    height: 900,
    width: '80%',
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

class NewReleases extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accessToken: '',
      newReleases: [],
      fetchDone: false,
      fetchError: false,
    }
  }

  componentWillMount() {
    const accessToken = localStorage.getItem('accessToken');
    this.setState({ accessToken });
  }

  renderSvg() {
    
  }

  fetchSuccess(albums) {
    this.setState({
      newReleases: albums.map(album => ({
        id: album.id,
        name: album.name,
        images: album.images,
        popularity: album.popularity,
        release_date: album.release_date,
        artists: album.artists,
        tracks: album.tracks,
      })),
      fetchDone: true,
    }, this.renderSvg);
  }

  componentDidMount() {
    axios({
      method: 'GET',
      url: 'https://api.spotify.com/v1/browse/new-releases',
      headers: {
        Authorization: `Bearer ${this.state.accessToken}`,
      }
    }).then(res => {
      const albumsIds = res.data.albums.items.map(item => item.id).join(',');
      console.log(albumsIds);
      axios({
        method: 'GET',
        url: `https://api.spotify.com/v1/albums?ids=${albumsIds}`,
        headers: {
          Authorization: `Bearer ${this.state.accessToken}`,
        }
      }).then(res => this.fetchSuccess(res.data.albums))
      .catch(err => {
        console.log(err);
        this.setState({ fetchDone: true, fetchError: true });
      });
    })
    .catch(err => {
      console.log(err);
      this.setState({ fetchDone: true, fetchError: true });
    });
  }

  render() {
    const { newReleases, fetchDone, fetchError } = this.state;
    return (
      <div style={styles.container}>
        <h2 style={styles.sectionHeading}>New Releases</h2>
        { !fetchError && <div id='svgWrapper' style={styles.svgWrapper}></div> }
        <div style={styles.list}>
        { !fetchDone && <p style={{ color: '#FFFFFF' }}>Loading...</p> }
        { fetchError && (
          <Link to="/login">
            <button style={styles.btn}>
              Sorry, Something went wrong. You have to login to spotify!
            </button>
          </Link>
        ) }
        <AlbumList items={newReleases} />
        </div>
      </div>
    );
  }
}

export default NewReleases;
