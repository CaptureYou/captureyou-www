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
