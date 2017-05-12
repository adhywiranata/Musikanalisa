import React from 'react';
import axios from 'axios';

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

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    // axios('https://api.spotify.com/v1/artists/0bAsR2unSRpn6BQPEnNlZm/albums')
    //   .then(res => this.setState({ albums: res.data.items }));
  }

  render() {
    return (
      <div style={styles.container}>
        <h2 style={styles.sectionHeading}>Hello!</h2>
      </div>
    );
  }
}

export default Home;
