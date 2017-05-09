import React from 'react';
import { Link } from 'react-router-dom';

import styled from 'styled-components';

const Box = styled.div``;

const RelativeBox = styled.div`
  position: relative;
`;

const List = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  padding: 100px;
  box-sizing: border-box;
`;

const Card = styled.div`
  width: 20%;
  margin: 20px 10px;
  padding: 0px;
  background-color: #FFFFFF;
  border-radius: 5px;
  padding-bottom: 20px;
`;

const ImageOverlay = styled.div`
  top: 0;
  width: 100%;
  height: 98%;
  position: absolute;
  background-color: rgba(0,0,0, .5);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const Title = styled.h4`
  color: #FFFFFF;
  bottom: 20;
  text-align: center;
`;

const Text = styled.p`
  font-size: 0.8em;
  color: #333333;
`;

const Ul = styled.ul`
  padding: 0;
`;

const Li = styled.li`
  color: #1ED760;
  fontSize: 0.8em;
  padding: 0;
  list-style-type: none;
`;

const AlbumList = ({ items }) => (
  <List>
    { items.map((item, index) => (
      <Card key={index}>
        <RelativeBox>
          <img src={item.images[0].url} width="100%" alt={''} />
          <ImageOverlay>
            <Title>{ item.name }</Title>
          </ImageOverlay>
        </RelativeBox>
        <Box>
          <Text>Released on: { item.release_date }</Text>
          <Text>Popularity: { item.popularity }</Text>
          <Text>Artists</Text>
          <Ul style={{ padding: 0 }}>
            { item.artists.map(artist => (
              <Link key={artist.id} to="/" style={{ textDecoration: 'none' }}>
                <Li>
                  { artist.name }
                </Li>
              </Link>),
            )}
          </Ul>
        </Box>
      </Card>
    ),
    )}
  </List>
);

export default AlbumList;
