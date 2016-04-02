'use strict'
var frontWWW = angular.module('frontWWW', ['ngRoute']);
frontWWW.config(['$routeProvider', '$locationProvider', '$httpProvider',
  function ($routeProvider, $locationProvider, $httpProvider){
    var basePath = '/authApp/';
    var token = $.cookie('accessToken');
    $httpProvider.defaults.headers.common.Authorization = 'accessToken ' + token;
    $routeProvider
      .when('/', {
        templateUrl: basePath + 'home/home.html',
        controller: 'homeCtrl'
      })/*
      .when('/events', {
        templateUrl: basePath + 'events/index.html',
        controller: 'eventsCtrl'
      })
      .when('/events/newEvent', {
        templateUrl: basePath + 'events/form.html',
        controller: 'newEventCtrl'
      })*/
      .otherwise({
        redirectTo: '/'
      });

      /*
      .when('/:user', {
        templateUrl: basePath + ''
      })
      */
      $locationProvider.html5Mode(true);
  }
]);

(function() {
  frontWWW.run(['$rootScope', '$route', '$location', 'captureYouAdapter', '$log',runApp]);

  function runApp($rootScope, $route, $location, captureYouAdapter, $log){
    $rootScope._data = {};
    var sack = {};
    async.series([
      getUserId_,
      getUserData_
    ],
    function(err){
      if(err)
        $log.error(err);

      $rootScope._data.user = sack.userData;
      $rootScope._data.user.firstName = sack.userData.fullName.split(" ")[0];
      $rootScope._data.title = $rootScope._data.user.displayName + ' | SUW EM';
      $rootScope._data.appLoaded = true;
    });

    function getUserId_(next){
      captureYouAdapter.getUserId(function(err, userId){
        if(err)
          return next('Error getting User ID: ' + err);

        sack.userId = userId;
        next();
      });
    }

    function getUserData_(next){
      if(!sack.userId){
        return next();
      }
      captureYouAdapter.getUserById(sack.userId, function(err, userData){
        if(err)
          return next('Error getting User ' + sack.userId + ' data: ' + err)
        sack.userData = userData[0];
        next();
      })
    }
  }


})();

frontWWW.constant('API_CALL', $.cookie('apiCall'));
frontWWW.constant('ACC_TOKEN', $.cookie('accessToken'));
