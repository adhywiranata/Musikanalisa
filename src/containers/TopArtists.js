import React from 'react';
import axios from 'axios';
import * as d3 from 'd3';
import _ from 'lodash';

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
    height: 1600,
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
      url: 'https://api.spotify.com/v1/me/top/artists?limit=50',
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

    const svg = d3.select('#svgWrapper')
      .append('svg')
        .attr('id', 'topArtistSvg')
        .style('width', '100%')
        .style('height', '100%')
        .style('background-color', '#353535')
        .style('border', '1px solid rgba(255, 255, 255, 0.3)')
        .style('box-sizing', 'border-box')
        .style('padding', 50);

    const svgWidth = 1000;
    const svgHeight = 1200;
    const barPadding = 10;
    const artistsLimit = 20;
    const barVerticalMargin = 5;
    // const customElasticEasing = d3.easeElastic.period(0.3);
    const artistsTopFollowers = _.orderBy(dataset, ['followers'], ['desc'])
      .filter((item, index) => index < artistsLimit);

    const xScale = d3.scaleLinear()
      .domain([0, d3.max(artistsTopFollowers.map(data => data.followers))])
      .range([0, svgWidth]);

    const barGroups = svg.selectAll('g').data(artistsTopFollowers).enter().append('g');

    const bgDefs = barGroups.append('defs');

    const bgDefsPatterns = bgDefs.append('pattern')
      .attr('id', (d, i) => `bg-image-${i}`)
      .attr('patternUnits', 'objectBoundingBox')
      .attr('width', 1)
      .attr('height', 1);

    bgDefsPatterns.append('image')
      .attr('id', (d, i) => `bg-image-inner-${i}`)
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 70)
      .attr('height', 70)
      .attr('xlink:href', d => d.image);

    barGroups.append('rect')
      .attr('fill', (d, i) => `url(#bg-image-${i})`)
      .attr('opacity', 0)
      // .attr('height', (svgHeight / artistsLimit) + barPadding)
      .attr('width', 80)
      .attr('height', 80)
      .attr('y', (d, i) => (((svgHeight / artistsLimit) + barPadding) * i) + (barVerticalMargin * i))
      .attr('x', 10)
      .transition()
      .duration(500)
      .delay((d, i) => i * 500)
      .attr('opacity', 1);

    barGroups.append('text')
      .attr('fill', '#FFFFFF')
      .attr('opacity', 0)
      .text(d => d.name)
      .attr('font-size', 14)
      .attr('y', (d, i) => (((svgHeight / artistsLimit) + barPadding) * i) + (barVerticalMargin * i) + 20)
      .attr('x', 100)
      .transition()
      .duration(500)
      .delay((d, i) => (i + 1) * 500)
      .attr('opacity', 1);

    barGroups.append('text')
      .attr('fill', '#AAAAAA')
      .attr('opacity', 0)
      .text(d => `${d.followers} followers`)
      .attr('font-size', 14)
      .attr('text-anchor', 'end')
      .attr('y', (d, i) => (((svgHeight / artistsLimit) + barPadding) * i) + (barVerticalMargin * i) + 70)
      .attr('x', (d) => {
        if (xScale(d.followers) >= 100) {
          return 100 + (xScale(d.followers) * 0.9);
        }
        return 230;
      })
      .transition()
      .duration(500)
      .delay((d, i) => (i + 1) * 500)
      .attr('opacity', 1);

    barGroups.append('rect')
      .attr('fill', '#2ecc71')
      .attr('width', 0)
      .attr('height', svgHeight / artistsLimit / 3)
      .attr('y', (d, i) => (((svgHeight / artistsLimit) + barPadding) * i) + (barVerticalMargin * i) + 30)
      .attr('x', 100)
      .attr('rx', 5)
      .attr('ry', 5)
      .transition()
      .duration(1000)
      .delay((d, i) => (i + 1) * 500)
      .ease(d3.easeBounceOut)
      .attr('width', d => xScale(d.followers) * 0.9);
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
