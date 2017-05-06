import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import * as d3 from 'd3';

import TrackList from '../components/TrackList';

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
  list: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 100,
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
    const dataset = recentTracks.map(track => ({
      id: track.id,
      name: track.name,
      image: track.album.images[0].url,
    }));
    console.log(dataset);

    const circleBaseRadius = 80;
    const circleOuterRadius = 90;
    const circleInnerRadius = 70;
    const circleMargin = 35;
    const customElasticEasing = d3.easeElastic.period(0.6);

    // items are indexed from 0 to X. each time we got 5 items in a row,
    // reset the x position to 0
    const circleIndexXPosition = index => index % 5
    // modify the y by adding them
    const circleIndexYPosition = index => Math.floor(index / 5) + 1

    const svg = d3.select('#svgWrapper')
      .append('svg')
        .attr('class', 'recentsSvg')
        .style('width', '100%')
        .style('height', '100%')
        .style('background-color', '#353535')
        .style('border', '1px solid rgba(255, 255, 255, 0.3)')
        .style('box-sizing', 'border-box')
        .style('padding', 50);

    const circleGroups = svg.selectAll('g')
      .data(dataset)
      .enter()
        .append('g')
        .attr('id', (d, i) => `circle-group-${i}`)
        .attr('transform', 'translate(80, -150)');

    const cgDefs = circleGroups.append('defs');

    const cgDefsPatterns = cgDefs.append('pattern')
      .attr('id', (d, i) => `cg-image-${i}`)
      .attr('patternUnits', 'objectBoundingBox')
      .attr('width', 10)
      .attr('height', 10);

    cgDefsPatterns.append('image')
      .attr('id', (d, i) => `cg-image-inner-${i}`)
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', circleInnerRadius * 2)
      .attr('height', circleInnerRadius * 2)
      .attr('xlink:href', (d) => d.image);

    circleGroups.append('circle')
      .attr('id', (d, i) => `circle-outer-${i}`)
      .attr('r', 0)
      .attr('cx', (d, i) => (circleOuterRadius * 2 + circleMargin) * circleIndexXPosition(i))
      .attr('cy', (d, i) => (circleOuterRadius * 2 + circleMargin) * circleIndexYPosition(i))
      .attr('stroke', '#2ecc71')
      .attr('stroke-width', 2)
      .attr('fill', 'none')
      .style('opacity', 0.5)
      .transition()
        .duration(1500)
        .delay((d, i) => i * 110)
        .ease(customElasticEasing)
        .attr('r', circleOuterRadius);

    circleGroups.append('circle')
      .attr('r', 0)
      .attr('cx', (d, i) => (circleOuterRadius * 2 + circleMargin) * circleIndexXPosition(i))
      .attr('cy', (d, i) => ((circleOuterRadius * 2 + circleMargin) * circleIndexYPosition(i)) + 50)
      .attr('fill', '#2ecc71')
      .attr('visibility', 'hidden')
      .transition()
        .duration(1000)
        .delay((d, i) => i * 100)
        .ease(customElasticEasing)
        .attr('r', circleBaseRadius)
        .attr('cy', (d, i) => (circleOuterRadius * 2 + circleMargin) * circleIndexYPosition(i))
        .attr('visibility', 'visible');

    circleGroups.append('circle')
      .attr('id', (d, i) => `circle-inner-${i}`)
      .attr('r', circleInnerRadius)
      .attr('cx', (d, i) => (circleOuterRadius * 2 + circleMargin) * circleIndexXPosition(i))
      .attr('cy', (d, i) => ((circleOuterRadius * 2 + circleMargin) * circleIndexYPosition(i)) + 50)
      .attr('fill', (d, i) => `url(#cg-image-${i})`)
      .attr('visibility', 'hidden')
      .transition()
        .duration(1000)
        .delay((d, i) => i * 100)
        .ease(customElasticEasing)
        .attr('cy', (d, i) => (circleOuterRadius * 2 + circleMargin) * circleIndexYPosition(i))
        .attr('visibility', 'visible');

    const circleTooltipGroups = circleGroups.append('g')
      .attr('id', (d, i) => `ctg-${i}`)
      .attr('visibility', 'hidden');

    // circleTooltipGroups.append('rect')
    //   .transition()
    //   .duration(1000)
    //   .delay(3000)
    //   .attr('width', circleOuterRadius * 4)
    //   .attr('height', 50)
    //   .attr('fill', '#222')
    //   .attr('stroke', 'rgba(255, 255, 255, 0.3)')
    //   .attr('stroke-width', 1)
    //   .attr('x', (d, i) => (circleOuterRadius * 2 + circleMargin) * circleIndexXPosition(i) - 100)
    //   .attr('y', (d, i) => (circleOuterRadius * 2 + circleMargin) * circleIndexYPosition(i) + 50);

    circleTooltipGroups.append('text')
      .attr('fill', '#FFFFFF')
      .text(d => d.name)
      .attr('width', circleOuterRadius)
      .attr('text-anchor', 'middle')
      .attr('x', (d, i) => (circleOuterRadius * 2 + circleMargin) * circleIndexXPosition(i))
      .attr('y', (d, i) => (circleOuterRadius * 2 + circleMargin) * circleIndexYPosition(i) + 110);

    circleGroups.on('mouseover', (d, i) => {
      d3.select(`#circle-outer-${i}`).transition()
        .ease(customElasticEasing).duration(500).attr('r', circleOuterRadius * 1.1);
      d3.select(`#circle-inner-${i}`).transition()
        .ease(customElasticEasing).duration(500).attr('r', circleInnerRadius * 1.2);
      d3.select(`#cg-image-inner-${i}`).transition()
        .ease(customElasticEasing).duration(500)
        .attr('width', circleInnerRadius * 2 * 1.2)
        .attr('height', circleInnerRadius * 2 * 1.2);
      d3.select(`#ctg-${i}`).transition()
        .duration(500).attr('visibility', 'visible');
    })
    .on('mouseleave', (d, i) => {
      d3.select(`#circle-outer-${i}`).transition()
        .ease(customElasticEasing).duration(500).attr('r', circleOuterRadius);
      d3.select(`#circle-inner-${i}`).transition()
        .ease(customElasticEasing).duration(500).attr('r', circleInnerRadius);
      d3.select(`#cg-image-inner-${i}`).transition()
        .ease(customElasticEasing).duration(500)
        .attr('width', circleInnerRadius * 2)
        .attr('height', circleInnerRadius * 2);
      d3.select(`#ctg-${i}`).transition()
        .duration(500).attr('visibility', 'hidden');
    });
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
        { !fetchError && <div id='svgWrapper' style={styles.svgWrapper}></div> }
        { !fetchDone && <p style={{ color: '#FFFFFF' }}>Loading...</p> }
        { fetchError && (
          <Link to="/login">
            <button style={styles.btn}>
              Sorry, Something went wrong. You have to login to spotify!
            </button>
          </Link>
        ) }
        <TrackList items={ recentTracks } />
      </div>
    );
  }
}

export default Profile;
