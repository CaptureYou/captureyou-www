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
