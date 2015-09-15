ctrlApp
.factory('Camera', ['$q', function ($q) {
        
        return {
            getPicture: function (options) {
                var q = $q.defer();
                
                try {
                    navigator.camera.getPicture(function (result) {
                        // Do any magic you need
                        q.resolve(result);
                    }, function (err) {
                        
                        q.reject(err);
                    }, options);

                } catch (e) {
                    console.log("Camera Not Supported!");
                }
                
                return q.promise;
            }
        }
    }])


ctrlApp.service('DataLayer', ['$http', '$location', function ($http, $location) {
        var data = {};
        var baseUrl = "http://localhost:1337/api";
        
        data.getFeed = function (schema) {
            return $http.get(baseUrl + '/feed');
        }
        
        data.getAroundMe = function (schema) {
            return $http.get(baseUrl + '/feed');
        }

        return data;
    }]);