import React from 'react';
import { Link } from 'react-router-dom';
import glamorous from 'glamorous';

const Button = glamorous.button({
  backgroundColor: '#1ED760',
  padding: 20,
  border: 0,
  borderRadius: 10,
  fontSize: '1.2em',
  cursor: 'pointer',
  color: '#FFFFFF',
  outline: 'none',
});

const LinkButton = ({ linkTo, label }) => (
  <Link to={linkTo}>
    <Button>{ label }</Button>
  </Link>
);

export default LinkButton;
