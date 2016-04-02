(function() {
  'use strict';
  frontWWW.controller('homeCtrl', ['$scope', '$location', '$routeParams', 'captureYouAdapter', '$log', homeCtrl]);

  function homeCtrl($scope, $location, $routeParams, captureYouAdapter, $log){
    var sack = {};
    async.series([
      reset_,
      getEvents_
      //
    ],
    function(err){
      if(err)
        $log.error(err);
    });

    function reset_(next){
      $scope._data.title = 'Home | ' + $scope._data.user.displayName;
      $scope.allEvents = {};
      next();
    }

    function getEvents_(next){
      captureYouAdapter.getEventsByUserId($scope._data.user.SlackId, function(err, events){
        if(err)
          return next('Error getting events for ' + rootScope._data.user.userId + ' ' + err);

        $scope.allEvents = events;
        next();
      });
    }

  }
}());
