import React from 'react';
import axios from 'axios';
import * as d3 from 'd3';

import AlbumList from '../components/AlbumList';
import { LinkButton } from '../components';

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
    height: 600,
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
    const { newReleases } = this.state;
    const dataset = newReleases.map(release => ({
      id: release.id,
      name: release.name,
      popularity: release.popularity,
      image: release.images[0].url,
    }));
    console.log(dataset);

    const svg = d3.select('#svgWrapper')
      .append('svg')
        .attr('class', 'newReleasesSvg')
        .style('width', '100%')
        .style('height', '100%')
        .style('background-color', '#353535')
        .style('border', '1px solid rgba(255, 255, 255, 0.3)')
        .style('box-sizing', 'border-box')
        .style('padding', 50);

    // we'll show 20 bar charts
    const svgWidth = 1000;
    const svgHeight = 500;
    const barPadding = 40;
    const customElasticEasing = d3.easeElastic.period(0.3);
    const popularities = dataset.map(item => item.popularity);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(popularities)])
      .range([svgHeight, 0]);

    const barGroup = svg.selectAll('g').data(dataset).enter().append('g');

    barGroup.append('rect')
        .attr('fill', 'none')
        .attr('stroke', 'rgba(255, 255, 255, 0.3)')
        .attr('stroke-width', 1)
        .attr('width', (d, i) => svgWidth / 20 - barPadding)
        .attr('x', (d, i) => (svgWidth / 20) * i + barPadding)
        .attr('height', d => svgHeight )
        .attr('y', 0);

    barGroup.append('rect')
        .attr('fill', '#1ED760')
        .attr('width', (d, i) => svgWidth / 20 - barPadding)
        .attr('x', (d, i) => (svgWidth / 20) * i + barPadding)
        .attr('height', 0)
        .attr('y', svgHeight)
      .transition()
        .duration(1000)
        .ease(customElasticEasing)
        .delay((d, i) => i * 100)
        .attr('height', (d) => svgHeight - yScale(d.popularity) )
        .attr('y', (d, i) => yScale(d.popularity));

    barGroup.append('text')
      .attr('fill', '#FFFFFF')
      .text(d => d.name)
      .attr('x', 0)
      .attr('y', (d, i) => (svgWidth / 20) * i * -1 - barPadding)
      .attr('transform', 'rotate(90) translate(0, -20)');

    const yAxis = d3.axisLeft(yScale).ticks(d3.max(popularities) / 5);

    svg.append('g')
      .attr('class', 'y axis')
      .call(yAxis);

    d3.select('.y.axis').select('.domain').attr('stroke', 'rgba(255, 255, 255, 0.8)')
    const axisTicks = d3.select('.y.axis').selectAll('.tick');
    axisTicks.select('line').attr('stroke', 'rgba(255, 255, 255, 0.5)');
    axisTicks.select('text').attr('fill', '#FFFFFF').style('font-size', 16);

    svg.append('text')
      .attr('x', -40)
      .attr('y', -20)
      .text('POPULARITY')
      .attr('fill', 'rgba(255,255,255, 0.8)')
      .style('font-size', 20)
      .style('font-weight', 700);
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
          <LinkButton linkTo={'/login'} label={'Sorry, something went wrong. Please login to Spotify'} />
        ) }
        <AlbumList items={newReleases} />
        </div>
      </div>
    );
  }
}

export default NewReleases;
