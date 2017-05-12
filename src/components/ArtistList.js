import React from 'react';
import glamorous from 'glamorous';

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

const BoxImage = glamorous.img({
  maxHeight: 250,
  maxWidth: '100%',
  backgroundSize: 'contain',
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

const ArtistList = ({ items }) => (
  <List>
    { items.map((item, index) => (
      <Card key={index}>
        <RelativeBox>
          <BoxImage src={item.images[0].url} alt={''} />
          <ImageOverlay>
            <Title>{ item.name }</Title>
          </ImageOverlay>
        </RelativeBox>
        <Box>
          <Text>Artists</Text>
          <Ul style={{ padding: 0 }}>
            <Li>s</Li>
          </Ul>
        </Box>
      </Card>
    ),
    )}
  </List>
);

export default ArtistList;
