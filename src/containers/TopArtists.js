import React from 'react';
import axios from 'axios';
// import * as d3 from 'd3';

import { LinkButton } from '../components';
import ArtistList from '../components/ArtistList';

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
    marginBottom: 80,
  },
  svgWrapper: {
    height: 900,
    width: '80%',
  },
};

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accessToken: '',
      topArtists: [],
      fetchDone: false,
      fetchError: false,
    };
  }

  componentWillMount() {
    const accessToken = localStorage.getItem('accessToken');
    this.setState({ accessToken });
  }

  componentDidMount() {
    axios({
      method: 'GET',
      url: 'https://api.spotify.com/v1/me/top/artists',
      headers: {
        Authorization: `Bearer ${this.state.accessToken}`,
      },
    }).then(res => this.fetchSuccess(res))
    .catch(() => {
      this.setState({ fetchDone: true, fetchError: true });
    });
  }

  fetchSuccess(res) {
    this.setState({
      topArtists: res.data.items,
      fetchDone: true,
    }, this.renderSvg);
  }

  renderSvg() {
    const { topArtists } = this.state;
    const dataset = topArtists.map(artist => ({
      id: artist.id,
      name: artist.name,
      popularity: artist.popularity,
      followers: artist.followers.total,
      image: artist.images[0].url,
      genres: artist.genres,
    }));
    console.log(dataset);
  }

  renderFetchedList() {
    const { topArtists, fetchDone, fetchError } = this.state;
    if (!fetchError && fetchDone) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
          <div id="svgWrapper" style={styles.svgWrapper} />
          <ArtistList items={topArtists} />
        </div>
      );
    }
    if (fetchError && fetchDone) {
      return (
        <LinkButton
          linkTo={'/login'}
          label={'Sorry, something went wrong. Please login to Spotify'}
        />
      );
    }
    return (<p style={{ color: '#FFFFFF' }}>Loading...</p>);
  }

  render() {
    return (
      <div style={styles.container}>
        <h2 style={styles.sectionHeading}>My Top Artists</h2>
        { this.renderFetchedList() }
      </div>
    );
  }
}

export default Profile;
