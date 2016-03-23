(function() {
  'use strict';
  frontWWW.controller('homeCtrl', ['$scope', '$location', '$routeParams', 'suwemAdapter', '$log', homeCtrl]);

  function homeCtrl($scope, $location, $routeParams, suwemAdapter, $log){
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
      suwemAdapter.getEventsByUserId($scope._data.user.SlackId, function(err, events){
        if(err)
          return next('Error getting events for ' + rootScope._data.user.userId + ' ' + err);

        $scope.allEvents = events;
        next();
      });
    }

  }
}());
