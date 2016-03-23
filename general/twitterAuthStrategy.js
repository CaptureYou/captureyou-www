module.exports = twitAuthStrategy;

var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
var request = require('request');

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

function twitAuthStrategy() {
  var twitter = new TwitterStrategy({
      consumerKey: '0ohg3IcGQAhb1Wt8rdOJEGm24',
      consumerSecret: 'IaQ38XhxnJrxiM4nGbltcoeFTuwjxXMnlsizyMUHtg8WSCbxig',
      callbackURL: 'http://localhost:8000/auth/twitter/callback'
    }, postAuthFlow);

  passport.use('twitter', twitter);
}

function postAuthFlow(accessToken, refreshToken, data, done) {
  var method = 'twitAuthStrategy' + ' | '+ postAuthFlow.name;
  logs.info('In', method);

  var token = 'accessToken ' + accessToken;
  var url = apiCall + '/syncUser'

  logs.info(data);
/*
  var postRequest = {
    url: url,
    json: {
      SlackId: data.id
    },
    headers: {
      'Authorization': token
    }
  };
  request.post(postRequest, function (err, res, body) {
    if (err) {
      return done(new CallErr(method, CallErr.ImportDataFailed,
        'Error Syncing User Data.', err));
    }
    var user = {
      SlackId: body.SlackId,
      displayName: body.displayName,
      accessToken: body.tokens,
      fullName: body.fullName,
      email: body.email,
      image: body.image
    };
    return done(err, user);
  });*/

}
