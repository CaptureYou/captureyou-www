var express = require('express');
// Connect middleware for express
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');

// Core modules
var passport = require('passport');
var path = require('path');

// Utils
var async = require('async');
var request = require('request');


module.exports = Routes;


function Routes() {
  initialize();
}

function initialize(){
  app.use(bodyParser.json({
    limit: '10mb'
  }));
  app.use(bodyParser.urlencoded({ extended: true }));

  // Views config
  app.set('views', 'app/static/views');
  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');

  // Cookies
  app.use(cookieParser('captureyouwww'));
  app.use(session({ secret: 'captureyouwww', resave: true, saveUninitialized: true}));
  app.use(function (req, res, next) {
    res.cookie('apiCall', apiCall);
    next();
  });
  //Passport Init

  app.use(passport.initialize());
  app.use(passport.session());
  // require('../general/facebookAuthStrategy.js')();
  require('../general/facebookAuthStrategy.js')();
  // require('../general/gplusAuthStrategy.js')();
  app.use(express.static(path.join(__dirname, '..', '/app')));

  app.get('/index.html', function (req, res) {
    res.render(path.resolve('app/static/views/landing.html'), {},
    function (err, html) {
      if (err) {
        res.send(500, 'Internal Error');
        return;
      }
      res.send(html);
    });
  });

  // Passport Auth

/*  app.get('/auth/slack',
    passport.authorize('slack'));

  app.get('/auth/slack/callback',
    passport.authenticate('slack', { failureRedirect: '/auth/slack' } ),
    function (req, res) {
      logs.debug(req.user.displayName, 'successfully logged in.');
      res.redirect('/');
    });*/

  app.get('/auth/facebook',
    passport.authenticate('facebook', { scope: 'email'}));

  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/' }),
    function(req, res) {
      // Successful authentication, redirect home.
      res.redirect('/');
    });

  app.get('/logout',
    function(req, res){
      res.clearCookie('accessToken');
      req.logout();
      res.redirect('/');
  });

  app.get('/login',
    function(req, res){
      res.redirect('/auth/facebook');
  });

  app.use(authentication);

  app.get('/', function (req, res) {
    res.render(path.resolve('app/static/views/landing.html'), {},
    function (err, html) {
      if (err) {
        res.send(500, 'Internal Error');
        return;
      }
      res.send(html);
    });
  });

  app.get('*',
    function (req, res) {
      logs.debug(req.originalUrl);
      res.redirect('/');
  });


  function authentication(req, res, next) {
    if (req.isAuthenticated() && req.user.tokens) {
        res.cookie('accessToken', req.user.tokens);
        return authorizeAccount(req, res);
    }
    return next();
    /*if (req.cookies.apiToken && (!req.user || !req.user.apiToken)) {
      logger.debug('apiToken cookie found, logging in');
      return loginWithLastUsedProvider(req.cookies.apiToken, req, res);
    }
    if (!req.cookies.apiToken) {
      var pathArray = req.path.split('/');
      if (pathArray.indexOf('builds') >= 0 ||
        pathArray.indexOf('projects') >= 0)
        return authorizePublicRoute(req, res);
      if (req.path.length > 1)
        return res.redirect('/?redirectUrl=' + req.path);
      return next();
    }*/
  }

  function authorizeAccount(req, res) {
    var opts = {
      appSource: 'app.joint.js'
    };
    res.render(path.resolve('app/authApp/app.html'), opts,
      function (err, html) {
        if (err) {
          return res.redirect('/logout');
        }
        res.send(html);
      });
  }
}
