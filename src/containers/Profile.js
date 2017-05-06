import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import * as d3 from 'd3';

const styles = {
  container: {
    padding: '0 100px',
    display: 'flex',
    flexDirection: 'column',
  },
  sectionHeading: {
    color: '#FFFFFF',
    fontSize: '2em',
  },
  svgWrapper: {
    height: 300,
    width: '100%',
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

  renderSvg() {
    const { recentTracks } = this.state;
    console.log(recentTracks[0]);
    //
    const svg = d3.select('svgWrapper')
      .append('svg')
        .attr('class', 'recentsSvg')
        .style('width', '100%')
        .style('height', '100%')
        .style('background-color', '#353535')
        .style('border', '1px solid rgba(255, 255, 255, 0.3)')
        .style('padding', 50);

    return true;
    //
    // const svgWidth = parseInt(svg.style('width').replace('px', ''), 10);
    // const svgHeight = parseInt(svg.style('height').replace('px', ''), 10);
  }

  fetchSuccess(res) {
    this.setState({
      recentTracks: res.data.items.map(recent => recent.track),
      fetchDone: true,
    }, () => { this.renderSvg() });
  }

  componentDidMount() {
    axios({
      method: 'GET',
      url: 'https://api.spotify.com/v1/me/player/recently-played',
      headers: {
        Authorization: `Bearer ${this.state.accessToken}`,
      }
    }).then(res => this.fetchSuccess(res))
    .catch(err => {
      console.log(err);
      this.setState({ fetchDone: true, fetchError: true });
    });
  }

  render() {
    const { recentTracks, fetchDone, fetchError } = this.state;
    return (
      <div style={styles.container}>
        <h2 style={styles.sectionHeading}>My Recent Tracks</h2>
        <div id='svgWrapper' style={styles.svgWrapper}></div>
        <div style={styles.list}>
        { !fetchDone && <p style={{ color: '#FFFFFF' }}>Loading...</p> }
        { fetchError && (
          <Link to="/login">
            <button style={styles.btn}>
              Sorry, Something went wrong. You have to login to spotify!
            </button>
          </Link>
        ) }
        { recentTracks.map((track, index) => (
          <div key={index} style={styles.card}>
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
                <Link key={artist.id} to="/" style={{ textDecoration: 'none' }}>
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
