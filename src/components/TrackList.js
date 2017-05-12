import React from 'react';
import { Link } from 'react-router-dom';

const styles = {
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
};

const TrackList = ({ items }) => (
  <div style={styles.list}>
    { items.map((item, index) => (
      <div key={index} style={styles.card}>
        <div style={{ position: 'relative' }}>
          <img src={item.album.images[0].url} width="100%" alt={''} />
          <div style={{ top: 0, width: '100%', height: '98%', position: 'absolute', backgroundColor: 'rgba(0,0,0, .5)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <h4 style={{ color: '#FFFFFF', bottom: 20, textAlign: 'center' }}>{ item.name }</h4>
          </div>
        </div>
        <div>
          <span style={{ fontSize: '0.8em', color: '#666' }}>Artists</span>
          <ul style={{ padding: 0 }}>
            { item.artists.map(artist => (
              <Link key={artist.id} to={`/artist/${artist.id}`} style={{ textDecoration: 'none' }}>
                <li style={{ color: '#1ED760', fontSize: '0.8em', padding: 0, listStyleType: 'none' }}>
                  { artist.name }
                </li>
              </Link>),
            )}
          </ul>
        </div>
      </div>
    ),
    )}
  </div>
);

export default TrackList;
