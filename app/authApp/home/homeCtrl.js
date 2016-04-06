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
