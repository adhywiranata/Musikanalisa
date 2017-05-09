import React from 'react';
import { Link } from 'react-router-dom';
import glamorous from 'glamorous';

const Button = glamorous.button({
  backgroundColor: 'transparent',
  padding: 20,
  border: '1px solid #1ED760',
  borderRadius: 10,
  fontSize: '1.2em',
  cursor: 'pointer',
  color: '#1ED760',
  outline: 'none',
  transition: 0.5,
  ':hover': {
    backgroundColor: '#1ED760',
    borderColor: '#1ED760',
    color: '#FFFFFF',
    transition: 0.5,
  },
});

const LinkButton = ({ linkTo, label }) => (
  <Link to={linkTo}>
    <Button>{ label }</Button>
  </Link>
);

export default LinkButton;
