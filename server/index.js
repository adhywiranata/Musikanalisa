var express = require('express')
var request = require('request');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
require('dotenv').config();

var generateRandomString = require('./helpers').generateRandomString;

var app = express()
var client_id = process.env.CLIENT_ID; // Your client id
var client_secret = process.env.CLIENT_SECRET; // Your secret
var redirect_uri = 'http://localhost:1234/callback/'; // Your redirect uri

app.use(express.static(__dirname + '/public'))
   .use(cookieParser());

var stateKey = 'spotify_auth_state';

app.get('/login', function(req, res) {

 var state = generateRandomString(16);
 res.cookie(stateKey, state);

 // your application requests authorization
 var scope = 'user-read-private user-read-email user-follow-read';
 res.redirect('https://accounts.spotify.com/authorize?' +
   querystring.stringify({
     response_type: 'code',
     client_id: client_id,
     scope: scope,
     redirect_uri: redirect_uri,
     state: state
   }));
});

app.get('/callback', function(req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
            refresh_token = body.refresh_token;

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
          console.log(body);
        });
        
        // we can also pass the token to the browser to make requests from there
        res.redirect('http://localhost:3000/callback/' + access_token + '/' + refresh_token);
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

app.get('/refresh_token', function(req, res) {

  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});

app.listen(1234, function () {
  console.log('Example app listening on port 1234!')
})
