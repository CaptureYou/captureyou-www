module.exports = fbAuthStrategy;

var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var request = require('request');

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

function fbAuthStrategy() {
  var facebook = new FacebookStrategy({
      clientID: '921781467943081',
      clientSecret: '92eed436bd5100af98c8bf9c2da0435e',
      callbackURL: 'http://localhost:8000/auth/facebook/callback',
      profileFields: ['id', 'name','picture.type(large)', 'emails', 'displayName', 'about', 'gender', 'bio', 'hometown']
    }, postAuthFlow);

  passport.use('facebook', facebook);
}

function postAuthFlow(accessToken, refreshToken, data, done) {
  var method = 'fbAuthStrategy' + ' | '+ postAuthFlow.name;
  logs.debug('In', method);
  var token = 'accessToken ' + accessToken;
  var url = apiCall + '/syncUser';
  data.token = accessToken;
  var postRequest = {
    url: url,
    json: {
      facebookId: data.id,
      fullName: data.name,
      displayName: data.displayName,
      email: data._json.email,
      image: data.photos[0]["value"],
      tokens: [accessToken]
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
      facebookId: body.facebookId,
      fullName: body.name,
      displayName: body.displayName,
      email: body.email,
      image: body.image,
      tokens: body.tokens
    };
    return done(err, user);
  });

}
