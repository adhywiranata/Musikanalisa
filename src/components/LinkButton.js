import React from 'react';
import { Link } from 'react-router-dom';

const styles = {
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
};

const LinkButton = ({ linkTo, label }) => (
  <Link to={linkTo}>
    <button style={styles.btn}>
      { label }
    </button>
  </Link>
);

export default LinkButton;
