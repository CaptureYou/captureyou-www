
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
      })
      .otherwise({
        redirectTo: '/'
      });
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
      $rootScope._data.user.firstName = sack.userData.fullName.givenName;
      $rootScope._data.title = $rootScope._data.user.displayName + ' | CaptureYou';
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

(function () {
  'use strict';

  frontWWW.service('adapterService', ['API_CALL', '$http',
    adapterService
  ]);

  function adapterService(API_CALL, $http) {
    function handler(promise, callback) {
      if (callback) {
        promise
          .success(function (data) {
            callback(null, data);
          })
          .error(function (data) {
            callback(data, null);
          });
      }
      return promise;
    }
    return {
      get: function (path, callback) {
        var promise = $http.get(API_CALL + path);
        return handler(promise, callback);
      },
      put: function (path, body, callback) {
        var promise = $http.put(API_CALL + path, body);
        return handler(promise, callback);
      },
      post: function (path, body, callback) {
        var promise = $http.post(API_CALL + path, body);
        return handler(promise, callback);
      },
      delete: function (path, callback) {
        var promise = $http.delete(API_CALL + path);
        return handler(promise, callback);
      }
    };
  }
}());

(function () {
  'use strict';

  frontWWW.factory('captureYouAdapter', ['adapterService',
    captureYouAdapter
  ]);

  function captureYouAdapter(adapterService) {
    // alias shippableService
    var CALLER = adapterService;
    return {

      /***********
      User Routes
      ************/

      getUserId: function (callback) {
        return CALLER.get(
          '/users',
          callback);
      },
      getUserById: function (userID, callback) {
        return CALLER.get(
          '/users/' + userID,
          callback);
      }
    }
  }
})();

(function() {
  'use strict';
  frontWWW.controller('homeCtrl', ['$scope', '$location', '$routeParams', 'captureYouAdapter', '$log', homeCtrl]);

  function homeCtrl($scope, $location, $routeParams, captureYouAdapter, $log){
    var sack = {};
    async.series([
      reset_,
    ],
    function(err){
      if(err)
        $log.error(err);
    });

    function reset_(next){
      $scope._data.title = 'Home | ' + $scope._data.user.displayName;
      next();
    }
  }
}());
