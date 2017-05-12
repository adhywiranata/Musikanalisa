import React from 'react';
import glamorous from 'glamorous';
import { Link } from 'react-router-dom';

const Box = glamorous.div({});

const RelativeBox = glamorous.div({
  position: 'relative',
});

const List = glamorous.div({
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'center',
  padding: 100,
  boxSizing: 'border-box',
});

const Card = glamorous.div({
  width: '20%',
  margin: '20px 10px',
  padding: 0,
  backgroundColor: '#FFFFFF',
  borderRadius: 5,
  paddingBottom: 20,
});

const ImageOverlay = glamorous.div({
  top: 0,
  width: '100%',
  height: '98%',
  position: 'absolute',
  backgroundColor: 'rgba(0,0,0, .5)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
});

const Title = glamorous.h4({
  color: '#FFFFFF',
  bottom: 20,
  textAlign: 'center',
});

const Text = glamorous.p({
  fontSize: '0.8em',
  color: '#333333',
});

const Ul = glamorous.ul({
  padding: 0,
});

const Li = glamorous.li({
  color: '#1ED760',
  fontSize: '0.8em',
  padding: 0,
  listStyleType: 'none',
});

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
              <Link key={artist.id} to={`/artist/${artist.id}`} style={{ textDecoration: 'none' }}>
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
