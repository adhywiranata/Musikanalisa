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
    marginBottom: 80,
  },
  svgWrapper: {
    height: 600,
    width: '80%',
  },
};

class NewReleases extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accessToken: '',
      newReleases: [],
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
      url: 'https://api.spotify.com/v1/browse/new-releases',
      headers: {
        Authorization: `Bearer ${this.state.accessToken}`,
      },
    }).then((res) => {
      const albumsIds = res.data.albums.items.map(item => item.id).join(',');
      axios({
        method: 'GET',
        url: `https://api.spotify.com/v1/albums?ids=${albumsIds}`,
        headers: {
          Authorization: `Bearer ${this.state.accessToken}`,
        },
      }).then(resInner => this.fetchSuccess(resInner.data.albums))
      .catch(() => {
        this.setState({ fetchDone: true, fetchError: true });
      });
    })
    .catch(() => {
      this.setState({ fetchDone: true, fetchError: true });
    });
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

  renderSvg() {
    const { newReleases } = this.state;
    const dataset = newReleases.map(release => ({
      id: release.id,
      name: release.name,
      popularity: release.popularity,
      image: release.images[0].url,
    }));

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
    const barPadding = 30;
    const customElasticEasing = d3.easeElastic.period(0.7);
    const popularities = dataset.map(item => item.popularity);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(popularities)])
      .range([svgHeight, 0]);

    const barGroup = svg.selectAll('g')
      .data(dataset)
      .enter()
      .append('g')
      .attr('class', (d, i) => `bar-group-${i}`);

    barGroup.append('rect')
      .attr('class', (d, i) => `bar-group-contain-${i}`)
      .attr('fill', 'none')
      .attr('stroke', 'rgba(255, 255, 255, 0.3)')
      .attr('stroke-width', 1)
      .attr('width', (svgWidth / 20) - barPadding)
      .attr('x', (d, i) => ((svgWidth / 20) * i) + barPadding)
      .attr('height', svgHeight)
      .attr('y', 0);

    barGroup.append('rect')
        .attr('fill', '#1ED760')
        .attr('width', (svgWidth / 20) - barPadding)
        .attr('x', (d, i) => ((svgWidth / 20) * i) + barPadding)
        .attr('height', 0)
        .attr('y', svgHeight)
      .transition()
        .duration(1000)
        .ease(customElasticEasing)
        .delay((d, i) => i * 100)
        .attr('height', d => svgHeight - yScale(d.popularity))
        .attr('y', d => yScale(d.popularity));

    barGroup.append('text')
      .attr('fill', 'rgba(255, 255, 255, 0.8)')
      .attr('font-size', 12)
      .text(d => d.name)
      .attr('class', (d, i) => `bar-group-text-${i}`)
      .attr('x', 0)
      .attr('y', (d, i) => (((svgWidth / 20) * i) * -1) - barPadding - 10)
      .attr('transform', 'rotate(90) translate(0, -20)');

    barGroup.append('text')
      .attr('fill', 'rgba(255, 255, 255, 0.5)')
      .attr('font-size', 12)
      .text(d => d.popularity)
      .attr('x', (d, i) => ((i + 1) * (svgWidth / 20)) - (barPadding / 2) - 2)
      .attr('y', svgHeight)
    .transition()
      .duration(1000)
      .delay((d, i) => i * 100)
      .ease(customElasticEasing)
      .attr('y', d => yScale(d.popularity) - 5);

    const barGroupBack = barGroup.append('rect')
      .attr('class', (d, i) => `bar-group-back bar-group-background-${i}`)
      .attr('opacity', 0)
      .attr('fill', 'transparent')
      .attr('width', (svgWidth / 20) + 5)
      .attr('x', (d, i) => (((svgWidth / 20) * i) + barPadding) - 10)
      .attr('height', svgHeight + 20)
      .attr('y', -20);

    barGroupBack.on('mouseenter', (d, i) => {
      svg.select(`.bar-group-text-${i}`).attr('fill', 'rgba(255, 255, 255, 1)');
      svg.select(`.bar-group-contain-${i}`).attr('stroke', 'rgba(255, 255, 255, 0.7)');
      svg.select(`.bar-group-background-${i}`).attr('fill', '#999').attr('opacity', 0.3);
    });

    barGroupBack.on('mouseleave', (d, i) => {
      svg.select(`.bar-group-text-${i}`).attr('fill', 'rgba(255, 255, 255, 0.8)');
      svg.select(`.bar-group-contain-${i}`).attr('stroke', 'rgba(255, 255, 255, 0.3)');
      svg.select(`.bar-group-background-${i}`).attr('fill', 'transparent').attr('opacity', 0);
    });

    const yAxis = d3.axisLeft(yScale).ticks(d3.max(popularities) / 5);

    svg.append('g')
      .attr('class', 'y axis')
      .call(yAxis);

    d3.select('.y.axis').select('.domain').attr('stroke', 'rgba(255, 255, 255, 0.8)');
    const axisTicks = d3.select('.y.axis').selectAll('.tick');
    axisTicks.select('line')
      .attr('stroke', 'rgba(255, 255, 255, 0.1)')
      .attr('x2', svgWidth + 50);
    axisTicks.select('text').attr('fill', '#FFFFFF').style('font-size', 16);

    svg.append('text')
      .attr('x', -40)
      .attr('y', -20)
      .text('POPULARITY')
      .attr('fill', 'rgba(255,255,255, 0.8)')
      .style('font-size', 20)
      .style('font-weight', 700);

    svg.append('line')
      .attr('stroke', '#FFFFFF')
      .attr('stroke-width', 0.5)
      .attr('x1', 0.5)
      .attr('x2', svgWidth + 50)
      .attr('y1', svgHeight + 1)
      .attr('y2', svgHeight + 1);
  }

  renderFetchedList() {
    const { newReleases, fetchDone, fetchError } = this.state;
    if (!fetchError && fetchDone) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
          <div id="svgWrapper" style={styles.svgWrapper} />
          <AlbumList items={newReleases} />
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
        <h2 style={styles.sectionHeading}>New Releases</h2>
        { this.renderFetchedList() }
      </div>
    );
  }
}

export default NewReleases;
