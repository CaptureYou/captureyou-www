module.exports = slackAuthStrategy;

var passport = require('passport');
var SlackStrategy = require('passport-slack').Strategy;
var request = require('request');

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

function slackAuthStrategy() {
  var strategy = new SlackStrategy({
      clientID: '3578301096.9755177731',
      clientSecret: '1528450c53e9414f29fa1b954ddc71aa',
      callbackURL: 'http://localhost:8080/auth/slack/callback'
    }, postAuthFlow);

  passport.use('slack', strategy);
}

function postAuthFlow(accessToken, refreshToken, data, done) {
  var method = 'slackAuthStrategy' + ' | '+ postAuthFlow.name;
  logs.info('In', method);

  var token = 'accessToken ' + accessToken;
  var url = apiCall + '/syncUser'

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
  });

}
