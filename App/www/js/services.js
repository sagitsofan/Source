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
        var schemaPosts = "feed";
        var baseUrl = "http://imsandbox.cloudapp.net/api";

        data.getFeed = function () {
            return $http.get(baseUrl + '/' + schemaPosts);
        }
        
        data.getAroundMe = function () {
            return $http.get(baseUrl + '/' + schemaPosts);
        }

        data.addComment = function(postId, userId, userFullName, commentText){
          var data = {
            "userId": userId,
            "userFullName": userFullName,
            "title": commentText
          };

          return $http.post(baseUrl + '/update/' + schemaPosts + '/' + postId, {
            data: data
          });

        }

        data.updateRowData = function (schema, id, data) {
            return $http.post(baseUrl + '/update/' + schema + '/' + id, {
                data: data
            });
        }
        
        data.deleteRowData = function (schema, id) {
            return $http.post(baseUrl + '/delete/' + schema + '/' + id);
        }
        
        data.addRowData = function (schema, data) {
            return $http.post(baseUrl + '/add/' + schema + '/', { data });
        }



        return data;
    }]);